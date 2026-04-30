
# Check GPU
import torch
print(f"PyTorch: {torch.__version__}")
print(f"CUDA: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")

!cat /proc/cpuinfo | grep "model name" | head -1
!cat /proc/cpuinfo | grep "cpu cores" | head -1
!free -h

# %pip install -q torch transformers safetensors thop numpy pandas einops

# =============================================================================
# 1) IMPORTS & GLOBAL CONFIG
# =============================================================================

import time, gc, json
from datetime import datetime
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from dataclasses import dataclass
from typing import Callable, Optional
from einops import rearrange
from einops.layers.torch import Rearrange

DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
BATCH_SIZE = 32 if torch.cuda.is_available() else 8
NUM_RUNS = 50 

# =============================================================================
# 2) UTILS & Benchmarking functions
# =============================================================================

@dataclass(frozen=True)
class ModelSpec:
    name: str
    factory: Callable[[], nn.Module]
    leads: int
    seq_len: int
    fdim: int
    hz: Optional[int]
    duration_s: Optional[float]
    input_kind: str = "raw"  # "raw" or "tokenized"

def count_params(m): return sum(p.numel() for p in m.parameters())
def format_params(n): return f"{n/1e6:.1f}M" if n>=1e6 else f"{n/1e3:.1f}K"
def format_flops(f): return f"{f/1e9:.1f}G" if f and f>=1e9 else (f"{f/1e6:.1f}M" if f else "N/A")

def count_flops(model, x):
    """
    Count FLOPs using thop library.
    
    IMPORTANT: thop Limitations for Transformers
    =============================================
    thop does NOT correctly count matrix multiplications inside nn.MultiheadAttention
    (specifically q @ k and attn @ v operations). This means:
    
    - Transformer models using nn.TransformerEncoderLayer are UNDERCOUNTED by ~50%
    - Example: ECG-JEPA encoder shows 45 GFLOPs but actual is ~68 GFLOPs
    
    However, for RELATIVE comparisons (benchmarking models against each other),
    this is acceptable because the undercounting is CONSISTENT across models.
    
    For ABSOLUTE FLOPs (e.g., pretraining compute estimation), use custom 
    implementations with explicit @ operators, or see estimate_pretrain_flops.py.
    
    What thop counts correctly:
    - nn.Linear, nn.Conv1d, nn.Conv2d layers
    - Explicit matrix multiplications with @ operator
    
    What thop undercounts:
    - nn.MultiheadAttention (missing q@k and attn@v)
    - Some fused CUDA kernels (FlashAttention, etc.)
    """
    try:
        from thop import profile
        m, _ = profile(model, inputs=(x[:1],), verbose=False)
        return m * 2, m
    except: return None, None

def warmup(m, x, n=5):
    m.eval()
    with torch.no_grad():
        for _ in range(n): m(x)
    if torch.cuda.is_available(): torch.cuda.synchronize()

def benchmark_infer(m, x, runs=50):
    m.eval(); times = []
    with torch.no_grad():
        for _ in range(runs):
            if torch.cuda.is_available(): torch.cuda.synchronize()
            t0 = time.perf_counter(); m(x)
            if torch.cuda.is_available(): torch.cuda.synchronize()
            times.append((time.perf_counter()-t0)*1000)
    return {'mean': np.mean(times), 'std': np.std(times)}

def benchmark_train(m, x, fdim, runs=20):
    class H(nn.Module):
        def __init__(s, b, d):
            super().__init__()
            s.b = b
            s.d = d  # Store expected dim
            s.h = None  # Create linear layer lazily on first forward

        def forward(s, x):
            f = s.b(x)
            f = f[0] if isinstance(f, tuple) else f

            # Handle 3D outputs
            if f.dim() == 3:
                f = f.mean(dim=-1)  # (B, D, T) → (B, D)

            # Create linear layer on first forward (lazy initialization)
            if s.h is None:
                actual_d = f.size(-1)
                s.h = nn.Linear(actual_d, 1).to(f.device)

            return s.h(f)

    mh = H(m, fdim).to(x.device)
    mh.train()
    opt = torch.optim.AdamW(mh.parameters(), lr=1e-4)
    tgt = torch.zeros(x.size(0), 1).to(x.device)
    times = []

    for _ in range(runs):
        opt.zero_grad()
        if torch.cuda.is_available(): torch.cuda.synchronize()
        t0 = time.perf_counter()
        nn.BCEWithLogitsLoss()(mh(x), tgt).backward()
        opt.step()
        if torch.cuda.is_available(): torch.cuda.synchronize()
        times.append((time.perf_counter()-t0)*1000)

    return np.mean(times)


def get_mem(): return torch.cuda.max_memory_allocated()/1e9 if torch.cuda.is_available() else 0



# =============================================================================
# 3) MODELS
# =============================================================================

# Multilead, ECG-only, patch-based ViT  - ecg-jepa, heartlang, ST-MEM

# ecg_jepa — ViT with structured cross-lead attention

class ECGJEPA(nn.Module):
    """ECG-JEPA: 8 leads, 2D patch grid, structured attention"""
    def __init__(self, embed_dim=768, depth=12, heads=16, c=8, p=50, t=50):
        super().__init__()
        self.c, self.p, self.t = c, p, t
        self.patch_embed = nn.Linear(t, embed_dim)  # 50 → 768 per patch
        self.pos_embed = nn.Parameter(torch.zeros(1, c * p, embed_dim))  # (1, 400, 768)

        # Build structured attention mask (row + column pattern)
        self.register_buffer('attn_mask', self._build_cross_attention_mask())

        encoder_layer = nn.TransformerEncoderLayer(
            embed_dim, heads, embed_dim * 4, batch_first=True
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, depth)
        self.norm = nn.LayerNorm(embed_dim)

    def _build_cross_attention_mask(self):
        """Attention: within-lead (row) OR same-time across leads (column)"""
        size = self.c * self.p  # 400
        mask = torch.zeros(size, size)

        # Row-wise: patches within same lead can attend to each other
        for i in range(self.c):
            mask[i*self.p:(i+1)*self.p, i*self.p:(i+1)*self.p] = 1

        # Column-wise: same temporal position across leads can attend
        for i in range(self.p):
            mask[i::self.p, i::self.p] = 1

        # Convert to additive mask (0 = attend, -inf = block)
        return mask.logical_not().float() * -1e9

    def forward(self, x):
        # x: (B, 8, 2500)
        B = x.size(0)
        x = x.view(B, self.c, self.p, self.t)  # (B, 8, 50, 50)
        x = x.view(B, self.c * self.p, self.t)  # (B, 400, 50)
        x = self.patch_embed(x)  # (B, 400, 768)
        x = x + self.pos_embed
        x = self.encoder(x, mask=self.attn_mask)
        return self.norm(x)

    
# heartlang - ViT with QRS tokenization

class HeartLangViT(nn.Module):
    """HeartLang: From paper Table 5 - embed_dim=768, depth=12, heads=8, mlp_dim=1024
    Input: Pre-tokenized (B, 256, 96) after QRS-Tokenizer
    """
    def __init__(self):
        super().__init__()
        seq_len, time_window = 256, 96
        embed_dim, depth, heads, mlp_dim = 768, 12, 8, 1024

        # Token embedding: Conv1d with time_window as input channels
        self.token_embed = nn.Conv1d(time_window, embed_dim, kernel_size=3, padding=1)

        # Spatial (13: 0=pad, 1-12=leads) and Temporal (11: 0=pad, 1-10=seconds)
        self.spa_embed = nn.Embedding(13, embed_dim)
        self.tem_embed = nn.Embedding(11, embed_dim)

        # CLS token and position embedding
        self.cls_token = nn.Parameter(torch.randn(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.randn(1, seq_len + 1, embed_dim))

        # Transformer with pre-norm
        encoder_layer = nn.TransformerEncoderLayer(
            embed_dim, heads, mlp_dim, dropout=0.1,
            batch_first=True, norm_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, depth)
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        # x: (B, 256, 96) - pre-tokenized heartbeats
        B = x.size(0)
        x = self.token_embed(x.permute(0, 2, 1)).transpose(1, 2)
        cls = self.cls_token.expand(B, -1, -1)
        x = torch.cat([cls, x], dim=1) + self.pos_embed
        x = self.norm(self.transformer(x))
        return x

# st-mem — Spatiotemporal ViT for ECG (Base variant)

class ST_MEM_Attention(nn.Module):
    """Multi-head attention with einops (matches original ST-MEM)"""
    def __init__(self, dim, heads=12, dim_head=64, qkv_bias=True, dropout=0.):
        super().__init__()
        inner_dim = dim_head * heads
        self.heads = heads
        self.scale = dim_head ** -0.5
        
        self.to_qkv = nn.Linear(dim, inner_dim * 3, bias=qkv_bias)
        self.attend = nn.Softmax(dim=-1)
        self.attn_dropout = nn.Dropout(dropout)
        self.to_out = nn.Sequential(nn.Linear(inner_dim, dim), nn.Dropout(dropout))
        
    def forward(self, x):
        qkv = self.to_qkv(x).chunk(3, dim=-1)
        q, k, v = map(lambda t: rearrange(t, 'b n (h d) -> b h n d', h=self.heads), qkv)
        
        dots = torch.matmul(q, k.transpose(-1, -2)) * self.scale
        attn = self.attend(dots)
        attn = self.attn_dropout(attn)
        out = torch.matmul(attn, v)
        
        out = rearrange(out, 'b h n d -> b n (h d)')
        return self.to_out(out)


class ST_MEM_FeedForward(nn.Module):
    """MLP with GELU activation (matches original ST-MEM)"""
    def __init__(self, dim, hidden_dim, dropout=0.):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, dim),
            nn.Dropout(dropout)
        )
        
    def forward(self, x):
        return self.net(x)


class ST_MEM_TransformerBlock(nn.Module):
    """Transformer block with PreNorm pattern (matches original ST-MEM)"""
    def __init__(self, dim, heads, dim_head, mlp_dim, dropout=0.):
        super().__init__()
        self.norm1 = nn.LayerNorm(dim)
        self.attn = ST_MEM_Attention(dim, heads, dim_head, dropout=dropout)
        self.norm2 = nn.LayerNorm(dim)
        self.ff = ST_MEM_FeedForward(dim, mlp_dim, dropout=dropout)
        
    def forward(self, x):
        x = self.attn(self.norm1(x)) + x
        x = self.ff(self.norm2(x)) + x
        return x


class ST_MEM(nn.Module):
    """ST-MEM Base: Spatiotemporal Masked Encoding Model for ECG
    Exact architecture from: https://github.com/bakqui/ST-MEM
    
    Key features:
    - Lead-aware encoding: Each lead processed separately with lead embeddings
    - SEP tokens: Left and right separator tokens per lead for segmentation
    - Patch embedding: Keeps leads separate, then flattens for transformer
    - Mean pooling: Over patches and leads after removing SEP tokens
    
    Base config: width=768, depth=12, heads=12, mlp_dim=3072
    Input: (B, 12, 2250) at 250Hz → 9 seconds
    """
    def __init__(self, width=768, depth=12, heads=12, dim_head=64,
                 num_leads=12, seq_len=2250, patch_size=75, dropout=0.):
        super().__init__()
        assert seq_len % patch_size == 0, 'Sequence length must be divisible by patch size'
        
        self.width = width
        self.depth = depth
        self.num_leads = num_leads
        num_patches = seq_len // patch_size  # 30 patches
        
        # Patch embedding: (B, C, L) → (B, C, N, width)
        # Keeps leads separate unlike Conv1d approach
        self.to_patch_embedding = nn.Sequential(
            Rearrange('b c (n p) -> b c n p', p=patch_size),  # (B, 12, 30, 75)
            nn.LayerNorm(patch_size),                          # Norm over patch_size
            nn.Linear(patch_size, width),                      # Project to width
            nn.LayerNorm(width)                                # Norm over width
        )
        
        # Positional embeddings: +2 for left and right SEP tokens
        self.pos_embedding = nn.Parameter(torch.randn(1, num_patches + 2, width))
        
        # SEP embedding: shared separator token
        self.sep_embedding = nn.Parameter(torch.randn(width))
        
        # Lead embeddings: unique embedding per lead
        self.lead_embeddings = nn.ParameterList([
            nn.Parameter(torch.randn(width)) for _ in range(num_leads)
        ])
        
        # Transformer blocks
        mlp_dim = width * 4  # 3072 for base
        self.blocks = nn.ModuleList([
            ST_MEM_TransformerBlock(width, heads, dim_head, mlp_dim, dropout)
            for _ in range(depth)
        ])
        self.dropout = nn.Dropout(dropout)
        self.norm = nn.LayerNorm(width)
        
    def forward(self, x):
        # x: (B, 12, 2250)
        b = x.shape[0]
        num_leads = x.shape[1]
        
        # Patch embedding: (B, 12, 2250) → (B, 12, 30, 768)
        x = self.to_patch_embedding(x)
        n = x.shape[2]  # num_patches = 30
        
        # Add positional embeddings (excluding first and last for patches)
        x = x + self.pos_embedding[:, 1:n+1, :].unsqueeze(1)
        
        # Create SEP tokens with positional embeddings
        sep = self.sep_embedding[None, None, None, :]  # (1, 1, 1, width)
        left_sep = sep.expand(b, num_leads, -1, -1) + self.pos_embedding[:, :1, :].unsqueeze(1)
        right_sep = sep.expand(b, num_leads, -1, -1) + self.pos_embedding[:, -1:, :].unsqueeze(1)
        
        # Concatenate: [LEFT_SEP, patches, RIGHT_SEP] per lead
        x = torch.cat([left_sep, x, right_sep], dim=2)  # (B, 12, 32, 768)
        
        # Add lead embeddings
        lead_emb = torch.stack([e for e in self.lead_embeddings])  # (12, 768)
        lead_emb = lead_emb[None, :, None, :].expand(b, -1, n + 2, -1)  # (B, 12, 32, 768)
        x = x + lead_emb
        
        # Flatten leads into sequence: (B, 12, 32, 768) → (B, 384, 768)
        x = rearrange(x, 'b c n d -> b (c n) d')
        
        # Transformer
        x = self.dropout(x)
        for block in self.blocks:
            x = block(x)
        
        # Reshape back to (B, 12, 32, 768)
        x = rearrange(x, 'b (c n) d -> b c n d', c=num_leads)
        
        # Remove SEP tokens: keep only patches
        x = x[:, :, 1:-1, :]  # (B, 12, 30, 768)
        
        # Mean pooling over leads and patches
        x = x.mean(dim=(1, 2))  # (B, 768)
        
        return self.norm(x)


# Multilead, ECG-only, State Space Model - ecg_cpc (SSL: conv encoder + S4), S4_supervised (SL: S4)

# ecg_cpc — Conv encoder + S4 model for ECG SSL

class S4DKernel(nn.Module):
    """S4D Kernel - Diagonal State Space with HiPPO initialization"""
    def __init__(s, d_model, d_state=64, lr=0.001):
        super().__init__()
        # HiPPO-LegS initialization for diagonal A matrix
        A = torch.arange(1, d_state + 1, dtype=torch.float32)
        A = -0.5 + 1j * torch.pi * A  # Diagonal HiPPO approximation
        s.A = nn.Parameter(torch.view_as_real(A.repeat(d_model, 1)))  # (H, N, 2)
        s.C = nn.Parameter(torch.randn(d_model, d_state, 2) * 0.5**0.5)
        s.D = nn.Parameter(torch.ones(d_model))
        s.log_dt = nn.Parameter(torch.log(torch.rand(d_model) * (0.1 - 0.001) + 0.001))

    def forward(s, L):
        # Discretize: convert continuous to discrete SSM
        dt = torch.exp(s.log_dt)  # (H,)
        A = torch.view_as_complex(s.A)  # (H, N)
        C = torch.view_as_complex(s.C)  # (H, N)

        # Vandermonde kernel generation
        dtA = A * dt.unsqueeze(-1)  # (H, N)
        K = dtA.unsqueeze(-1) * torch.arange(L, device=A.device)  # (H, N, L)
        C_expanded = C.unsqueeze(-1)  # (H, N, 1)
        K = torch.einsum('hnl,hn->hl', torch.exp(K), C).real * 2  # (H, L)
        K = K + s.D.unsqueeze(-1)  # Add D term
        return K

class S4DLayer(nn.Module):
    """Single S4D layer with GLU and residual"""
    def __init__(s, d_model, d_state=64, dropout=0.1):
        super().__init__()
        s.d_model = d_model
        s.kernel = S4DKernel(d_model, d_state)
        s.out = nn.Linear(d_model, d_model * 2)  # For GLU
        s.norm = nn.LayerNorm(d_model)
        s.drop = nn.Dropout(dropout)

    def forward(s, x):
        # x: (B, H, L)
        L = x.size(-1)
        k = s.kernel(L)  # (H, L)

        # FFT convolution
        k_f = torch.fft.rfft(k, n=2*L)  # (H, L+1)
        x_f = torch.fft.rfft(x, n=2*L)  # (B, H, L+1)
        y = torch.fft.irfft(x_f * k_f, n=2*L)[..., :L]  # (B, H, L)

        # Output projection with GLU
        y = y.transpose(1, 2)  # (B, L, H)
        y = s.out(y)  # (B, L, 2H)
        y = y[..., :s.d_model] * torch.sigmoid(y[..., s.d_model:])  # GLU
        y = s.drop(y)

        return s.norm(y + x.transpose(1, 2)).transpose(1, 2)  # Residual + norm

class ECGCPCModel(nn.Module):
    """ECG-CPC: Conv1D encoder stack + 4 S4 layers (verified from checkpoint)"""
    def __init__(s, d_input=12, d_model=512, d_state=8, n_layers=4, dropout=0.1):
        super().__init__()
        # 4-layer Conv1D encoder (matching ECG-CPC)
        s.encoder = nn.Sequential(
            nn.Conv1d(d_input, d_model, kernel_size=3, stride=2, padding=1),  # 2400→1200
            nn.BatchNorm1d(d_model), nn.ReLU(),
            nn.Conv1d(d_model, d_model, kernel_size=1), nn.BatchNorm1d(d_model), nn.ReLU(),
            nn.Conv1d(d_model, d_model, kernel_size=1), nn.BatchNorm1d(d_model), nn.ReLU(),
            nn.Conv1d(d_model, d_model, kernel_size=1), nn.BatchNorm1d(d_model), nn.ReLU(),
        )
        # 4 S4 layers (verified from checkpoint: s4_layers.0 through s4_layers.3)
        s.s4_layers = nn.ModuleList([S4DLayer(d_model, d_state, dropout) for _ in range(n_layers)])

    def forward(s, x):
        x = s.encoder(x)      # (B, 12, 2400) → (B, 512, 1200)
        for layer in s.s4_layers:
            x = layer(x)      # (B, 512, 1200) through 4 S4 layers
        return x.mean(dim=2)  # (B, 512)

    
# S4_supervised — Single S4 layer for ECG SL

class S4Model(nn.Module):
    """Full S4D Model"""
    def __init__(s, d_input=12, d_model=512, d_state=64, n_layers=4, l_max=600, dropout=0.1):
        super().__init__()
        s.encoder = nn.Conv1d(d_input, d_model, 1)
        s.layers = nn.ModuleList([S4DLayer(d_model, d_state, dropout) for _ in range(n_layers)])
        s.d_model = d_model

    def forward(s, x):
        x = s.encoder(x)  # (B, d_input, L) -> (B, d_model, L)
        for layer in s.layers:
            x = layer(x)
        return x.mean(dim=2)  # Mean pooling -> (B, d_model)



# Multilead, ECG-only, Speech model (Wav2Vec2/HuBERT) adapted - hubert_ecg, ecgfm, deepecg 

# hubert_ecg — HuBERT model adapted for ECG

def create_hubert():
    from transformers import HubertConfig, HubertModel

    # HuBERT-ECG BASE with downsampling_factor=5 (as used in all pretrained models)
    # From code/pretrain.py lines 97-100 and finetune.sh
    # Input: 12 leads × 500 samples (after 5x decimation) → flatten to 6000
    # Conv stride: 4×2×2×2×2 = 64 → 6000/64 ≈ 93 tokens

    cfg = HubertConfig(
        hidden_size=768,
        num_hidden_layers=12,
        num_attention_heads=12,
        intermediate_size=3072,
        conv_dim=(512, 512, 512, 512, 512),      # 5 layers (not 7)
        conv_stride=(4, 2, 2, 2, 2),              # Total: 64 (not 320)
        conv_kernel=(10, 3, 3, 2, 2),             # 5 layers
        mask_time_prob=0.0,
        mask_feature_prob=0.0,
    )

    class HuBERTECGWrapper(nn.Module):
        def __init__(self):
            super().__init__()
            self.m = HubertModel(cfg)

        def forward(self, x):
            # x: (B, 12, 2500) at 500Hz
            # Decimate by 5 → (B, 12, 500) at 100Hz (as in actual preprocessing)
            x = x[:, :, ::5]
            # Flatten all leads into single sequence
            x = x.reshape(x.size(0), -1)  # (B, 6000)
            return self.m(x).last_hidden_state

    return HuBERTECGWrapper()


# ecgfm — Wav2Vec2 model

def _patch_wav2vec_first_conv(model, in_channels):
    """Replace the first Conv1d of a HF Wav2Vec2Model to accept `in_channels`
    instead of 1. fairseq-signals uses in_d=12 (leads as channels)."""
    old = model.feature_extractor.conv_layers[0].conv
    model.feature_extractor.conv_layers[0].conv = nn.Conv1d(
        in_channels=in_channels,
        out_channels=old.out_channels,
        kernel_size=old.kernel_size,
        stride=old.stride,
        bias=old.bias is not None,
    )


def _wav2vec_multichannel_forward(model, x):
    """Run a HF Wav2Vec2Model on multi-channel (B, C, T) input by calling its
    components manually. We bypass `Wav2Vec2Model.forward` because HF's
    `Wav2Vec2FeatureEncoder.forward` does `input_values[:, None]` (assuming 1D
    audio), which would expand (B, C, T) into 4D and break Conv1d.
    """
    # CNN feature extractor — call conv layers directly on (B, C, T)
    h = x
    for conv_layer in model.feature_extractor.conv_layers:
        h = conv_layer(h)              # (B, 256, T/16)
    h = h.transpose(1, 2)              # (B, T/16, 256)
    h, _ = model.feature_projection(h) # (B, T/16, 768)
    h = model.encoder(h)[0]            # (B, T/16, 768)
    return h


def create_wav2vec():
    """ECG-FM: Wav2Vec2, 12 layers, 768 dim
    From: fairseq-signals/examples/w2v_cmsc (bowang-lab/ECG-FM)

    Real fairseq-signals config sets in_d=12 (leads as channels) — input stays
    (B, 12, 5000) and produces 312 transformer tokens. The previous version
    flattened leads into time, inflating tokens to 3,750 and FLOPs ~20x.
    """
    from transformers import Wav2Vec2Config, Wav2Vec2Model

    cfg = Wav2Vec2Config(
        hidden_size=768,
        num_hidden_layers=12,
        num_attention_heads=12,
        intermediate_size=3072,
        conv_dim=(256, 256, 256, 256),        # 4 conv layers
        conv_stride=(2, 2, 2, 2),              # Total stride: 16
        conv_kernel=(2, 2, 2, 2),
        num_conv_pos_embeddings=128,
        num_conv_pos_embedding_groups=16,
        mask_time_prob=0.0,
        mask_feature_prob=0.0,
    )

    class ECGFMWrapper(nn.Module):
        def __init__(self):
            super().__init__()
            self.model = Wav2Vec2Model(cfg)
            _patch_wav2vec_first_conv(self.model, in_channels=12)

        def forward(self, x):
            # x: (B, 12, 5000) — leads as channels, no flattening
            return _wav2vec_multichannel_forward(self.model, x)

    return ECGFMWrapper()

# deepecg-SSL — Wav2Vec2 model (from DeepECG)

def create_heartwise_ssl():
    """HeartWise SSL: Wav2Vec2-CMSC, 12 layers, 768 dim
    From: fairseq-signals w2v_cmsc architecture (in_d=12, leads as channels).
    """
    from transformers import Wav2Vec2Config, Wav2Vec2Model

    # Matches SSL_pretrained.pt configuration
    cfg = Wav2Vec2Config(
        hidden_size=768,
        num_hidden_layers=12,
        num_attention_heads=12,
        intermediate_size=3072,
        conv_dim=(256, 256, 256, 256),        # 4 conv layers
        conv_stride=(2, 2, 2, 2),              # Total stride: 16
        conv_kernel=(2, 2, 2, 2),
        num_conv_pos_embeddings=128,
        num_conv_pos_embedding_groups=16,
        mask_time_prob=0.0,
        mask_feature_prob=0.0,
    )

    class HeartWiseSSLWrapper(nn.Module):
        def __init__(self):
            super().__init__()
            self.model = Wav2Vec2Model(cfg)
            _patch_wav2vec_first_conv(self.model, in_channels=12)

        def forward(self, x):
            # x: (B, 12, 2500) — leads as channels, no flattening
            return _wav2vec_multichannel_forward(self.model, x)

    return HeartWiseSSLWrapper()


# Multilead, ECG + TEXT - ESI, MELP, MERL, KED

# esi 

class GRN(nn.Module):
    """Global Response Normalization (key ConvNeXtV2 component)"""
    def __init__(self, dim):
        super().__init__()
        self.gamma = nn.Parameter(torch.zeros(1, 1, dim))
        self.beta = nn.Parameter(torch.zeros(1, 1, dim))

    def forward(self, x):
        # x: (B, L, C) in channels_last format
        Gx = torch.norm(x, p=2, dim=1, keepdim=True)  # (B, 1, C)
        Nx = Gx / (Gx.mean(dim=-1, keepdim=True) + 1e-6)  # (B, 1, C)
        return self.gamma * (x * Nx) + self.beta + x

class ConvNeXtV2Block(nn.Module):
    """ConvNeXtV2 block for 1D"""
    def __init__(self, dim, drop_path=0.):
        super().__init__()
        self.dwconv = nn.Conv1d(dim, dim, kernel_size=7, padding=3, groups=dim)
        self.norm = nn.LayerNorm(dim)
        self.pwconv1 = nn.Linear(dim, 4 * dim)
        self.act = nn.GELU()
        self.grn = GRN(4 * dim)
        self.pwconv2 = nn.Linear(4 * dim, dim)

    def forward(self, x):
        # x: (B, C, L)
        residual = x
        x = self.dwconv(x)
        x = x.permute(0, 2, 1)  # (B, C, L) -> (B, L, C)
        x = self.norm(x)
        x = self.pwconv1(x)
        x = self.act(x)
        x = self.grn(x)
        x = self.pwconv2(x)
        x = x.permute(0, 2, 1)  # (B, L, C) -> (B, C, L)
        return residual + x


class ConvNeXtV2_1D(nn.Module):
    """ConvNeXtV2-Base for 1D ECG
       depths=[3,3,27,3], dims=[128,256,512,1024]"""
    def __init__(self, in_chans=12, depths=[3,3,27,3], dims=[128,256,512,1024]):
        super().__init__()
        # Stem
        self.stem = nn.Sequential(
            nn.Conv1d(in_chans, dims[0], kernel_size=4, stride=4),
            nn.GroupNorm(1, dims[0])  # LayerNorm for channels_first
        )
        # Stages
        self.stages = nn.ModuleList()
        self.downsamples = nn.ModuleList([nn.Identity()])  # No downsample before stage 0

        for i in range(4):
            # Downsample between stages (except before first)
            if i > 0:
                self.downsamples.append(nn.Sequential(
                    nn.GroupNorm(1, dims[i-1]),
                    nn.Conv1d(dims[i-1], dims[i], kernel_size=2, stride=2)
                ))
            # Blocks for this stage
            stage = nn.Sequential(*[ConvNeXtV2Block(dims[i]) for _ in range(depths[i])])
            self.stages.append(stage)

        self.norm = nn.LayerNorm(dims[-1])

    def forward(self, x):
        # x: (B, leads, seq_len) = (B, 12, 5000) - standard format
        x = self.stem(x)

        for i, stage in enumerate(self.stages):
            if i > 0:
                x = self.downsamples[i](x)
            x = stage(x)

        x = x.mean(dim=-1)  # Global average pooling: (B, C, L) -> (B, C)
        x = self.norm(x)
        return x  # (B, 1024)
    
# MERL default - ResNet18-1D 

class BasicBlock1D(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, out_channels, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm1d(out_channels)
        self.conv2 = nn.Conv1d(out_channels, out_channels, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm1d(out_channels)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv1d(in_channels, out_channels, 1, stride, bias=False),
                nn.BatchNorm1d(out_channels)
            )

    def forward(self, x):
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        return torch.relu(out)


class ResNet1D_MERL(nn.Module):
    """1D ResNet18 matching MERL's default ECG encoder"""
    def __init__(self, in_channels=12):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm1d(64)
        self.relu = nn.ReLU(inplace=True)

        # ResNet18: [2, 2, 2, 2] BasicBlocks
        self.layer1 = self._make_layer(64, 64, 2, stride=1)
        self.layer2 = self._make_layer(64, 128, 2, stride=2)
        self.layer3 = self._make_layer(128, 256, 2, stride=2)
        self.layer4 = self._make_layer(256, 512, 2, stride=2)

        self.avgpool = nn.AdaptiveAvgPool1d(1)

    def _make_layer(self, in_ch, out_ch, blocks, stride):
        layers = []
        layers.append(BasicBlock1D(in_ch, out_ch, stride))
        for _ in range(1, blocks):
            layers.append(BasicBlock1D(out_ch, out_ch, 1))
        return nn.Sequential(*layers)

    def forward(self, x):
        # x: (B, 12, 5000)
        x = self.relu(self.bn1(self.conv1(x)))  # (B, 64, 2500)
        x = self.layer1(x)  # (B, 64, 2500)
        x = self.layer2(x)  # (B, 128, 1250)
        x = self.layer3(x)  # (B, 256, 625)
        x = self.layer4(x)  # (B, 512, 313)
        x = self.avgpool(x)  # (B, 512, 1)
        x = x.squeeze(-1)    # (B, 512)
        return x


# ViT-tiny-1D (MERL's alternative, for comparison)

class ViT1D_MERL(nn.Module):
    """1D ViT-tiny matching MERL's alternative ECG encoder"""
    def __init__(self, embed_dim=192, depth=12, heads=3, leads=12, seq_len=5000, patch_size=50, mlp_dim=768):
        super().__init__()
        n_patches = seq_len // patch_size  # 100 patches

        self.patch_embed = nn.Conv1d(leads, embed_dim, patch_size, patch_size, bias=False)
        self.pos_embed = nn.Parameter(torch.randn(1, n_patches, embed_dim))
        self.dropout = nn.Dropout(0.0)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim,
            nhead=heads,
            dim_feedforward=mlp_dim,
            batch_first=True,
            activation='gelu'
        )
        self.encoder = nn.TransformerEncoder(encoder_layer, depth)
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        # x: (B, 12, 5000)
        x = self.patch_embed(x)      # (B, 192, 100)
        x = x.transpose(1, 2)        # (B, 100, 192)
        x = x + self.pos_embed
        x = self.dropout(x)
        x = self.encoder(x)          # (B, 100, 192)
        x = torch.mean(x, dim=1)     # GAP → (B, 192)
        x = self.norm(x)
        return x


# MELP — Wav2Vec2-CMSC model

def create_melp():
    class MELPEncoder(nn.Module):
        def __init__(self):
            super().__init__()

            # CNN Feature Extractor (4 blocks, 16x downsampling)
            self.cnn = nn.Sequential(
                nn.Conv1d(12, 256, kernel_size=2, stride=2),
                nn.GroupNorm(1, 256),
                nn.GELU(),
                nn.Conv1d(256, 256, kernel_size=2, stride=2),
                nn.GroupNorm(1, 256),
                nn.GELU(),
                nn.Conv1d(256, 256, kernel_size=2, stride=2),
                nn.GroupNorm(1, 256),
                nn.GELU(),
                nn.Conv1d(256, 256, kernel_size=2, stride=2),
                nn.GroupNorm(1, 256),
                nn.GELU(),
            )

            self.proj = nn.Linear(256, 768)

            # Positional conv
            self.pos_conv = nn.Conv1d(768, 768, kernel_size=128, padding=64, groups=16)
            self.pos_norm = nn.LayerNorm(768)

            # 8-layer Transformer
            encoder_layer = nn.TransformerEncoderLayer(
                d_model=768,
                nhead=12,
                dim_feedforward=3072,
                dropout=0.0,
                activation='gelu',
                batch_first=True,
            )
            self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=8)

        def forward(self, x):
            # x: (B, 12, 5000)
            x = self.cnn(x)                    # (B, 256, 312)
            x = x.permute(0, 2, 1)             # (B, 312, 256)
            x = self.proj(x)                   # (B, 312, 768)

            # Positional encoding
            x_pos = self.pos_conv(x.permute(0, 2, 1))[:, :, :x.shape[1]]
            x = self.pos_norm(x + x_pos.permute(0, 2, 1))

            # Transformer
            x = self.transformer(x)            # (B, 312, 768)
            return x

    return MELPEncoder()


# ecgfm_ked — Wav2Vec2-CMSC + text 

class ConvBnAct(nn.Sequential):
    """Conv1d + BatchNorm1d + ReLU"""
    def __init__(self, ni, nf, ks=3, stride=1, act=True):
        padding = (ks - 1) // 2
        layers = [
            nn.Conv1d(ni, nf, ks, stride=stride, padding=padding, bias=False),
            nn.BatchNorm1d(nf)
        ]
        if act:
            layers.append(nn.ReLU(inplace=True))
        super().__init__(*layers)


class ResBlock(nn.Module):
    """Bottleneck ResBlock with expansion=4"""
    def __init__(self, expansion, ni, nf, stride=1, ks=5):
        super().__init__()
        ni_exp = ni * expansion  # input channels (expanded)
        nf_exp = nf * expansion  # output channels (expanded)

        # Main path: 1x1 -> kxk -> 1x1 (bottleneck)
        self.convs = nn.Sequential(
            ConvBnAct(ni_exp, nf, ks=1),                    # squeeze
            ConvBnAct(nf, nf, ks=ks, stride=stride),       # spatial
            ConvBnAct(nf, nf_exp, ks=1, act=False)         # expand (no act before residual add)
        )

        # Identity path (with optional projection + pooling)
        if ni_exp != nf_exp or stride != 1:
            id_layers = []
            if ni_exp != nf_exp:
                id_layers.append(ConvBnAct(ni_exp, nf_exp, ks=1, act=False))
            if stride != 1:
                id_layers.append(nn.AvgPool1d(2, ceil_mode=True))
            self.idpath = nn.Sequential(*id_layers)
        else:
            self.idpath = nn.Identity()

        self.act = nn.ReLU(inplace=True)

    def forward(self, x):
        return self.act(self.convs(x) + self.idpath(x))


class XResNet1D_101(nn.Module):
    """
    KED ECG Encoder: xResNet1D-101

    Input: (B, 12, 1000) — 12-lead ECG, 10s @ 100Hz
    Output: (B, 768, 32) — temporal features
    """
    def __init__(self, input_channels=12, ks=5):
        super().__init__()

        expansion = 4
        layers = [3, 4, 23, 3]
        stem_szs = [32, 32, 64]  # stem channel progression
        block_szs = [64, 128, 128, 192]  # pre-expansion block sizes

        # Stem: 3 conv layers + maxpool
        self.stem = nn.Sequential(
            ConvBnAct(input_channels, stem_szs[0], ks=ks, stride=2),  # downsample
            ConvBnAct(stem_szs[0], stem_szs[1], ks=ks, stride=1),
            ConvBnAct(stem_szs[1], stem_szs[2], ks=ks, stride=1),
            nn.MaxPool1d(kernel_size=3, stride=2, padding=1)          # downsample
        )

        # Build block input/output sizes with expansion
        # [16, 64, 128, 128, 192] -> after expansion: [64, 256, 512, 512, 768]
        block_szs_full = [stem_szs[-1] // expansion] + block_szs

        # ResNet stages
        self.layer1 = self._make_layer(expansion, block_szs_full[0], block_szs_full[1],
                                       layers[0], stride=1, ks=ks)
        self.layer2 = self._make_layer(expansion, block_szs_full[1], block_szs_full[2],
                                       layers[1], stride=2, ks=ks)
        self.layer3 = self._make_layer(expansion, block_szs_full[2], block_szs_full[3],
                                       layers[2], stride=2, ks=ks)
        self.layer4 = self._make_layer(expansion, block_szs_full[3], block_szs_full[4],
                                       layers[3], stride=2, ks=ks)

        # Output dimension
        self.fdim = block_szs[-1] * expansion  # 192 * 4 = 768

        self._init_weights()

    def _make_layer(self, expansion, ni, nf, blocks, stride, ks):
        layers = [ResBlock(expansion, ni, nf, stride=stride, ks=ks)]
        for _ in range(1, blocks):
            layers.append(ResBlock(expansion, nf, nf, stride=1, ks=ks))
        return nn.Sequential(*layers)

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv1d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, nn.BatchNorm1d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)

    def forward(self, x):
        """
        x: (B, 12, 1000)
        returns: (B, 768, 32)
        """
        x = self.stem(x)      # (B, 64, 250)
        x = self.layer1(x)    # (B, 256, 250)
        x = self.layer2(x)    # (B, 512, 125)
        x = self.layer3(x)    # (B, 512, 63)
        x = self.layer4(x)    # (B, 768, 32)
        return x

    def forward_pooled(self, x):
        """Return globally pooled features for contrastive loss"""
        x = self.forward(x)
        return x.mean(dim=-1)  # (B, 768)


def xresnet1d101_ked(input_channels=12):
    """KED ECG encoder factory function"""
    return XResNet1D_101(input_channels=input_channels, ks=5)


# Multilead, ECG-only, CNN based SL - ECGfounder

class Swish(nn.Module):
    """Swish activation: x * sigmoid(x)"""
    def forward(self, x):
        return x * torch.sigmoid(x)


class MyConv1dPadSame(nn.Module):
    """
    Conv1d with SAME padding (TensorFlow-style)
    Output: (n_sample, out_channels, ceil(n_length / stride))
    """
    def __init__(self, in_channels, out_channels, kernel_size, stride, groups=1):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.stride = stride
        self.groups = groups
        self.conv = nn.Conv1d(
            in_channels=in_channels,
            out_channels=out_channels,
            kernel_size=kernel_size,
            stride=stride,
            groups=groups
        )

    def forward(self, x):
        in_dim = x.shape[-1]
        out_dim = (in_dim + self.stride - 1) // self.stride
        p = max(0, (out_dim - 1) * self.stride + self.kernel_size - in_dim)
        pad_left = p // 2
        pad_right = p - pad_left
        x = F.pad(x, (pad_left, pad_right), "constant", 0)
        return self.conv(x)


class MyMaxPool1dPadSame(nn.Module):
    """MaxPool1d with SAME padding"""
    def __init__(self, kernel_size):
        super().__init__()
        self.kernel_size = kernel_size
        self.max_pool = nn.MaxPool1d(kernel_size=kernel_size)

    def forward(self, x):
        p = max(0, self.kernel_size - 1)
        pad_left = p // 2
        pad_right = p - pad_left
        x = F.pad(x, (pad_left, pad_right), "constant", 0)
        return self.max_pool(x)


class BasicBlock(nn.Module):
    """
    Bottleneck block with Squeeze-and-Excitation:
        Conv1 (1x1) -> ConvK (grouped) -> Conv1 (1x1) -> SE -> Residual
    """
    def __init__(self, in_channels, out_channels, ratio, kernel_size, stride,
                 groups, downsample, is_first_block=False, use_bn=True, use_do=True):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.ratio = ratio
        self.kernel_size = kernel_size
        self.groups = groups
        self.downsample = downsample
        self.stride = stride if downsample else 1
        self.is_first_block = is_first_block
        self.use_bn = use_bn
        self.use_do = use_do

        self.middle_channels = int(out_channels * ratio)

        # First conv (1x1 pointwise)
        self.bn1 = nn.BatchNorm1d(in_channels)
        self.activation1 = Swish()
        self.do1 = nn.Dropout(p=0.5)
        self.conv1 = MyConv1dPadSame(
            in_channels=in_channels,
            out_channels=self.middle_channels,
            kernel_size=1,
            stride=1,
            groups=1
        )

        # Second conv (grouped convolution)
        self.bn2 = nn.BatchNorm1d(self.middle_channels)
        self.activation2 = Swish()
        self.do2 = nn.Dropout(p=0.5)
        self.conv2 = MyConv1dPadSame(
            in_channels=self.middle_channels,
            out_channels=self.middle_channels,
            kernel_size=kernel_size,
            stride=self.stride,
            groups=groups
        )

        # Third conv (1x1 pointwise)
        self.bn3 = nn.BatchNorm1d(self.middle_channels)
        self.activation3 = Swish()
        self.do3 = nn.Dropout(p=0.5)
        self.conv3 = MyConv1dPadSame(
            in_channels=self.middle_channels,
            out_channels=out_channels,
            kernel_size=1,
            stride=1,
            groups=1
        )

        # Squeeze-and-Excitation block
        r = 2  # reduction ratio
        self.se_fc1 = nn.Linear(out_channels, out_channels // r)
        self.se_fc2 = nn.Linear(out_channels // r, out_channels)
        self.se_activation = Swish()

        if self.downsample:
            self.max_pool = MyMaxPool1dPadSame(kernel_size=self.stride)

    def forward(self, x):
        identity = x
        out = x

        # First conv (skip pre-activation for very first block)
        if not self.is_first_block:
            if self.use_bn:
                out = self.bn1(out)
            out = self.activation1(out)
            if self.use_do:
                out = self.do1(out)
        out = self.conv1(out)

        # Second conv
        if self.use_bn:
            out = self.bn2(out)
        out = self.activation2(out)
        if self.use_do:
            out = self.do2(out)
        out = self.conv2(out)

        # Third conv
        if self.use_bn:
            out = self.bn3(out)
        out = self.activation3(out)
        if self.use_do:
            out = self.do3(out)
        out = self.conv3(out)

        # Squeeze-and-Excitation
        se = out.mean(-1)  # Global average pooling: (B, C)
        se = self.se_fc1(se)
        se = self.se_activation(se)
        se = self.se_fc2(se)
        se = torch.sigmoid(se)
        out = torch.einsum('abc,ab->abc', out, se)  # Channel-wise scaling

        # Downsample identity if needed
        if self.downsample:
            identity = self.max_pool(identity)

        # Pad channels if dimensions don't match
        if self.out_channels != self.in_channels:
            identity = identity.transpose(-1, -2)
            ch1 = (self.out_channels - self.in_channels) // 2
            ch2 = self.out_channels - self.in_channels - ch1
            identity = F.pad(identity, (ch1, ch2), "constant", 0)
            identity = identity.transpose(-1, -2)

        # Residual connection
        out += identity
        return out


class BasicStage(nn.Module):
    """Stage containing multiple BasicBlocks"""
    def __init__(self, in_channels, out_channels, ratio, kernel_size, stride,
                 groups, i_stage, m_blocks, use_bn=True, use_do=True, verbose=False):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.ratio = ratio
        self.kernel_size = kernel_size
        self.groups = groups
        self.i_stage = i_stage
        self.m_blocks = m_blocks
        self.use_bn = use_bn
        self.use_do = use_do
        self.verbose = verbose

        self.block_list = nn.ModuleList()
        for i_block in range(m_blocks):
            # First block of first stage
            is_first_block = (i_stage == 0 and i_block == 0)

            # Only first block of each stage downsamples
            if i_block == 0:
                downsample = True
                block_stride = stride
                block_in_channels = in_channels
            else:
                downsample = False
                block_stride = 1
                block_in_channels = out_channels

            block = BasicBlock(
                in_channels=block_in_channels,
                out_channels=out_channels,
                ratio=ratio,
                kernel_size=kernel_size,
                stride=block_stride,
                groups=groups,
                downsample=downsample,
                is_first_block=is_first_block,
                use_bn=use_bn,
                use_do=use_do
            )
            self.block_list.append(block)

    def forward(self, x):
        for block in self.block_list:
            x = block(x)
        return x


class Net1D(nn.Module):
    """
    ECGFounder backbone (Net1D based on RegNet architecture)

    Input:  (batch, in_channels, seq_len) - e.g., (B, 12, 5000)
    Output: (batch, n_classes) logits
            or (batch, n_classes), (batch, embed_dim) if return_features=True

    Default config matches ECGFounder:
        - 12-lead: in_channels=12
        - 1-lead:  in_channels=1
        - Embedding dimension: 1024 (final filter_list value)
    """
    def __init__(
        self,
        in_channels=12,
        base_filters=64,
        ratio=1.0,
        filter_list=[64, 160, 160, 400, 400, 1024, 1024],
        m_blocks_list=[2, 2, 2, 3, 3, 4, 4],
        kernel_size=16,
        stride=2,
        groups_width=16,
        n_classes=150,
        use_bn=True,
        use_do=True,
        return_features=False,
        verbose=False
    ):
        super().__init__()
        self.in_channels = in_channels
        self.base_filters = base_filters
        self.ratio = ratio
        self.filter_list = filter_list
        self.m_blocks_list = m_blocks_list
        self.kernel_size = kernel_size
        self.stride = stride
        self.groups_width = groups_width
        self.n_stages = len(filter_list)
        self.n_classes = n_classes
        self.use_bn = use_bn
        self.use_do = use_do
        self.return_features = return_features
        self.verbose = verbose

        # First convolution
        self.first_conv = MyConv1dPadSame(
            in_channels=in_channels,
            out_channels=base_filters,
            kernel_size=kernel_size,
            stride=2
        )
        self.first_bn = nn.BatchNorm1d(base_filters)
        self.first_activation = Swish()

        # Build stages
        self.stage_list = nn.ModuleList()
        stage_in_channels = base_filters
        for i_stage in range(self.n_stages):
            out_channels = filter_list[i_stage]
            m_blocks = m_blocks_list[i_stage]
            stage = BasicStage(
                in_channels=stage_in_channels,
                out_channels=out_channels,
                ratio=ratio,
                kernel_size=kernel_size,
                stride=stride,
                groups=out_channels // groups_width,
                i_stage=i_stage,
                m_blocks=m_blocks,
                use_bn=use_bn,
                use_do=use_do,
                verbose=verbose
            )
            self.stage_list.append(stage)
            stage_in_channels = out_channels

        # Classification head
        self.dense = nn.Linear(stage_in_channels, n_classes)

    def forward(self, x):
        # First conv block
        out = self.first_conv(x)
        if self.use_bn:
            out = self.first_bn(out)
        out = self.first_activation(out)

        # Stages
        for stage in self.stage_list:
            out = stage(out)

        # Global average pooling
        deep_features = out.mean(-1)  # (B, 1024)

        # Classification
        out = self.dense(deep_features)

        if self.return_features:
            return out, deep_features
        return out

    def get_embedding_dim(self):
        """Return the embedding dimension (before classification head)"""
        return self.filter_list[-1]


def ecgfounder_12lead(n_classes=150, use_bn=False, use_do=False, return_features=False):
    """
    12-lead ECGFounder (matches released checkpoint config)
    Input: (B, 12, 5000) - 12 leads, 10s @ 500Hz
    """
    return Net1D(
        in_channels=12,
        base_filters=64,
        ratio=1.0,
        filter_list=[64, 160, 160, 400, 400, 1024, 1024],
        m_blocks_list=[2, 2, 2, 3, 3, 4, 4],
        kernel_size=16,
        stride=2,
        groups_width=16,
        n_classes=n_classes,
        use_bn=use_bn,
        use_do=use_do,
        return_features=return_features
    )


def ecgfounder_1lead(n_classes=150, use_bn=False, use_do=False, return_features=False):
    """
    1-lead ECGFounder (for wearable/portable devices)
    Input: (B, 1, 5000) - 1 lead, 10s @ 500Hz
    """
    return Net1D(
        in_channels=1,
        base_filters=64,
        ratio=1.0,
        filter_list=[64, 160, 160, 400, 400, 1024, 1024],
        m_blocks_list=[2, 2, 2, 3, 3, 4, 4],
        kernel_size=16,
        stride=2,
        groups_width=16,
        n_classes=n_classes,
        use_bn=use_bn,
        use_do=use_do,
        return_features=return_features
    )

# 1-lead, ECG-only - heartgpt_ecg, heartbert

# heartgpt_ecg - GPT-based ECG model

class HeartGPT(nn.Module):
    """HeartGPT: Causal GPT with vocab=101, n_embd=64, n_head=8, n_layer=8, dropout=0.2
    (from HeartGPT/configs/default.yaml and HeartGPT/core/model.py)
    Architecture: GPT-style with causal masking, pre-norm, and autoregressive attention"""
    def __init__(self, vocab_size=101):
        super().__init__()
        n_embd, n_head, n_layer, block_size, dropout = 64, 8, 8, 500, 0.2

        self.block_size = block_size
        self.token_embedding = nn.Embedding(vocab_size, n_embd)
        self.position_embedding = nn.Embedding(block_size, n_embd)

        # Causal GPT-style transformer with pre-norm
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=n_embd,
            nhead=n_head,
            dim_feedforward=256,  # 4 * n_embd
            dropout=dropout,
            activation='relu',
            batch_first=True,
            norm_first=True  # Pre-norm (critical for GPT architecture)
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, n_layer)
        self.ln_f = nn.LayerNorm(n_embd)

        # Register causal mask (lower triangular for autoregressive prediction)
        self.register_buffer('causal_mask',
                            torch.triu(torch.ones(block_size, block_size) * float('-inf'), diagonal=1))

    def forward(self, x):
        # Tokenize: scale to [0, 100] and clamp (matches HeartGPT/tokenise/preprocess.py)
        tok = ((x[:,0,:] - x.min()) / (x.max() - x.min() + 1e-8) * 100).long().clamp(0, 100)
        B, T = tok.shape

        # Embeddings
        tok_emb = self.token_embedding(tok)  # (B, T, 64)
        pos_emb = self.position_embedding(torch.arange(T, device=tok.device))  # (T, 64)
        x = tok_emb + pos_emb

        # Apply causal transformer with mask
        x = self.transformer(x, mask=self.causal_mask[:T, :T])
        x = self.ln_f(x)
        return x  # (B, T, 64) - embeddings for benchmarking


# heartbert - RoBERTa-based ECG model

def create_heartbert():
    """HeartBERT: RoBERTa-based, 6 layers, vocab=52000

    NOTE: Uses simplified uniform quantization for architecture benchmarking.
    Real HeartBERT preprocessing requires:
    - Resampling to 360 Hz
    - Normalization to [0,1]
    - Lloyd-Max quantization (100 levels, learned from training data)
    - Custom BPE tokenizer (52k vocab)

    This implementation measures computational cost, not actual performance.
    """
    from transformers import RobertaConfig, RobertaModel

    cfg = RobertaConfig(
        vocab_size=52000,
        max_position_embeddings=514,
        num_attention_heads=12,
        num_hidden_layers=6,
        hidden_size=768,
        intermediate_size=3072,
        type_vocab_size=1,
    )

    class HeartBERTWrapper(nn.Module):
        def __init__(self):
            super().__init__()
            self.model = RobertaModel(cfg)

        def forward(self, x):
            # Simplified preprocessing for benchmarking
            # 1. Extract first lead
            # 2. Normalize to [0, 1]
            # 3. Uniform quantization to 100 levels (approximates Lloyd-Max)
            tok = ((x[:,0,:] - x.min()) / (x.max() - x.min() + 1e-8) * 99).long().clamp(0, 99)
            return self.model(tok).last_hidden_state

    return HeartBERTWrapper()

# 1-lead, PPG-only - heartgpt_ppg, papagei, pulseppg

# heartgpt_ppg - GPT-based PPG model

# papagei - ResNet1D-MoE model


class PaPaGeiS(nn.Module):
    """PaPaGei-S: 18 blocks, base=32, channels to 512, output=512
    Corrected from checkpoint: 5.79M params (was 3.2M)
    """
    def __init__(self):
        super().__init__()
        self.first_conv = nn.Conv1d(1, 32, 3, 1, 1, bias=True)
        self.first_bn = nn.BatchNorm1d(32)
        
        channels = [32]*4 + [64]*4 + [128]*4 + [256]*4 + [512]*2
        self.blocks = nn.ModuleList()
        in_c = 32
        for i, out_c in enumerate(channels):
            stride = 2 if (i % 2 == 1) else 1
            self.blocks.append(nn.ModuleDict({
                'bn1': nn.BatchNorm1d(in_c),
                'conv1': nn.Conv1d(in_c, out_c, 3, stride, 1, bias=True),
                'bn2': nn.BatchNorm1d(out_c),
                'conv2': nn.Conv1d(out_c, out_c, 3, 1, 1, bias=True),
            }))
            in_c = out_c
        
        self.final_bn = nn.BatchNorm1d(512)
        self.dense = nn.Linear(512, 512)
        
        # Store channel info for forward pass
        self._channels = [32]*4 + [64]*4 + [128]*4 + [256]*4 + [512]*2

    def forward(self, x):
        x = F.relu(self.first_bn(self.first_conv(x)))
        
        in_c = 32
        for i, (block, out_c) in enumerate(zip(self.blocks, self._channels)):
            stride = 2 if (i % 2 == 1) else 1
            identity = x
            
            out = F.relu(block['bn1'](x))
            out = block['conv1'](out)
            out = F.relu(block['bn2'](out))
            out = block['conv2'](out)
            
            # Shortcut with ceil_mode to match conv output size
            if stride != 1:
                identity = F.avg_pool1d(identity, stride, stride, ceil_mode=True)
            if out_c != in_c:
                identity = F.pad(identity, (0, 0, 0, out_c - in_c))
            
            x = out + identity
            in_c = out_c
        
        x = F.relu(self.final_bn(x))
        x = x.mean(dim=-1)
        return self.dense(x)

# pulseppg - ResNet1D model

class PulsePPG(nn.Module):
    """PulsePPG: 12 blocks, base=128, kernel=11, stride=2, output=512"""
    def __init__(self):
        super().__init__()
        self.instnorm = nn.InstanceNorm1d(1)
        self.conv1 = nn.Conv1d(1, 128, 11, 1, 5)
        self.bn1 = nn.BatchNorm1d(128)
        
        self.blocks = nn.ModuleList()
        self.shortcuts = nn.ModuleList()
        channels = [128]*4 + [256]*4 + [512]*4
        in_c = 128
        for i, out_c in enumerate(channels):
            downsample = (i % 2 == 1)
            self.blocks.append(nn.Sequential(
                nn.Conv1d(in_c, out_c, 11, 2 if downsample else 1, 5),
                nn.BatchNorm1d(out_c), nn.ReLU(),
                nn.Conv1d(out_c, out_c, 11, 1, 5), nn.BatchNorm1d(out_c)
            ))
            if in_c != out_c or downsample:
                self.shortcuts.append(nn.Sequential(
                    nn.Conv1d(in_c, out_c, 1, 2 if downsample else 1), 
                    nn.BatchNorm1d(out_c)
                ))
            else:
                self.shortcuts.append(nn.Identity())
            in_c = out_c

    def forward(self, x):
        x = self.instnorm(x)
        x = F.relu(self.bn1(self.conv1(x)))
        for block, shortcut in zip(self.blocks, self.shortcuts):
            x = F.relu(block(x) + shortcut(x))
        return x.mean(dim=-1)  


# =============================================================================
# 4) Model registry
# =============================================================================

MODEL_SPECS = [
    ModelSpec(
        name="ecg_jepa",
        factory=lambda: ECGJEPA(768, 12, 16, c=8, p=50, t=50),
        leads=8, seq_len=2500, fdim=768, hz=250, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="heartlang",
        factory=lambda: HeartLangViT(),
        leads=256, seq_len=96, fdim=768, hz=100, duration_s=10.0, input_kind="tokenized"
    ),
    ModelSpec(
        name="st_mem",
        factory=lambda: ST_MEM(width=768, depth=12, heads=12, dim_head=64, num_leads=12, seq_len=2250, patch_size=75),
        leads=12, seq_len=2250, fdim=768, hz=250, duration_s=9.0, input_kind="raw"
    ),
    ModelSpec(
        name="ecg_cpc",
        factory=lambda: ECGCPCModel(d_input=12, d_model=512, d_state=8),
        leads=12, seq_len=2400, fdim=512, hz=240, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="s4_supervised",
        factory=lambda: S4Model(d_input=12, d_model=512, d_state=8, n_layers=4),
        leads=12, seq_len=250, fdim=512, hz=100, duration_s=2.5, input_kind="raw"
    ),
    ModelSpec(
        name="hubert_ecg",
        factory=create_hubert,
        leads=12, seq_len=2500, fdim=768, hz=500, duration_s=5.0, input_kind="raw"
    ),
    ModelSpec(
        name="ecgfm",
        factory=create_wav2vec,
        leads=12, seq_len=5000, fdim=768, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="deepecg",
        factory=create_heartwise_ssl,
        leads=12, seq_len=2500, fdim=768, hz=250, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="esi",
        factory=lambda: ConvNeXtV2_1D(in_chans=12),
        leads=12, seq_len=5000, fdim=1024, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="melp",
        factory=create_melp,
        leads=12, seq_len=5000, fdim=768, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="merl_resnet18",
        factory=lambda: ResNet1D_MERL(in_channels=12),
        leads=12, seq_len=5000, fdim=512, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="merl_vit_tiny",
        factory=lambda: ViT1D_MERL(embed_dim=192, depth=12, heads=3, leads=12, seq_len=5000, patch_size=50, mlp_dim=768),
        leads=12, seq_len=5000, fdim=192, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="ecgfm_ked",
        factory=lambda: xresnet1d101_ked(12),
        leads=12, seq_len=1000, fdim=768, hz=100, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="ecgfounder_12lead",
        factory=lambda: ecgfounder_12lead(n_classes=150, use_bn=False, use_do=False),
        leads=12, seq_len=5000, fdim=1024, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="ecgfounder_1lead",
        factory=lambda: ecgfounder_1lead(n_classes=150, use_bn=False, use_do=False),
        leads=1, seq_len=5000, fdim=1024, hz=500, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="heartgpt_ecg",
        factory=lambda: HeartGPT(vocab_size=101),
        leads=1, seq_len=500, fdim=64, hz=100, duration_s=5.0, input_kind="raw"
    ),
    ModelSpec(
        name="heartgpt_ppg",
        factory=lambda: HeartGPT(vocab_size=101),  
        leads=1, seq_len=500, fdim=64, hz=50, duration_s=10.0, input_kind="raw" 
    ),
    ModelSpec(
        name="heartbert",
        factory=create_heartbert,
        leads=1, seq_len=512, fdim=768, hz=None, duration_s=None, input_kind="tokenized"
    ),
    ModelSpec(
        name="papagei",
        factory=lambda: PaPaGeiS(),
        leads=1, seq_len=1250, fdim=512, hz=125, duration_s=10.0, input_kind="raw"
    ),
    ModelSpec(
        name="pulseppg",
        factory=lambda: PulsePPG(),
        leads=1, seq_len=12000, fdim=512, hz=50, duration_s=240.0, input_kind="raw" 
    ),
]



# Fine-tuning estimation parameters
FINETUNE_SAMPLES = 100000  # Fixed dataset size for comparison
FINETUNE_EPOCHS = 10

print(f"Benchmarking {len(MODEL_SPECS)} models on {DEVICE}")
print(f"Batch size: {BATCH_SIZE}")
print(f"Fine-tuning estimate: {FINETUNE_SAMPLES:,} samples × {FINETUNE_EPOCHS} epochs")


# =============================================================================
# 5) Run benchmarks
# =============================================================================

import warnings
warnings.filterwarnings('ignore', message='enable_nested_tensor is True')

results = []

for spec in MODEL_SPECS:
    name = spec.name
    model_fn = spec.factory
    leads = spec.leads
    seq_len = spec.seq_len
    fdim = spec.fdim
    hz = spec.hz
    duration = spec.duration_s

    print(f"\n{'='*50}\n{name}\n{'='*50}")
    dur_str = f"{duration}s@{hz}Hz" if duration else "tokenized"
    print(f"Input: {leads} lead(s), {seq_len} samples ({dur_str})")

    try:
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.reset_peak_memory_stats()

        model = model_fn().to(DEVICE)
        params = count_params(model)
        print(f"Params: {format_params(params)}")

        x = torch.randn(BATCH_SIZE, leads, seq_len).to(DEVICE)
        flops, macs = count_flops(model, x)
        print(f"FLOPs: {format_flops(flops)}")

        warmup(model, x)
        if torch.cuda.is_available(): torch.cuda.reset_peak_memory_stats()

        timing = benchmark_infer(model, x, NUM_RUNS)
        inf_mem = get_mem()
        thru = (BATCH_SIZE / timing['mean']) * 1000
        print(f"Inference: {timing['mean']:.1f} ± {timing['std']:.1f} ms | {thru:.0f} samples/sec | {inf_mem:.2f} GB")

        # Training benchmark with progressive fallback
        x_train = None
        train_batch = None
        train_time = None
        train_ms_per_sample = None
        train_throughput = None
        train_mem = None
        finetune_hours = None

        # Try progressively smaller batch sizes until one works
        for attempt_batch in [32, 16, 8, 4, 2, 1]:
            try:
                # Clean up memory before attempt
                if x_train is not None:
                    del x_train
                torch.cuda.empty_cache()
                gc.collect()
                if torch.cuda.is_available():
                    torch.cuda.reset_peak_memory_stats()

                # Create batch and run benchmark
                x_train = torch.randn(attempt_batch, leads, seq_len).to(DEVICE)
                train_time = benchmark_train(model, x_train, fdim, 20)
                train_mem = get_mem()

                # Success! Calculate metrics
                train_batch = attempt_batch
                train_ms_per_sample = train_time / train_batch
                train_throughput = (train_batch / train_time) * 1000

                total_samples = FINETUNE_SAMPLES * FINETUNE_EPOCHS
                finetune_hours = (train_ms_per_sample * total_samples) / 1000 / 3600

                print(f"Training step: {train_time:.1f} ms (batch={train_batch}) | {train_mem:.2f} GB")
                print(f"  Per-sample: {train_ms_per_sample:.1f} ms/sample")
                print(f"  Throughput: {train_throughput:.0f} samples/sec")
                print(f"Est. fine-tuning ({FINETUNE_SAMPLES//1000}k × {FINETUNE_EPOCHS}ep): {finetune_hours:.1f} hours")

                # Found working batch size, exit loop
                break

            except RuntimeError as e:
                if "out of memory" in str(e):
                    torch.cuda.empty_cache()
                    gc.collect()

                    if attempt_batch == 1:
                        # Even batch=1 failed - model cannot train on this GPU
                        print(f"Training step: SKIPPED (OOM even with batch=1)")
                        train_batch = None
                        train_time = float('nan')
                        train_ms_per_sample = float('nan')
                        train_throughput = float('nan')
                        train_mem = float('nan')
                        finetune_hours = float('nan')
                        break
                    else:
                        # Try next smaller batch size
                        print(f"  OOM at batch={attempt_batch}, trying smaller...")
                        continue
                else:
                    # Some other error - re-raise it
                    raise

        # Store results
        results.append({
            'model': name,
            'leads': leads,
            'samples': seq_len,
            'hz': hz,
            'duration_s': duration,
            'params': params,
            'flops': flops,
            'infer_batch': BATCH_SIZE,
            'infer_ms': timing['mean'],
            'infer_std': timing['std'],
            'infer_throughput': thru,
            'inf_mem': inf_mem,
            'train_batch': train_batch,
            'train_ms': train_time,
            'train_ms_per_sample': train_ms_per_sample,
            'train_throughput': train_throughput,
            'train_mem': train_mem,
            'finetune_hours': finetune_hours
        })

        del model, x, x_train
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        else:
            import ctypes
            libc = ctypes.CDLL("libc.so.6")
            libc.malloc_trim(0)  # Force memory release on Linux

    except Exception as e:
        print(f"FAILED: {e}")

# =============================================================================
# 6) Display & save results
# =============================================================================

# Summary Table
print("\n" + "="*150)
print(f"SUMMARY - ECG Foundation Model Benchmark")
print("="*150)

# Header
print(f"\n{'Model':<15} {'Leads':<6} {'Params':<9} {'GFLOPs':<8} {'Infer':<12} {'Thru(inf)':<10} "
      f"{'Train':<18} {'ms/samp':<9} {'Thru(trn)':<10} {'FT Time':<10}")
print("-"*150)

for r in sorted(results, key=lambda x: x['infer_throughput'], reverse=True):
    gf = f"{r['flops']/1e9:.1f}" if r['flops'] else "N/A"

    # Inference metrics
    infer = f"{r['infer_ms']:.1f}ms"
    thru_inf = f"{r['infer_throughput']:.0f}/s"

    # Training metrics (handle NaN and None)
    import math
    if r['train_batch'] is None or math.isnan(r['train_ms']):
        train = "OOM"
        ms_per = "N/A"
        thru_trn = "N/A"
        ft = "N/A"
    else:
        train = f"{r['train_ms']:.1f}ms (b={r['train_batch']})"
        ms_per = f"{r['train_ms_per_sample']:.1f}"
        thru_trn = f"{r['train_throughput']:.0f}/s"
        ft = f"{r['finetune_hours']:.1f}h"

    print(f"{r['model']:<15} {r['leads']:<6} {r['params']/1e6:.1f}M{'':<4} {gf:<8} "
          f"{infer:<12} {thru_inf:<10} {train:<18} {ms_per:<9} {thru_trn:<10} {ft}")

# Markdown table for paper - 12-lead models
print("\n\n" + "="*150)
print("PAPER TABLE: 12-Lead ECG Models")
print("="*150)
print("\n| Model | Params | GFLOPs | Infer (ms) | Infer Thru | Train Batch | Train (ms) | ms/sample | Train Thru | FT Time* |")
print("|-------|--------|--------|------------|------------|-------------|------------|-----------|------------|----------|")

for r in sorted(results, key=lambda x: x['params'], reverse=True):
    if r['leads'] in [8,12,256]:
        import math
        gf = f"{r['flops']/1e9:.1f}" if r['flops'] else "N/A"

        if r['train_batch'] is None or math.isnan(r['train_ms']):
            batch_str = "—"
            train_str = "OOM"
            ms_per = "—"
            thru_trn = "—"
            ft = "—"
        else:
            batch_str = str(r['train_batch'])
            train_str = f"{r['train_ms']:.1f}"
            ms_per = f"{r['train_ms_per_sample']:.1f}"
            thru_trn = f"{r['train_throughput']:.0f}/s"
            ft = f"{r['finetune_hours']:.1f}h"

        print(f"| {r['model']} | {r['params']/1e6:.1f}M | {gf} | {r['infer_ms']:.1f} | "
              f"{r['infer_throughput']:.0f}/s | {batch_str} | "
              f"{train_str} | {ms_per} | {thru_trn} | {ft} |")

print("\n*FT Time = Fine-tuning 100k samples × 10 epochs (based on per-sample time)")
print("*Train Batch = Adaptive batch size (automatically determined to fit GPU memory)")
print("*ms/sample = Training time per sample (fair algorithmic comparison, normalized across batch sizes)")
print("*Train Thru = Actual training throughput with the adaptive batch size")

# Markdown table for paper - 1-lead models
print("\n\n" + "="*150)
print("PAPER TABLE: 1-Lead ECG Models")
print("="*150)
print("\n| Model | Params | GFLOPs | Infer (ms) | Infer Thru | Train Batch | Train (ms) | ms/sample | Train Thru | FT Time* |")
print("|-------|--------|--------|------------|------------|-------------|------------|-----------|------------|----------|")

for r in sorted(results, key=lambda x: x['params'], reverse=True):
    if r['leads'] == 1:
        import math
        gf = f"{r['flops']/1e9:.1f}" if r['flops'] else "N/A"

        if r['train_batch'] is None or math.isnan(r['train_ms']):
            batch_str = "—"
            train_str = "OOM"
            ms_per = "—"
            thru_trn = "—"
            ft = "—"
        else:
            batch_str = str(r['train_batch'])
            train_str = f"{r['train_ms']:.1f}"
            ms_per = f"{r['train_ms_per_sample']:.1f}"
            thru_trn = f"{r['train_throughput']:.0f}/s"
            ft = f"{r['finetune_hours']:.1f}h"

        print(f"| {r['model']} | {r['params']/1e6:.1f}M | {gf} | {r['infer_ms']:.1f} | "
              f"{r['infer_throughput']:.0f}/s | {batch_str} | "
              f"{train_str} | {ms_per} | {thru_trn} | {ft} |")

print("\n*FT Time = Fine-tuning 100k samples × 10 epochs (based on per-sample time)")
print("*Train Batch = Adaptive batch size (automatically determined to fit GPU memory)")
print("*ms/sample = Training time per sample (fair algorithmic comparison, normalized across batch sizes)")
print("*Train Thru = Actual training throughput with the adaptive batch size")


print("\n" + "="*150)
print("KEY INSIGHT:")
print("="*150)
print("Training time is primarily determined by sequence length and FLOPs rather than parameter count.")
print("HuBERT-ECG achieves fast training (1.0h) despite 92.8M parameters through aggressive downsampling")
print("(decimation + stride-64 conv), resulting in only ~93 tokens, compared to ECG-FM's ~3,750 tokens")
print("with the same parameter count. The progressive fallback batch sizing ensures fair comparison by")
print("normalizing to per-sample metrics (ms/sample) while reporting actual throughput for practical assessment.")


# # save

# Save results to JSON and CSV
import pandas as pd

timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

# === Save JSON (full metadata) ===
output = {
    'metadata': {
        'timestamp': datetime.now().isoformat(),
        'device': DEVICE,
        'gpu': torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU',
        'batch_size': BATCH_SIZE,
        'num_runs': NUM_RUNS,
        'finetune_samples': FINETUNE_SAMPLES,
        'finetune_epochs': FINETUNE_EPOCHS,
        'pytorch': torch.__version__,
    },
    'results': results
}

json_file = f"ecg_benchmark_{timestamp}.json"
with open(json_file, 'w') as f:
    json.dump(output, f, indent=2, default=str)
print(f"\n✅ JSON saved: {json_file}")

# Save CSV
df = pd.DataFrame(results)
df = df.rename(columns={
    'model': 'Model',
    'leads': 'Leads',
    'samples': 'Samples',
    'hz': 'Hz',
    'duration_s': 'Duration_s',
    'params': 'Parameters',
    'flops': 'FLOPs',

    'infer_batch': 'Infer_Batch_Size',
    'infer_ms': 'Infer_Mean_ms',
    'infer_std': 'Infer_Std_ms',
    'infer_throughput': 'Infer_Throughput_samples_per_s',
    'inf_mem': 'Infer_GPU_GB',

    'train_batch': 'Train_Batch_Size',
    'train_ms': 'Train_Total_ms',
    'train_ms_per_sample': 'Train_ms_per_sample',
    'train_throughput': 'Train_Throughput_samples_per_s',
    'train_mem': 'Train_GPU_GB',
    'finetune_hours': 'Finetune_100k_10ep_hours'
})

csv_file = f"ecg_benchmark_{timestamp}.csv"
df.to_csv(csv_file, index=False)
print(f"✅ CSV saved: {csv_file}")

# Display preview
print("\n📊 CSV Preview:")
print(df.to_string(index=False))

# Save summary table as CSV
summary_data = []
for r in sorted(results, key=lambda x: x['params'], reverse=True):
    import math
    gf = f"{r['flops']/1e9:.1f}" if r['flops'] else "N/A"

    if math.isnan(r['train_ms']):
        train_str = "OOM"
        ms_per = "N/A"
        thru_trn = "N/A"
        ft = "N/A"
        batch_str = "N/A"
    else:
        train_str = f"{r['train_ms']:.1f}"
        ms_per = f"{r['train_ms_per_sample']:.1f}"
        thru_trn = f"{r['train_throughput']:.0f}"
        ft = f"{r['finetune_hours']:.1f}"
        batch_str = str(r['train_batch']) if r['train_batch'] else "N/A"

    summary_data.append({
        'Model': r['model'],
        'Leads': r['leads'],
        'Params_M': f"{r['params']/1e6:.1f}",
        'GFLOPs': gf,
        'Infer_ms': f"{r['infer_ms']:.1f}",
        'Infer_Throughput_per_s': f"{r['infer_throughput']:.0f}",
        'Train_Batch': batch_str,
        'Train_ms': train_str,
        'Train_ms_per_sample': ms_per,
        'Train_Throughput_per_s': thru_trn,
        'Finetune_Hours': ft,
        'Infer_Mem_GB': f"{r['inf_mem']:.2f}",
        'Train_Mem_GB': f"{r['train_mem']:.2f}" if not math.isnan(r['train_mem']) else "N/A"
    })

summary_df = pd.DataFrame(summary_data)
summary_file = f"ecg_benchmark_summary_{timestamp}.csv"
summary_df.to_csv(summary_file, index=False)
print(f"\n✅ Summary table saved: {summary_file}")
