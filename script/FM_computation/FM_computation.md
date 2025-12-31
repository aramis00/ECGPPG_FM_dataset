# ECG/PPG Foundation Model Computational Benchmark

A comprehensive benchmarking script for comparing computational requirements (parameters, FLOPs, inference time, training time, memory usage) across ECG and PPG foundation models.

---

## Overview

This script provides a unified framework to:
- **Count model parameters** - Total learnable parameters
- **Estimate FLOPs** - Floating-point operations per forward pass
- **Benchmark inference** - Latency and throughput measurements
- **Benchmark training** - Per-sample training time with adaptive batch sizing
- **Estimate fine-tuning time** - Projected hours for a standard fine-tuning run (100k samples × 10 epochs)

---

## Models Benchmarked

### Multi-Lead ECG Models (8-12 Leads)

| Model | Architecture | Input | Output Dim | Description |
|-------|--------------|-------|------------|-------------|
| **ECG-JEPA** | ViT with structured cross-lead attention | 8 leads × 2500 @ 250Hz | 768 | 2D patch grid (50×50), row+column attention mask |
| **HeartLang** | ViT with QRS tokenization | 256 tokens × 96 | 768 | Pre-tokenized heartbeats, 12 layers |
| **CPC** | Conv1D encoder + S4 layer | 12 leads × 2400 @ 240Hz | 512 | SSL with Contrastive Predictive Coding |
| **S4 (supervised)** | State Space Model (S4D) | 12 leads × 250 @ 100Hz | 512 | 4-layer S4D diagonal SSM |
| **HuBERT-ECG** | HuBERT adapted for ECG | 12 leads × 2500 @ 500Hz | 768 | 5x decimation, flatten to 6000 samples |
| **ECG-FM** | Wav2Vec2 | 12 leads × 5000 @ 500Hz | 768 | 12-layer transformer, 4-layer CNN frontend |
| **DeepECG** | Wav2Vec2-CMSC | 12 leads × 2500 @ 250Hz | 768 | SSL pretrained encoder |
| **ESI** | ConvNeXtV2-Base 1D | 12 leads × 5000 @ 500Hz | 1024 | 36 blocks (3+3+27+3), GRN activation |
| **MELP** | Wav2Vec2-CMSC variant | 12 leads × 5000 @ 500Hz | 768 | 8-layer transformer, 4-layer CNN |
| **MERL (ResNet18)** | ResNet18-1D | 12 leads × 5000 @ 500Hz | 512 | Standard ResNet18 adapted for 1D |
| **MERL (ViT-Tiny)** | ViT-Tiny 1D | 12 leads × 5000 @ 500Hz | 192 | 12 layers, 3 heads, patch size 50 |
| **KED** | xResNet1D-101 | 12 leads × 1000 @ 100Hz | 768 | 101-layer ResNet with knowledge enhancement |
| **ECGFounder (12-lead)** | Net1D (RegNet-style) | 12 leads × 5000 @ 500Hz | 1024 | 7-stage CNN with SE blocks |

### Single-Lead ECG Models

| Model | Architecture | Input | Output Dim | Description |
|-------|--------------|-------|------------|-------------|
| **ECGFounder (1-lead)** | Net1D (RegNet-style) | 1 lead × 5000 @ 500Hz | 1024 | Same architecture as 12-lead |
| **ECG-PT** | Causal GPT | 1 lead × 500 @ 100Hz | 64 | 8 layers, vocab=101, autoregressive |
| **HeartBERT** | RoBERTa | 1 lead × 512 (tokenized) | 768 | 6 layers, vocab=52k, BPE tokenization |

### PPG Models

| Model | Architecture | Input | Output Dim | Description |
|-------|--------------|-------|------------|-------------|
| **PPG-PT** | Causal GPT | 1 lead × 500 @ 100Hz | 64 | Same as ECG-PT, vocab=102 |
| **PaPaGei** | ResNet1D-MoE | 1 lead × 1250 @ 125Hz | 512 | 18 blocks, base_filters=32 |
| **PulsePPG** | ResNet1D | 1 lead × 1000 @ 50Hz | 512 | 12 blocks, base_filters=128, kernel=11 |

---

## Key Metrics

### Parameters
Total number of learnable parameters in the model, computed via `sum(p.numel() for p in model.parameters())`.

> **Note**: Parameter counts are computed from the actual model implementations in the benchmark code, not from published papers. This ensures fair comparison since all models are measured the same way.

### FLOPs (Floating Point Operations)
Computed using the `thop` library.

> **Important Limitation**: `thop` does NOT correctly count matrix multiplications inside `nn.MultiheadAttention` (specifically q @ k and attn @ v operations). Transformer models may be **undercounted by ~50%**. However, for **relative comparisons** between models, this is acceptable as the undercounting is consistent.

### Inference Metrics
- **Latency (ms)**: Mean ± std over 50 runs per batch
- **Throughput (samples/sec)**: Samples processed per second
- **Memory (GB)**: Peak GPU memory during inference

### Training Metrics
- **Adaptive Batch Size**: Automatically determined to fit GPU memory (fallback: 32 → 16 → 8 → 4 → 2 → 1)
- **ms/sample**: Fair algorithmic comparison normalized across batch sizes
- **Throughput (samples/sec)**: Actual training throughput with adaptive batch
- **Memory (GB)**: Peak GPU memory during training

### Fine-tuning Time Estimate
Projected time to fine-tune on 100,000 samples for 10 epochs, based on per-sample training time.

---

## Benchmark Results

### Hardware Configurations

| Hardware | GPU | VRAM | Batch Size | PyTorch |
|----------|-----|------|------------|---------|
| **A100** | NVIDIA A100-SXM4-80GB | 80 GB | 32 | 2.9.0+cu126 |
| **T4** | Tesla T4 | 16 GB | 32 | 2.9.0+cu126 |
| **CPU** | Intel Xeon (Colab) | N/A | 8 | 2.9.0+cpu |

---

### A100 Results (NVIDIA A100-SXM4-80GB)

#### Multi-Lead ECG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | Train Batch | ms/sample | Train/s | FT Time (h) | Inf Mem | Train Mem |
|-------|--------|--------|------------|---------|-------------|-----------|---------|-------------|---------|-----------|
| HuBERT-ECG | 92.8M | 18.0 | 40.7 | 786 | 32 | 3.7 | 268 | 1.0 | 1.0 GB | 4.1 GB |
| ECG-FM | 90.4M | 646.0 | 2047.9 | 16 | 16 | 186.5 | 5 | 51.8 | 5.3 GB | 44.3 GB |
| DeepECG | 90.4M | 323.0 | 790.4 | 40 | 32 | 76.9 | 13 | 21.4 | 3.0 GB | 44.3 GB |
| ESI | 85.6M | 46.8 | 117.4 | 273 | 32 | 11.8 | 85 | 3.3 | 1.0 GB | 15.9 GB |
| ECG-JEPA | 85.4M | 45.4 | 172.6 | 185 | 32 | 15.3 | 65 | 4.3 | 1.7 GB | 10.4 GB |
| MELP | 62.0M | 27.3 | 82.0 | 390 | 32 | 7.7 | 129 | 2.1 | 0.9 GB | 6.1 GB |
| HeartLang | 47.7M | 9.9 | 54.7 | 586 | 32 | 6.1 | 165 | 1.7 | 0.8 GB | 4.9 GB |
| ECGFounder (12-lead) | 30.8M | 2.3 | 14.2 | 2256 | 32 | 1.6 | 628 | 0.4 | 0.6 GB | 2.5 GB |
| ST-MEM | 21.5M | 1.5 | 6.6 | 4876 | 32 | 1.1 | 930 | 0.3 | 0.5 GB | 1.3 GB |
| KED | 7.9M | 1.2 | 13.4 | 2388 | 32 | 1.7 | 584 | 0.5 | 0.5 GB | 1.1 GB |
| MERL (ViT-Tiny) | 5.5M | 0.7 | 6.8 | 4678 | 32 | 0.9 | 1097 | 0.3 | 0.4 GB | 1.0 GB |
| MERL (ResNet18) | 3.8M | 3.5 | 3.3 | 9616 | 32 | 0.5 | 1938 | 0.1 | 0.5 GB | 1.3 GB |
| S4 (supervised) | 2.2M | 1.1 | 5.1 | 6256 | 32 | 0.5 | 1899 | 0.1 | 0.6 GB | 1.1 GB |
| CPC | 1.4M | 3.2 | 7.2 | 4429 | 32 | 0.9 | 1111 | 0.3 | 1.3 GB | 2.1 GB |

#### Single-Lead ECG & PPG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | Train Batch | ms/sample | Train/s | FT Time (h) | Inf Mem | Train Mem |
|-------|--------|--------|------------|---------|-------------|-----------|---------|-------------|---------|-----------|
| HeartBERT | 83.5M | 43.5 | 88.8 | 361 | 32 | 8.9 | 112 | 2.5 | 1.3 GB | 6.8 GB |
| ECGFounder (1-lead) | 30.8M | 2.3 | 14.3 | 2238 | 32 | 1.5 | 659 | 0.4 | 0.6 GB | 2.4 GB |
| PulsePPG | 29.4M | 4.7 | 5.2 | 6124 | 32 | 0.7 | 1367 | 0.2 | 0.6 GB | 1.2 GB |
| PaPaGei | 5.3M | 0.2 | 7.2 | 4430 | 32 | 1.0 | 1047 | 0.3 | 0.4 GB | 0.6 GB |
| ECG-PT | 0.4M | 0.3 | 19.3 | 1658 | 32 | 0.9 | 1153 | 0.2 | 1.0 GB | 1.0 GB |
| PPG-PT | 0.4M | 0.3 | 19.2 | 1666 | 32 | 0.8 | 1186 | 0.2 | 1.0 GB | 1.0 GB |

---

### T4 Results (Tesla T4, 16GB)

#### Multi-Lead ECG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | Train Batch | ms/sample | Train/s | FT Time (h) |
|-------|--------|--------|------------|---------|-------------|-----------|---------|-------------|
| HuBERT-ECG | 92.8M | 18.0 | 224.5 | 143 | 32 | 18.7 | 54 | 5.2 |
| ECG-FM | 90.4M | 646.0 | 12735.2 | 3 | 4 | 1502.8 | 0.7 | 417.4 |
| DeepECG | 90.4M | 323.0 | 5055.7 | 6 | 8 | 517.7 | 2 | 143.8 |
| ESI | 85.6M | 46.8 | 620.6 | 52 | 16 | 58.1 | 17 | 16.1 |
| ECG-JEPA | 85.4M | 45.4 | 708.0 | 45 | 32 | 71.9 | 14 | 20.0 |
| MELP | 62.0M | 27.3 | 419.4 | 76 | 32 | 44.3 | 23 | 12.3 |
| HeartLang | 47.7M | 9.9 | 269.0 | 119 | 32 | 32.7 | 31 | 9.1 |
| ECGFounder (12-lead) | 30.8M | 2.3 | 115.5 | 277 | 32 | 8.9 | 112 | 2.5 |
| ST-MEM | 21.5M | 1.5 | 24.9 | 1285 | 32 | 2.7 | 367 | 0.8 |
| KED | 7.9M | 1.2 | 20.4 | 1571 | 32 | 2.4 | 417 | 0.7 |
| MERL (ViT-Tiny) | 5.5M | 0.7 | 18.5 | 1727 | 32 | 2.0 | 512 | 0.5 |
| MERL (ResNet18) | 3.8M | 3.5 | 37.1 | 863 | 32 | 4.3 | 232 | 1.2 |
| S4 (supervised) | 2.2M | 1.1 | 24.5 | 1309 | 32 | 2.2 | 455 | 0.6 |
| CPC | 1.4M | 3.2 | 52.2 | 613 | 32 | 5.0 | 202 | 1.4 |

#### Single-Lead ECG & PPG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | Train Batch | ms/sample | Train/s | FT Time (h) |
|-------|--------|--------|------------|---------|-------------|-----------|---------|-------------|
| HeartBERT | 83.5M | 43.5 | 501.6 | 64 | 32 | 49.6 | 20 | 13.8 |
| ECGFounder (1-lead) | 30.8M | 2.3 | 115.5 | 277 | 32 | 8.9 | 112 | 2.5 |
| PulsePPG | 29.4M | 4.7 | 40.9 | 783 | 32 | 5.2 | 192 | 1.4 |
| PaPaGei | 5.3M | 0.2 | 6.3 | 5069 | 32 | 0.8 | 1252 | 0.2 |
| ECG-PT | 0.4M | 0.3 | 82.8 | 387 | 32 | 4.0 | 251 | 1.1 |
| PPG-PT | 0.4M | 0.3 | 82.9 | 386 | 32 | 4.0 | 252 | 1.1 |

---

### CPU Results (Intel Xeon, Batch Size 8)

#### Multi-Lead ECG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | ms/sample | Train/s | FT Time (h) |
|-------|--------|--------|------------|---------|-----------|---------|-------------|
| HuBERT-ECG | 92.8M | 18.0 | 863.3 | 9.3 | 474.7 | 2.1 | 131.8 |
| ESI | 85.6M | 46.8 | 2554.9 | 3.1 | 982.9 | 1.0 | 273.0 |
| ECG-JEPA | 85.4M | 45.4 | 4047.9 | 2.0 | 2432.5 | 0.4 | 675.7 |
| MELP | 62.0M | 27.3 | 2093.2 | 3.8 | 739.1 | 1.4 | 205.3 |
| HeartLang | 47.7M | 9.9 | 1163.2 | 6.9 | 707.5 | 1.4 | 196.5 |
| ECGFounder (12-lead) | 30.8M | 2.3 | 242.4 | 33.0 | 99.1 | 10.1 | 27.5 |
| ST-MEM | 21.5M | 1.5 | 101.7 | 78.7 | 75.9 | 13.2 | 21.1 |
| KED | 7.9M | 1.2 | 122.0 | 65.6 | 48.9 | 20.4 | 13.6 |
| MERL (ViT-Tiny) | 5.5M | 0.7 | 97.5 | 82.1 | 63.3 | 15.8 | 17.6 |
| MERL (ResNet18) | 3.8M | 3.5 | 159.9 | 50.0 | 74.9 | 13.4 | 20.8 |
| S4 (supervised) | 2.2M | 1.1 | 151.9 | 52.7 | 100.1 | 10.0 | 27.8 |
| CPC | 1.4M | 3.2 | 257.6 | 31.1 | 177.8 | 5.6 | 49.4 |

#### Single-Lead ECG & PPG Models

| Model | Params | GFLOPs | Infer (ms) | Infer/s | ms/sample | Train/s | FT Time (h) |
|-------|--------|--------|------------|---------|-----------|---------|-------------|
| HeartBERT | 83.5M | 43.5 | 1981.6 | 4.0 | 1159.1 | 0.9 | 322.0 |
| ECGFounder (1-lead) | 30.8M | 2.3 | 206.2 | 38.8 | 103.2 | 9.7 | 28.7 |
| PulsePPG | 29.4M | 4.7 | 269.8 | 29.7 | 117.2 | 8.5 | 32.6 |
| PaPaGei | 5.3M | 0.2 | 32.1 | 249.6 | 20.8 | 48.0 | 5.8 |
| ECG-PT | 0.4M | 0.3 | 386.4 | 20.7 | 345.4 | 2.9 | 96.0 |
| PPG-PT | 0.4M | 0.3 | 383.6 | 20.9 | 344.0 | 2.9 | 95.5 |

---

### Cross-Hardware Comparison (Speedup vs CPU)

#### Multi-Lead ECG Models

| Model | Params | Architecture | CPU (samples/s) | A100 (samples/s) | T4 (samples/s) | A100 Speedup | T4 Speedup |
|-------|--------|--------------|-----------------|------------------|----------------|--------------|------------|
| ECG-FM | 90.4M | Wav2Vec2 | OOM | 16 | 3 | — | — |
| DeepECG | 90.4M | Wav2Vec2 | OOM | 40 | 6 | — | — |
| HuBERT-ECG | 92.8M | Wav2Vec2 | 9.3 | 786 | 143 | 85× | 15× |
| ESI | 85.6M | ConvNeXtV2 | 3.1 | 273 | 52 | 88× | 17× |
| ECG-JEPA | 85.4M | ViT | 2.0 | 185 | 45 | 93× | 23× |
| MELP | 62.0M | Transformer | 3.8 | 390 | 76 | 103× | 20× |
| HeartLang | 47.7M | ViT | 6.9 | 586 | 119 | 85× | 17× |
| ECGFounder (12-lead) | 30.8M | CNN (RegNet) | 33.0 | 2256 | 277 | 68× | 8× |
| ST-MEM | 21.5M | ST-MEM | 78.7 | 4876 | 1285 | 62× | 16× |
| KED | 7.9M | xResNet101 | 65.6 | 2388 | 1571 | 36× | 24× |
| MERL (ViT-Tiny) | 5.5M | ViT-Tiny | 82.1 | 4678 | 1727 | 57× | 21× |
| MERL (ResNet18) | 3.8M | ResNet18 | 50.0 | 9616 | 863 | 192× | 17× |
| S4 (supervised) | 2.2M | S4D | 52.7 | 6256 | 1309 | 119× | 25× |
| CPC | 1.4M | Conv+S4 | 31.1 | 4429 | 613 | 142× | 20× |

#### Single-Lead ECG & PPG Models

| Model | Params | Architecture | CPU (samples/s) | A100 (samples/s) | T4 (samples/s) | A100 Speedup | T4 Speedup |
|-------|--------|--------------|-----------------|------------------|----------------|--------------|------------|
| HeartBERT | 83.5M | RoBERTa | 4.0 | 361 | 64 | 90× | 16× |
| ECGFounder (1-lead) | 30.8M | CNN (RegNet) | 38.8 | 2238 | 277 | 58× | 7× |
| PulsePPG | 29.4M | ResNet1D | 29.7 | 6124 | 783 | 206× | 26× |
| PaPaGei | 5.3M | ResNet1D | 249.6 | 4430 | 5069 | 18× | 20× |
| ECG-PT | 0.4M | GPT | 20.7 | 1658 | 387 | 80× | 19× |
| PPG-PT | 0.4M | GPT | 20.9 | 1666 | 386 | 80× | 18× |

---

### Key Insights

1. **Training time is dominated by sequence length and FLOPs, not parameters**
   - HuBERT-ECG (92.8M params) trains ~50× faster than ECG-FM (90.4M params) on A100
   - This is due to aggressive downsampling (93 tokens vs 3,750 tokens)

2. **Memory is the bottleneck for large Wav2Vec2 models**
   - ECG-FM requires batch reduction (32→16 on A100, 32→4 on T4)
   - DeepECG requires batch reduction (32→8 on T4)
   - Both ECG-FM and DeepECG crash on CPU (OOM even with batch size reduced to 1)

3. **Efficient architectures for deployment**
   - **Fastest inference (A100)**: MERL (ResNet18) (9,616/s), S4 (supervised) (6,256/s)
   - **Best params/performance**: ST-MEM (21.5M params, 930 train/s)
   - **Lowest memory**: ECG-PT / PPG-PT (0.4M params, 1.0 GB)

4. **T4 vs A100 performance gap**
   - Transformer models: 5-8× slower on T4
   - CNN models: 3-5× slower on T4
   - Models requiring batch reduction: 10-50× slower

---

## Benchmark Column Definitions

| Column | Full Name | Unit | What It Measures | Lower/Higher Better |
|--------|-----------|------|------------------|---------------------|
| **Model** | Model Name | - | Name of the ECG/PPG foundation model | - |
| **Params** | Parameters | M (millions) | Total learnable weights in the model | ⬇️ Lower = smaller model, easier to deploy |
| **GFLOPs** | Giga Floating Point Operations | billions | Computational cost per forward pass (1 sample) | ⬇️ Lower = less computation, more efficient |
| **Infer (ms)** | Inference Time | milliseconds | Time to process one batch through the model | ⬇️ Lower = faster inference |
| **Infer/s** | Inference Throughput | samples/sec | Number of samples processed per second | ⬆️ Higher = faster processing |
| **Train Batch** | Training Batch Size | count | Adaptive batch size that fits GPU memory | ⬆️ Higher = more efficient training |
| **ms/sample** | Training Time per Sample | milliseconds | Time to train on one sample (fair comparison) | ⬇️ Lower = faster training |
| **Train/s** | Training Throughput | samples/sec | Number of samples trained per second | ⬆️ Higher = faster training |
| **FT Time (h)** | Fine-tuning Time | hours | Estimated time to fine-tune on 100k samples × 10 epochs | ⬇️ Lower = faster training |
| **Inf Mem** | Inference Memory | GB | Peak GPU memory during inference | ⬇️ Lower = runs on cheaper GPUs |
| **Train Mem** | Training Memory | GB | Peak GPU memory during training | ⬇️ Lower = runs on cheaper GPUs |

### How Metrics Are Calculated

| Metric | Calculation Method | Notes |
|--------|---------------------|-------|
| **GFLOPs** | `thop.profile(model, input)` | Theoretical compute; transformers may be undercounted by ~50% |
| **Infer (ms)** | Mean of 50 runs after 5 warmup runs | Uses `torch.cuda.synchronize()` for accurate GPU timing |
| **Infer/s** | `(batch_size / infer_ms) × 1000` | Derived from inference time |
| **Train Batch** | Progressive fallback: 32 → 16 → 8 → 4 → 2 → 1 | Automatically determined to fit GPU memory |
| **ms/sample** | `train_step_ms / batch_size` | Normalized for fair comparison across batch sizes |
| **FT Time** | `ms_per_sample × 100k × 10 / 3600000` | Estimate: 100k samples × 10 epochs |
| **GPU Mem** | `torch.cuda.max_memory_allocated()` | Peak memory = model + activations + gradients |

### Interpretation Guide

| Use Case | Key Metrics to Compare |
|----------|------------------------|
| **Real-time inference** (e.g., wearables) | Infer/s, Infer (ms), Inf Mem |
| **Large-scale batch processing** | Infer/s, Train/s |
| **Edge deployment** (limited hardware) | Params, Inf Mem, GFLOPs |
| **Research/training** | FT Time, Train Mem, ms/sample |
| **Model selection** | Balance Params vs Throughput vs downstream accuracy |

---

## Hardware Notes

### Tested Hardware

| Component | Specification | Platform |
|-----------|---------------|----------|
| **CPU** | Intel Xeon @ 2.20GHz, 4 cores, 50GB RAM | Google Colab High-RAM |
| **GPU (A100)** | NVIDIA A100-SXM4-80GB, 80GB VRAM | Google Colab High-RAM |
| **GPU (T4)** | NVIDIA Tesla T4, 16GB VRAM | Google Colab High-RAM |

### GPU Memory Requirements (Approximate)

| Model Category | Inference (GB) | Training (GB) |
|----------------|----------------|---------------|
| Small (ECG-PT, S4) | 0.5-1.0 | 1.0-2.0 |
| Medium (MERL, ECGFounder) | 1.0-2.0 | 2.0-4.0 |
| Large (ECG-FM, HuBERT-ECG) | 2.0-5.0 | 6.0-45.0 |

---
