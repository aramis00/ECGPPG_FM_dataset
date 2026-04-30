# Practical Guide to ECG/PPG Foundation Models for Clinical Researchers

A step-by-step guide for clinicians and researchers seeking to apply ECG/PPG foundation models (FMs) to their own datasets.

---

## Table of Contents

1. [Introduction: What are Foundation Models?](#introduction-what-are-foundation-models)
2. [Quick Start Decision Flowchart](#quick-start-decision-flowchart)
3. [Step 1: Define Your Task and Constraints](#step-1-define-your-task-and-constraints)
4. [Step 2: Select a Foundation Model](#step-2-select-a-foundation-model)
5. [Step 3: Set Up Environment and Download Weights](#step-3-set-up-environment-and-download-weights)
6. [Step 4: Understand Preprocessing Requirements](#step-4-understand-preprocessing-requirements)
7. [Step 5: Extract Embeddings from Your ECG Data](#step-5-extract-embeddings-from-your-ecg-data)
8. [Step 6: Adapt to Your Clinical Task](#step-6-adapt-to-your-clinical-task)
9. [Step 7: Evaluate Rigorously](#step-7-evaluate-rigorously)
10. [Common Pitfalls and Troubleshooting](#common-pitfalls-and-troubleshooting)
11. [Resources and Links](#resources-and-links)

---

## Introduction: What are Foundation Models?

Foundation models are large-scale neural networks pretrained on massive amounts of unlabeled data using self-supervised learning. They learn general-purpose representations that can be adapted to many downstream tasks.

### Key Concepts

| Term | Definition |
|------|------------|
| **Embedding** | A fixed-length numerical vector representing an ECG recording. Typically 256-1024 dimensions. |
| **Encoder** | The neural network component that transforms raw ECG signals into embeddings. |
| **Linear Probing** | Training only a simple linear classifier on frozen (fixed) embeddings. |
| **Fine-tuning** | Updating all model weights on your task-specific data. |
| **Frozen Evaluation** | Using a frozen encoder with a learnable head (can be linear or attention-based). |

### Why Use Foundation Models?

1. **Small labeled datasets**: FMs can achieve strong performance with limited labels by leveraging knowledge from pretraining
2. **Reduced training time**: Linear probing trains in minutes, not hours
3. **State-of-the-art features**: FMs often outperform hand-crafted ECG features
4. **Transfer learning**: Pretrained representations may transfer to new populations and tasks, though performance is task- and dataset-dependent

---

## Quick Start Decision Flowchart

```
┌─────────────────────────────────────────┐
│     How much labeled data do you have?  │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  < 1,000 samples           > 10,000 samples
        │                         │
        ▼                         ▼
  Linear Probing            Consider Fine-tuning
  (frozen weights +         (update all or
   linear head)              partial weights)
        │                         │
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Do you have GPU?     │
        └───────────┬────────────┘
                    │
       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
     Yes                        No
       │                         │
       ▼                         ▼
  Any model                Pre-extract embeddings
  (HuBERT-ECG,             on cloud GPU, then
   ST-MEM, etc.)           use locally or consider 
                            lightweight models (see script/FM_computation/FM_computation.md)
```

---

## Step 1: Define Your Task and Constraints

Before selecting a model, clearly identify:

### 1.1 Clinical Endpoint

Examples: 

| Task Type | Examples | Typical Output |
|-----------|----------|----------------|
| **Diagnosis** | Arrhythmia detection, MI classification | Multi-label classification |
| **Risk Prediction** | 1-year mortality, HF hospitalization | Binary classification or regression |
| **Phenotyping** | Cardiac structure, LVEF estimation | Regression |
| **Screening** | Afib detection, LVH screening | Binary classification |

### 1.2 Data Characteristics

Ask yourself:

- **Sample size**: How many labeled ECGs do you have?
  - `< 500`: Strongly prefer linear probing
  - `500-5,000`: Linear probing recommended; fine-tuning may overfit
  - `> 5,000`: Fine-tuning becomes viable with regularization

- **ECG format**: 
  - Number of leads (12-lead, single-lead, or reduced-lead)?
  - Sampling rate of your data (e.g., 250Hz, 500Hz)?
  - Duration (5s, 10s, variable)?

- **Label quality**: 
  - Are labels noisy or derived from clinical notes?
  - Are there missing labels?

### 1.3 Computational Resources

| Resource | Minimum for Linear Probing | Minimum for Fine-tuning |
|----------|---------------------------|------------------------|
| **GPU** | Optional (can pre-extract) | Required (8+ GB VRAM) |
| **RAM** | 16 GB | 32+ GB |
| **Storage** | ~500 MB per model | Same |

---

## Step 2: Select a Foundation Model

### 2.1 Model Selection Guide

Choose based on your ECG format and task requirements:

#### For 12-Lead ECG

| Model | Best For | Pretrain Data | Feature Dim | Input (Hz × sec) |
|-------|----------|---------------|-------------|------------------|
| **ECGFounder** | General diagnosis | 10.7M ECGs (HEED) | 1024 | 500 × 10s |
| **HuBERT-ECG** | Broad diagnostic coverage | 9.1M ECGs (multi-source) | 768 | 500 × 5s |
| **ST-MEM** | Spatio-temporal features | 189K ECGs | 768 | 250 × 9s |
| **ECG-JEPA** | Latent-space prediction (JEPA) | 180K ECGs | 768 | 250 × 10s |
| **MERL** | Fast inference | 771K ECGs (MIMIC-IV) | 512 | 500 × 10s |
| **ECGFM-KED** | Knowledge-enhanced | 800K ECGs (MIMIC-IV) | 768 | 100 × 10s |
| **CPC** | State-space modeling | 10.7M ECGs (HEED) | 512 | 240 × 10s |
| **ECG-FM** | Wav2Vec2-based | 870K ECGs | 768 | 500 × 10s |
| **DeepECG-SSL** | Multi-source SSL | 1.9M ECGs (MIMIC-IV, Code-15, MHI*) | 768 | 250 × 10s |
| **MELP** | Multi-scale ECG-text | 771K ECGs (MIMIC-IV) | 768 | 500 × 10s |
| **ECG-ESI** | LLM-augmented ECG-text | 660K ECGs (PTB-XL, CSN, MIMIC-IV) | 1024 | 500 × 10s |
| **HeartLang** | QRS-token (heartbeat-level) | 800K ECGs (MIMIC-IV) | 768 | 100 × 10s, tokenized |

> *Input shapes reflect each model's original specification (what the released pretrained weights expect). Some benchmarking pipelines (e.g., `ecg-fm-benchmarking`) further truncate inputs for unified comparison; latency numbers cited elsewhere in this guide were measured at the original-spec lengths shown above.*

#### For Single-Lead ECG

| Model | Best For | Pretrain Data | Notes |
|-------|----------|---------------|-------|
| **ECG-PT (HeartGPT)** | Wearable devices | 42M tokens | GPT-style |
| **HeartBERT** | Holter monitoring | 72M tokens | BERT-style |

#### For PPG Signals

| Model | Best For | Pretrain Data | Notes |
|-------|----------|---------------|-------|
| **PPG-PT (HeartGPT)** | General PPG | 128M tokens | GPT-style |
| **PaPaGei-S** | Wearable PPG | 57K hours | ResNet1D backbone, contrastive pretraining |
| **PulsePPG** | Multi-task PPG | 55K hours | CNN + MLM |

### 2.2 Quick Recommendation

| Scenario | Recommended Model | Reason |
|----------|-------------------|--------|
| **Largest pretraining corpus** | ECGFounder, CPC | Both pretrained on 10.7M ECGs (HEED) |
| **Fastest inference** | MERL (ResNet) | Simple CNN, 9,616 samples/sec on A100 |
| **Limited GPU memory** | MERL or CPC | Lower memory footprint |
| **Multimodal text-ECG learning** | MERL, MELP, ECGFM-KED, or ESI | ECG-text contrastive pretraining; supports zero-shot classification from text prompts |
| **Open-source state-space architecture** | CPC | Open-source SSM model |

> *No single FM consistently outperforms others across all tasks and settings. Existing systematic benchmarks evaluate only a subset of available models, and methodological choices (e.g., unified preprocessing across heterogeneous models) may disadvantage models trained with model-specific input pipelines. Performance is task- and dataset-dependent — always validate on your own target endpoint.*

### 2.3 Interpreting Benchmark Rankings

Published benchmarks of ECG FMs apply unified preprocessing pipelines and standardized input specifications across heterogeneous architectures. This standardization is necessary for fair comparison, but it disproportionately affects models whose original specifications do not match the unified pipeline. As a result, **benchmark rankings partly reflect each architecture's robustness to input-spec mismatch — not pretraining quality alone**.

Example: in the systematic 8-model benchmark from `ecg-fm-benchmarking`, the unified input fed to each encoder differs from the model's original specification as follows (per [`run.sh`](https://github.com/AI4HealthUOL/ecg-fm-benchmarking/blob/main/run.sh)):

| Model | Original input | Benchmark input | Mismatch |
|---|---|---|---|
| **ECG-JEPA** | 250 Hz × 10s = 2500 | 250 Hz × 10s = 2500 | None ✓ |
| **CPC** | 240 Hz × 10s = 2400 | 240 Hz × 2.5s = 600 | 4× truncation |
| **ECGFounder** | 500 Hz × 10s = 5000 | 500 Hz × 2.5s = 1250 | 4× truncation |
| **HuBERT-ECG** | 500 Hz × 5s → 5× decimated | 100 Hz × 5s = 500 | Shape ✓; preprocessing differences may remain |
| **MERL** | 500 Hz × 10s = 5000 | 500 Hz × 2.5s = 1250 | 4× truncation |
| **ST-MEM** | 250 Hz × 9s = 2250 | 250 Hz × 2.4s = 600 | 4× truncation; severe positional-embedding mismatch (8 patches vs 30 in pretraining) |
| **ECGFM-KED** | 100 Hz × 10s = 1000 | 500 Hz × 10s = 5000 | 5× resolution upsample (high-frequency content unseen during pretraining) |

The poor performance of the patch-based transformers (ST-MEM, MERL-ViT) may have suffered disproportionately under truncation because their positional structure was learned at a specific patch count that the benchmark no longer provides. And for the KED, its CNN front-end was trained at 100 Hz, so 5× upsampling shifts its kernels into a different time-resolution regime.

**Implication for clinical use:** When applying any FM to your own data, prioritize matching the model's original input specification (Section 2.1) and original preprocessing pipeline (Section 4). Benchmark provide useful framework but the rankings should be interpreted with awareness of which architectures the benchmark's pipeline structurally favors. 

---

## Step 3: Set Up Environment and Download Weights

### 3.1 Using ecg-fm-benchmarking

The [`ecg-fm-benchmarking`](https://github.com/AI4HealthUOL/ecg-fm-benchmarking) repository provides unified code for 8 foundation models with consistent interfaces for linear probing, frozen evaluation, and fine-tuning.

```bash
# Clone the repository
git clone https://github.com/AI4HealthUOL/ecg-fm-benchmarking.git
cd ecg-fm-benchmarking

# Create conda environment
conda env create -f env.yaml
conda activate lightning3

# For ECG-FM specifically (requires separate environment)
conda env create -f ecg_fm_env.yaml
```

### 3.2 Download Pretrained Weights

| Model | Source | Command/Link |
|-------|--------|--------------|
| **ECG-CPC** | Figshare | [Download](https://figshare.com/articles/dataset/ECG-CPC_Checkpoint_zip/30192604) |
| **ECGFounder** | HuggingFace | `huggingface-cli download PKUDigitalHealth/ECGFounder` |
| **ECG-JEPA** | Google Drive | [Link](https://drive.google.com/file/d/1gMOT4xjQQg0GZkY1iE6NuDzua4ALw00l/view) |
| **ST-MEM** | Google Drive | [Link](https://drive.google.com/file/d/14nScwPk35sFi8wc-cuLJLqudVwynKS0n/view) |
| **MERL** | Google Drive | [Link](https://drive.google.com/drive/folders/13wb4DppUciMn-Y_qC2JRWTbZdz3xX0w2) |
| **ECGFM-KED** | Zenodo | [Link](https://zenodo.org/records/14881564) |
| **HuBERT-ECG** | HuggingFace | `huggingface-cli download Edoardo-BS/hubert-ecg-base` |
| **ECG-FM** | HuggingFace | `huggingface-cli download wanglab/ecg-fm` |
| **DeepECG-SSL** | HuggingFace | `huggingface-cli download heartwise/SSL_Pretrained_model` |
| **MELP** | HuggingFace | `huggingface-cli download fuyingw/MELP_Encoder` |
| **ECG-ESI** | Google Drive | [Link](https://drive.google.com/drive/folders/1I3ECWBEm-Yxhzl1xgx5JE-tEhDRDtN0o) |
| **HeartLang** | HuggingFace | `huggingface-cli download PKUDigitalHealth/HeartLang` |

**Example download with HuggingFace CLI:**
```bash
pip install huggingface_hub
huggingface-cli download PKUDigitalHealth/ECGFounder --local-dir ./checkpoints/ecg_founder/
```

---

## Step 4: Understand Preprocessing Requirements

### ⚠️ Critical: Each Model Has Specific Preprocessing Requirements

Models were pretrained with specific preprocessing pipelines. Mismatched preprocessing can significantly degrade performance.

### 🔑 Key Recommendation: Consult Original Repositories and Papers

**We strongly recommend checking the original repository and paper for each model to understand its exact preprocessing requirements.** Standardized preprocessing pipelines (as used in some benchmarking frameworks) may not match the original pretraining conditions and can diminish model performance.

Each model author designed their preprocessing based on:
- The characteristics of their pretraining dataset
- Signal quality considerations specific to their data sources
- Architectural requirements of their model

**Always refer to the original source** for:
- Exact filtering parameters (cutoff frequencies, filter type)
- Normalization method and parameters
- Lead selection and ordering
- Any data augmentation applied during pretraining

### 4.1 Preprocessing Summary Table

| Model | Sampling Rate | Normalization | Filtering | Lead Requirements |
|-------|---------------|---------------|-----------|-------------------|
| **ECGFounder** | 500 Hz | Z-score | Notch 50Hz + Bandpass 0.67-40Hz | 12 leads |
| **ECG-JEPA** | 250 Hz | - | - | 8 leads (I, II, V1-V6) |
| **ST-MEM** | 250 Hz | - | - | 12 leads |
| **MERL** | 500 Hz | Min-max [0,1] × 1000 | - | 12 leads |
| **ECGFM-KED** | 100 Hz | Z-score | - | 12 leads |
| **CPC** | 240 Hz | Z-score (internal) | - | 12 leads |
| **HuBERT-ECG** | 500 Hz | [-1, 1] scaling | FIR Bandpass 0.05-47Hz | 12 leads (flattened) |
| **ECG-FM** | 500 Hz | Z-score (`Standardize()` transform) | - | 12 leads |
| **DeepECG-SSL** | 250 Hz | Z-score (optional mean/std files) | NeuroKit `ecg_clean` (emrich2023, conditional) | 12 leads |
| **MELP** | 500 Hz | Min-max [0, 1] | NeuroKit `ecg_clean` (emrich2023) | 12 leads |
| **ECG-ESI** | 500 Hz | Z-score | None found | 12 leads |
| **HeartLang** | 100 Hz | Min-max ([-3, 3] or [0, 1], dataset-dependent) | Butterworth bandpass 0.67-40Hz or FIR 0.5Hz HPF | Pre-tokenized (256 QRS windows × 96 samples) |

### 4.2 Common Preprocessing Operations

While you should follow the original repo's preprocessing, here are common operations you may encounter:

```python
import numpy as np
import resampy

# Common operations (adapt based on original repo requirements):

# 1. Handle NaN values
ecg = np.nan_to_num(ecg)

# 2. Resample to model's expected rate
if fs_source != fs_target:
    ecg = resampy.resample(ecg, fs_source, fs_target, axis=-1)

# 3. Z-score normalization (if required by model)
mean = ecg.mean(axis=-1, keepdims=True)
std = ecg.std(axis=-1, keepdims=True)
ecg_normalized = (ecg - mean) / (std + 1e-8)

# 4. Min-max normalization (if required by model)
min_val = ecg.min(axis=-1, keepdims=True)
max_val = ecg.max(axis=-1, keepdims=True)
ecg_normalized = (ecg - min_val) / (max_val - min_val + 1e-8)

# 5. Bandpass filtering (if required - check exact parameters from paper)
from scipy.signal import butter, filtfilt
def bandpass_filter(ecg, lowcut, highcut, fs, order=4):
    nyq = fs / 2
    b, a = butter(order, [lowcut/nyq, highcut/nyq], btype='band')
    return filtfilt(b, a, ecg, axis=-1)
```

### 4.3 Original Repository Links for Preprocessing

| Model | Repository | Preprocessing Notes |
|-------|------------|---------------------|
| **ECGFounder** | [GitHub](https://github.com/PKUDigitalHealth/ECGFounder) | Check `util.py` for filtering pipeline |
| **ECG-JEPA** | [GitHub](https://github.com/sehunfromdaegu/ecg_jepa) | 8-lead selection, resampling |
| **ST-MEM** | [GitHub](https://github.com/vuno/ST-MEM) | Check data loading code |
| **MERL** | [GitHub](https://github.com/cheliu-computation/MERL-ICML2024) | Min-max normalization |
| **ECGFM-KED** | [GitHub](https://github.com/control-spiderman/ECGFM-KED/) | Z-score normalization |
| **HuBERT-ECG** | [GitHub](https://github.com/Edoar-do/HuBERT-ECG) | FIR bandpass + lead flattening |
| **ECG-FM** | [GitHub](https://github.com/bowang-lab/ECG-FM/) | Check preprocessing code |
| **DeepECG-SSL** | [GitHub](https://github.com/HeartWise-AI/DeepECG_Docker) | Check `utils/` for preprocessing |
| **MELP** | [GitHub](https://github.com/HKU-MedAI/MELP) | NeuroKit ECG cleaning (emrich2023) |
| **ECG-ESI** | [GitHub](https://github.com/comp-well-org/ESI) | Check repo for preprocessing |
| **HeartLang** | [GitHub](https://github.com/PKUDigitalHealth/HeartLang) | QRS-based tokenization (heartbeat windows) |

### 4.4 Note on Benchmarking Frameworks

⚠️ **Caution:** Benchmarking frameworks like `ecg-fm-benchmarking` use standardized/minimal preprocessing for consistency across models. While this enables fair comparison, it may not match the original preprocessing and can potentially diminish individual model performance. 

**For best results in your own application:**
- Use the original repository's preprocessing code when possible
- Consult the original paper's methods section
- Test both original and standardized preprocessing if unsure

---

## Step 5: Extract Embeddings from Your ECG Data

### 5.1 What Are Embeddings?

Embeddings are fixed-length numerical vectors that represent each ECG recording. They are typically extracted from the encoder's output after:
- The final layer normalization
- Global average pooling (for CNNs)
- Mean pooling across time (for Transformers)

### 5.2 Feature Extraction Locations

The table below shows the **standard/final layer** extraction points. However, **recent research suggests that intermediate (preceding) layers may contain valuable task-specific information** depending on your clinical endpoint. Consider experimenting with features from different layers if final-layer features underperform.

| Model | Standard Feature Layer | Pooling Method | Output Shape |
|-------|------------------------|----------------|--------------|
| **ECGFounder** | After `stage_list[6]` (final) | Global Average Pooling | (batch, 1024) |
| **ECG-JEPA** | `encoder.norm(x)` (final) | Mean over time | (batch, 768) |
| **ST-MEM** | Transformer block 11 (final) | Mean over patches | (batch, 768) |
| **MERL** | After `layer4` (final) | Global Average Pooling | (batch, 512) |
| **ECGFM-KED** | Backbone + projection | Mean over time | (batch, 768) |
| **CPC** | S4 encoder output (final) | Mean over time | (batch, 512) |
| **HuBERT-ECG** | `last_hidden_state` (final) | Mean over time | (batch, 768) |
| **ECG-FM** | `encoder_out` (transformer final) | Masked mean: `x.sum(dim=1) / (x != 0).sum(dim=1)` | (batch, 768) |
| **DeepECG-SSL** | `encoder_out` (ECGTransformerClassifier) | Masked mean: `x.sum(dim=1) / (x != 0).sum(dim=1)` | (batch, 768) |
| **MELP** | Transformer encoder output | `torch.mean(x, dim=1)` over time | (batch, 768) |
| **ECG-ESI** | Final latent embedding (post-encoder) | L2-normalized (no temporal pooling) | (batch, 1024) |
| **HeartLang** | CLS token (final transformer block) | CLS extraction (no pooling) | (batch, 768) |

### 5.3 Extracting Features from Intermediate Layers

Recent work has shown that **earlier layers may capture different aspects of the ECG signal**:
- **Early layers**: Often capture low-level morphological features (QRS shape, ST segment)
- **Middle layers**: May capture rhythm patterns and lead correlations
- **Final layers**: Typically capture high-level, abstract representations

**When to try intermediate layers:**
- If final-layer linear probing performs poorly
- For tasks involving specific waveform morphology
- When the pretraining objective differs significantly from your task

```python
# Example: Extracting features from multiple layers (model-specific)
# This is conceptual - actual implementation depends on the model architecture

def extract_multi_layer_features(model, x):
    """
    Extract features from multiple layers for experimentation.
    Concatenate or select based on downstream task performance.
    """
    features = {}
    
    # Register hooks to capture intermediate activations
    activations = {}
    def get_activation(name):
        def hook(model, input, output):
            activations[name] = output.detach()
        return hook
    
    # Register hooks on layers of interest
    # (adjust layer names based on specific model architecture)
    model.layer_6.register_forward_hook(get_activation('layer_6'))
    model.layer_9.register_forward_hook(get_activation('layer_9'))
    model.layer_12.register_forward_hook(get_activation('layer_12'))
    
    # Forward pass
    _ = model(x)
    
    return activations
```

### 5.4 Example: Extracting Embeddings

```python
import torch
import numpy as np
from pathlib import Path

# Assuming you've set up the environment and have the model loaded
# This is conceptual - actual implementation depends on your setup

def extract_embeddings_batch(model, ecg_batch, device='cuda'):
    """
    Extract embeddings from a batch of ECGs.
    
    Args:
        model: Loaded foundation model
        ecg_batch: numpy array of shape (batch, n_leads, n_samples)
        device: 'cuda' or 'cpu'
    
    Returns:
        embeddings: numpy array of shape (batch, feature_dim)
    """
    model.eval()
    with torch.no_grad():
        x = torch.from_numpy(ecg_batch).float().to(device)
        embeddings = model.extract_features(x)  # Model-specific method
        return embeddings.cpu().numpy()

# Process your entire dataset
def extract_all_embeddings(model, ecg_dataset, batch_size=64, device='cuda'):
    """
    Extract embeddings for an entire dataset.
    
    Args:
        model: Loaded foundation model
        ecg_dataset: List or array of ECG recordings
        batch_size: Batch size for processing
        device: 'cuda' or 'cpu'
    
    Returns:
        all_embeddings: numpy array of shape (n_samples, feature_dim)
    """
    all_embeddings = []
    
    for i in range(0, len(ecg_dataset), batch_size):
        batch = ecg_dataset[i:i+batch_size]
        batch_embeddings = extract_embeddings_batch(model, batch, device)
        all_embeddings.append(batch_embeddings)
    
    return np.vstack(all_embeddings)
```

### 5.5 Saving and Loading Embeddings

Once extracted, save embeddings to avoid recomputing:

```python
# Save embeddings
np.savez_compressed('embeddings.npz', 
                     embeddings=embeddings, 
                     labels=labels,
                     patient_ids=patient_ids)

# Load embeddings
data = np.load('embeddings.npz')
embeddings = data['embeddings']
labels = data['labels']
```

---

## Step 6: Adapt to Your Clinical Task

### 6.1 Evaluation Approaches

There are three common adaptation strategies:

| Approach | What's Trained | When to Use | Training Time* |
|----------|----------------|-------------|---------------|
| **Linear Probing** | Only classifier (linear head, e.g., logistic regression) | Small datasets (<1,000 samples) | Minutes |
| **Frozen Evaluation** | Classifier + attention head | Medium datasets (1,000-5,000) | ~30 min |
| **Fine-tuning** | All model weights | Large datasets (>5,000) | Hours |

> *Indicative training times; actual values depend on dataset size, embedding dimension, head architecture, and hardware. See [`script/FM_computation/FM_computation.md`](./script/FM_computation/FM_computation.md) for measured per-sample training times across models and hardware tiers.*

### 6.2 Linear Probing (Recommended for Small Datasets)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load your pre-extracted embeddings
embeddings = np.load('embeddings.npz')['embeddings']
labels = np.load('embeddings.npz')['labels']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    embeddings, labels, test_size=0.2, random_state=42, stratify=labels
)

# Scale features (important for logistic regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train logistic regression
clf = LogisticRegression(
    max_iter=1000,
    class_weight='balanced',  # Handle imbalanced classes
    C=1.0,
    random_state=42
)
clf.fit(X_train_scaled, y_train)

# Predict probabilities for evaluation
y_pred_proba = clf.predict_proba(X_test_scaled)
```

### 6.3 Using ecg-fm-benchmarking for Full Pipeline

For an end-to-end pipeline (linear probing, frozen evaluation, or fine-tuning) across the 8 models supported by `ecg-fm-benchmarking`, configure paths and model/evaluation choices in [`run.sh`](https://github.com/AI4HealthUOL/ecg-fm-benchmarking/blob/main/run.sh) and follow the repo's documentation. Note the caveats on standardized preprocessing in §4.4 above.

### 6.4 Fine-tuning Best Practices

If fine-tuning, use these regularization strategies to prevent overfitting:

```python
# Key hyperparameters for fine-tuning
learning_rate = 1e-5  # Much lower than training from scratch
weight_decay = 0.01   # L2 regularization
warmup_steps = 500    # Gradually increase LR
epochs = 10-30        # Monitor validation loss for early stopping
dropout = 0.1-0.3     # Add dropout before classifier

# Discriminative learning rates (optional)
# Lower LR for encoder, higher for head
encoder_lr = 1e-5
head_lr = 1e-3
```

---

## Step 7: Evaluate Rigorously

### 7.1 Evaluation Metrics

| Task Type | Primary Metrics | Secondary Metrics |
|-----------|----------------|-------------------|
| **Binary Classification** | AUROC, AUPRC | Sensitivity, Specificity, F1 |
| **Multi-label Classification** | Macro AUROC, Micro AUROC | Per-class AUROC |
| **Regression** | MAE, RMSE | R², Calibration |

### 7.2 Required Evaluation Components

1. **Held-out Test Set**: Never use for hyperparameter tuning
2. **Confidence Intervals**: Use bootstrapping (n=1000 iterations)
3. **Subgroup Analysis**: Evaluate across demographics (age, sex, race)
4. **Baseline Comparisons**: 
   - Supervised model trained from scratch on same data
   - Traditional ML with hand-crafted features
   - Clinical risk scores (if applicable)

### 7.3 Evaluation Code Example

```python
from sklearn.metrics import roc_auc_score, average_precision_score
import numpy as np

def evaluate_with_bootstrap(y_true, y_pred_proba, n_bootstrap=1000):
    """
    Evaluate with bootstrap confidence intervals.
    
    Args:
        y_true: Ground truth labels
        y_pred_proba: Predicted probabilities
        n_bootstrap: Number of bootstrap iterations
    
    Returns:
        Dictionary with point estimates and 95% CIs
    """
    n_samples = len(y_true)
    
    # Point estimates
    auroc = roc_auc_score(y_true, y_pred_proba)
    auprc = average_precision_score(y_true, y_pred_proba)
    
    # Bootstrap
    auroc_bootstrap = []
    auprc_bootstrap = []
    
    for _ in range(n_bootstrap):
        idx = np.random.choice(n_samples, n_samples, replace=True)
        try:
            auroc_bootstrap.append(roc_auc_score(y_true[idx], y_pred_proba[idx]))
            auprc_bootstrap.append(average_precision_score(y_true[idx], y_pred_proba[idx]))
        except ValueError:
            continue  # Skip if only one class in bootstrap sample
    
    return {
        'auroc': auroc,
        'auroc_95ci': (np.percentile(auroc_bootstrap, 2.5), np.percentile(auroc_bootstrap, 97.5)),
        'auprc': auprc,
        'auprc_95ci': (np.percentile(auprc_bootstrap, 2.5), np.percentile(auprc_bootstrap, 97.5)),
    }

# Example usage
results = evaluate_with_bootstrap(y_test, y_pred_proba[:, 1])
print(f"AUROC: {results['auroc']:.3f} (95% CI: {results['auroc_95ci'][0]:.3f}-{results['auroc_95ci'][1]:.3f})")
```

### 7.4 Subgroup Analysis Template

```python
def subgroup_analysis(df, y_true, y_pred_proba, group_col):
    """
    Evaluate performance across subgroups.
    
    Args:
        df: DataFrame with demographic information
        y_true: Ground truth labels
        y_pred_proba: Predicted probabilities
        group_col: Column name for grouping (e.g., 'sex', 'age_group')
    
    Returns:
        DataFrame with per-subgroup performance
    """
    results = []
    
    for group_value in df[group_col].unique():
        mask = df[group_col] == group_value
        n_samples = mask.sum()
        
        if n_samples < 30:  # Skip small subgroups
            continue
            
        auroc = roc_auc_score(y_true[mask], y_pred_proba[mask])
        
        results.append({
            'group': group_value,
            'n_samples': n_samples,
            'auroc': auroc
        })
    
    return pd.DataFrame(results)
```

---

## Common Pitfalls and Troubleshooting

### ❌ Pitfall 1: Preprocessing Mismatch

**Problem**: Using different preprocessing than what the model was trained with. This is one of the most common reasons for poor FM performance. Standardized preprocessing pipelines in benchmarking frameworks may not match original pretraining conditions.

**Solution**: 
- **Always consult the original paper and repository** for exact preprocessing requirements
- Clone the original repo and use their data loading/preprocessing code directly when possible
- Do not assume that "standardized" preprocessing from benchmark frameworks is optimal
- Test both original and standardized preprocessing if results are unexpectedly poor

### ❌ Pitfall 2: Data Leakage

**Problem**: Patients appearing in both train and test sets.

**Solution**: Split by patient ID, not by ECG recording. Use stratified splits.

```python
# Correct: Split by patient
from sklearn.model_selection import GroupShuffleSplit

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=patient_ids))
```

### ❌ Pitfall 3: Overfitting with Fine-tuning

**Problem**: Fine-tuning on small datasets leads to worse performance than linear probing.

**Solution**: 
- Start with linear probing
- Use aggressive regularization (high dropout, low LR)
- Early stopping based on validation loss
- Consider frozen evaluation as a middle ground

### ❌ Pitfall 4: Ignoring Class Imbalance

**Problem**: Models predict majority class for all samples.

**Solution**: 
- Use class-weighted loss functions
- Monitor AUPRC in addition to AUROC
- Consider oversampling minority class

### ❌ Pitfall 5: Wrong Sampling Rate

**Problem**: Feeding 500 Hz ECGs to a model expecting 250 Hz.

**Solution**: Always resample to the model's expected rate.

```python
import resampy
ecg_resampled = resampy.resample(ecg, sr_source=500, sr_target=250, axis=-1)
```

---

## Resources and Links

### Model Repositories

| Model | Repository | Weights |
|-------|------------|---------|
| ECGFounder | [GitHub](https://github.com/PKUDigitalHealth/ECGFounder) | [HuggingFace](https://huggingface.co/PKUDigitalHealth/ECGFounder) |
| ECG-JEPA | [GitHub](https://github.com/sehunfromdaegu/ecg_jepa) | [Google Drive](https://drive.google.com/file/d/1gMOT4xjQQg0GZkY1iE6NuDzua4ALw00l/view) |
| HuBERT-ECG | [GitHub](https://github.com/Edoar-do/HuBERT-ECG) | [HuggingFace](https://huggingface.co/Edoardo-BS) |
| ST-MEM | [GitHub](https://github.com/vuno/ST-MEM) | [Google Drive](https://drive.google.com/file/d/14nScwPk35sFi8wc-cuLJLqudVwynKS0n/view) |
| MERL | [GitHub](https://github.com/cheliu-computation/MERL-ICML2024) | [Google Drive](https://drive.google.com/drive/folders/13wb4DppUciMn-Y_qC2JRWTbZdz3xX0w2) |
| ECGFM-KED | [GitHub](https://github.com/control-spiderman/ECGFM-KED/) | [Zenodo](https://zenodo.org/records/14881564) |
| ECG-CPC | [GitHub](https://github.com/AI4HealthUOL/ecg-fm-benchmarking) | [Figshare](https://figshare.com/articles/dataset/ECG-CPC_Checkpoint_zip/30192604) |
| ECG-FM | [GitHub](https://github.com/bowang-lab/ECG-FM/) | [HuggingFace](https://huggingface.co/wanglab/ecg-fm) |
| DeepECG-SSL | [GitHub](https://github.com/HeartWise-AI/DeepECG_Docker) | [HuggingFace](https://huggingface.co/heartwise/SSL_Pretrained_model/tree/main) |
| MELP | [GitHub](https://github.com/HKU-MedAI/MELP) | [HuggingFace](https://huggingface.co/fuyingw/MELP_Encoder) |
| ECG-ESI | [GitHub](https://github.com/comp-well-org/ESI) | [Google Drive](https://drive.google.com/drive/folders/1I3ECWBEm-Yxhzl1xgx5JE-tEhDRDtN0o) |
| HeartLang | [GitHub](https://github.com/PKUDigitalHealth/HeartLang) | [HuggingFace](https://huggingface.co/PKUDigitalHealth/HeartLang/) |

### Benchmark Datasets

| Dataset | Access | Link |
|---------|--------|------|
| PTB-XL | Open | [PhysioNet](https://physionet.org/content/ptb-xl/1.0.3/) |
| MIMIC-IV-ECG | Credentialed | [PhysioNet](https://physionet.org/content/mimic-iv-ecg/1.0/) |
| CODE-15% | Open | [Zenodo](https://zenodo.org/records/4916206) |
| Chapman | Open | [Figshare](https://figshare.com/articles/dataset/Chapman_ECG_dataset/25558926) |
| CPSC 2018 | Open | [PhysioNet](https://physionet.org/content/challenge-2020/1.0.2/) |

### Additional Documentation

- [ecg-fm-benchmarking README](https://github.com/AI4HealthUOL/ecg-fm-benchmarking)
- [ECG Foundation Models Survey](https://arxiv.org/abs/2509.25095)
- [Computational Benchmarks](./script/FM_computation/FM_computation.md)

---

*Last updated: April 2026*

