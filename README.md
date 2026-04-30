# ECG/PPG Open Foundation Models and Datasets

A comprehensive collection of open-source foundation models and publicly available datasets for electrocardiogram (ECG) and photoplethysmogram (PPG) analysis.

🌐 **Interactive Version**: <a href="https://aramis00.github.io/ECGPPG_FM_dataset/" target="_blank">https://aramis00.github.io/ECGPPG_FM_dataset/</a>

## Overview

This repository provides curated lists of:
- **17 Foundation Models** for ECG/PPG analysis (12-lead ECG, single-lead ECG, and PPG)
- **15 Open 12-Lead ECG Datasets** 
- **23 Open Reduced-Lead ECG and PPG Datasets**
- **Computational Benchmarks** comparing model inference/training performance across hardware

All models include links to code repositories and pretrained weights. All datasets include access links and citations.

## Data Files

For programmatic access, data is available in CSV and JSON formats:

```
data/
├── models.csv                    # Foundation models
├── models.json
├── ecg_datasets_12lead.csv       # 12-lead ECG datasets
├── ecg_datasets_12lead.json
├── ecg_ppg_datasets_reduced.csv  # Reduced-lead ECG & PPG datasets
└── ecg_ppg_datasets_reduced.json
```

### Quick Start (Python)
```python
import pandas as pd

# Load models
models = pd.read_csv('data/models.csv')

# Load datasets
datasets_12lead = pd.read_csv('data/ecg_datasets_12lead.csv')
datasets_reduced = pd.read_csv('data/ecg_ppg_datasets_reduced.csv')

# Filter by size (using numeric columns)
large_datasets = datasets_12lead[datasets_12lead['records_numeric'] > 100000]
```

---

## Foundation Models

### 12-Lead ECG Foundation Models

| Model | Year | Backbone | Method | Pretrain Data | Data Size | Code | Weights |
|-------|------|----------|--------|---------------|-----------|------|---------|
| <a href="https://doi.org/10.48550/arXiv.2410.08559" target="_blank">ECG-JEPA</a> | 2024 | Transformer | M/R/G | CSN, Code-15 | 180K | <a href="https://github.com/sehunfromdaegu/ecg_jepa" target="_blank">Code</a> | <a href="https://github.com/sehunfromdaegu/ecg_jepa" target="_blank">Weights</a> |
| <a href="https://doi.org/10.1101/2024.11.14.24317328" target="_blank">HuBERT-ECG</a> | 2024 | CNN+Transformer | M/R/G | CODE, CPSC, CPSC-Extra, PTB, PTB-XL, ... | 9.1M | <a href="https://github.com/Edoar-do/HuBERT-ECG" target="_blank">Code</a> | <a href="https://huggingface.co/Edoardo-BS" target="_blank">Weights</a> |
| <a href="https://doi.org/10.1093/eurheartj/ehaf1119" target="_blank">DeepECG</a> | 2025 | CNN+Transformer | CL | MIMIC-IV-ECG, Code-15, MHI-ds* | 1.9M | <a href="https://github.com/HeartWise-AI/DeepECG_Docker" target="_blank">Code</a> | <a href="https://huggingface.co/heartwise/SSL_Pretrained_model/tree/main" target="_blank">Weights</a> |
| <a href="https://doi.org/10.1093/jamiaopen/ooaf122" target="_blank">ECG-FM</a> | 2025 | CNN+Transformer | CL | CPSC, CPSC-Extra, PTB-XL, Georgia, CS... | 870K | <a href="https://github.com/bowang-lab/ECG-FM/" target="_blank">Code</a> | <a href="https://huggingface.co/wanglab/ecg-fm" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2502.10707" target="_blank">HeartLang</a> | 2025 | Transformer | M/R/G | MIMIC-IV-ECG | 800K | <a href="https://github.com/PKUDigitalHealth/HeartLang" target="_blank">Code</a> | <a href="https://huggingface.co/PKUDigitalHealth/HeartLang/" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2509.25095" target="_blank">CPC</a> | 2025 | CNN+SSM | CL | HEED | 10.7M | <a href="https://github.com/AI4HealthUOL/ecg-fm-benchmarking" target="_blank">Code</a> | <a href="https://figshare.com/articles/dataset/ECG-CPC_Checkpoint_zip/30192604?file=58173919" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2405.19366" target="_blank">ESI</a> | 2024 | CNN (Text: Transformer) | CL+M/R/G | PTB-XL, CSN, MIMIC-IV-ECG | 660K | <a href="https://github.com/comp-well-org/ESI" target="_blank">Code</a> | <a href="https://drive.google.com/drive/folders/1I3ECWBEm-Yxhzl1xgx5JE-tEhDRDtN0o" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2403.06659" target="_blank">MERL</a> | 2024 | CNN (Text: Transformer) | CL | MIMIC-IV-ECG | 771K | <a href="https://github.com/cheliu-computation/MERL-ICML2024" target="_blank">Code</a> | <a href="https://drive.google.com/drive/folders/13wb4DppUciMn-Y_qC2JRWTbZdz3xX0w2" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2506.21803" target="_blank">MELP</a> | 2025 | CNN+Transformer (Text: Transformer) | CL+M/R/G | MIMIC-IV-ECG | 760K | <a href="https://github.com/HKU-MedAI/MELP" target="_blank">Code</a> | <a href="https://huggingface.co/fuyingw/MELP_Encoder" target="_blank">Weights</a> |
| <a href="https://doi.org/10.1016/j.xcrm.2024.101875" target="_blank">KED</a> | 2024 | CNN (Text: Transformer) | CL | MIMIC-IV-ECG | 800K | <a href="https://github.com/control-spiderman/ECGFM-KED/" target="_blank">Code</a> | <a href="https://zenodo.org/records/14881564" target="_blank">Weights</a> |
| <a href="https://doi.org/10.1056/AIoa2401033" target="_blank">ECGFounder</a> | 2024 | CNN | SL (multilabel) | HEED | 10.7M | <a href="https://github.com/PKUDigitalHealth/ECGFounder" target="_blank">Code</a> | <a href="https://huggingface.co/PKUDigitalHealth/ECGFounder/tree/main" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2402.09450" target="_blank">ST-MEM</a> | 2024 | Transformer | M/R/G | CSN, Code-15 | 189K | <a href="https://github.com/vuno/ST-MEM" target="_blank">Code</a> | <a href="https://github.com/vuno/ST-MEM" target="_blank">Weights</a> |

### Single-Lead ECG Foundation Models

| Model | Year | Backbone | Method | Pretrain Data | Data Size | Code | Weights |
|-------|------|----------|--------|---------------|-----------|------|---------|
| <a href="https://doi.org/10.48550/arXiv.2407.20775" target="_blank">ECG-PT</a> | 2024 | Transformer | M/R/G | PhysioNet CinC 2020 | 42M tokens | <a href="https://github.com/harryjdavies/HeartGPT" target="_blank">Code</a> | <a href="https://github.com/harryjdavies/HeartGPT/tree/main/Model_files" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2411.11896" target="_blank">HeartBERT</a> | 2024 | Transformer | M/R/G | MIT-BIH, PTB-XL, European ST-T | 72M tokens | <a href="https://github.com/ecgResearch/HeartBert" target="_blank">Code</a> | <a href="https://drive.google.com/drive/folders/10flbRia9rDWeS8-TLScRUT6JBv81iN-4" target="_blank">Weights</a> |

### PPG Foundation Models

| Model | Year | Backbone | Method | Pretrain Data | Data Size | Code | Weights |
|-------|------|----------|--------|---------------|-----------|------|---------|
| <a href="https://doi.org/10.48550/arXiv.2407.20775" target="_blank">PPG-PT</a> | 2024 | Transformer | M/R/G | Capnobase/BIDMC/Cuffless BP  | 128M tokens | <a href="https://github.com/harryjdavies/HeartGPT" target="_blank">Code</a> | <a href="https://github.com/harryjdavies/HeartGPT/tree/main/Model_files" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2410.20542" target="_blank">PaPaGei-S/-P</a> | 2024 | CNN | CL | VitalDB, MIMIC-III waveform, MESA sleep | 57K hours | <a href="https://github.com/Nokia-Bell-Labs/papagei-foundation-model" target="_blank">Code</a> | <a href="https://zenodo.org/records/13983110" target="_blank">Weights</a> |
| <a href="https://doi.org/10.48550/arXiv.2502.01108" target="_blank">PulsePPG</a> | 2025 | CNN | CL+M/R/G | MOODS | 55K hours | <a href="https://github.com/maxxu05/pulseppg" target="_blank">Code</a> | <a href="https://zenodo.org/records/17345536" target="_blank">Weights</a> |

---

## Open Datasets

### Access Legend
- **O** = Open (freely available)
- **R** = Restricted (requires Data Use Agreement)
- **C** = Credentialed (requires credentialing process)

### 12-Lead ECG Datasets

| Dataset | Records | Patients | Country | Setting | Access | Link |
|---------|---------|----------|---------|---------|--------|------|
| HEED | 11.7 M | 2.1 M | US | hospital diagnostic ECG | C | <a href="https://bdsp.io/content/heedb/4.0/" target="_blank">Link</a> |
| CODE | 2.3 M (346 K CODE-15%)  | 1.7 M(234 K CODE-15%) | Brazil | tele-health setting  | R (CODE 15%, O; CODE-test, O) | <a href="https://doi.org/10.17044/scilifelab.15169716" target="_blank">Link</a> |
| MIMIC-IV ECG | 800 K | 161 K | US | hospital diagnostic ECG | C | <a href="https://doi.org/10.13026/b95v-ff39" target="_blank">Link</a> |
| SNUH LYDUS  167K | 167 K/, 50K | 167 K/ 50K | South Korea | Hospital diagnostic ECG | R (50K, O) | <a href="https://khdp.net/database/data-search-detail/402/LYDUS-SNUH-ECG-160K/1.0.0" target="_blank">Link</a> |
| IKEM | 98.1 K | 30.3 K | Czech Republic | hospital diagnostic ECG | O | <a href="https://doi.org/10.5281/zenodo.8393007" target="_blank">Link</a> |
| UK Biobank | 91.1 K | 82.7 K | UK | volunteered exams, diagnost... | R | <a href="https://www.ukbiobank.ac.uk/" target="_blank">Link</a> |
| CSN | 45.2 K | 45.2 K | China | hospital diagnostic ECG | O | <a href="https://doi.org/10.13026/wgex-er52" target="_blank">Link</a> |
| SPH | 25.8 K | 25.7 K | China | hospital diagnostic ECG | O | <a href="https://doi.org/10.6084/m9.figshare.c.5779802.v1" target="_blank">Link</a> |
| PTB-XL | 21.8 K | 18.9 K | Germany | diagnostic ECG - NR-Schille... | O | <a href="https://doi.org/10.13026/6sec-a640" target="_blank">Link</a> |
| ZZU pECG | 14.2 K | 11.6 K | China | hospital diagnostic ECG, pe... | O | <a href="https://doi.org/10.6084/m9.figshare.27078763" target="_blank">Link</a> |
| Georgia* | 10.3 K | 10.2 K | US | hospital diagnostic ECG  | O | <a href="https://physionet.org/content/challenge-2020/1.0.2/training/georgia/#files-panel" target="_blank">Link</a> |
| CPSC 2018, CPSC 2018 extra | 10.3 K | 9.5 K | China | hospital diagnostic ECG | O | <a href="https://physionet.org/content/challenge-2020/1.0.2/training/cpsc_2018/#files-panel" target="_blank">Link</a> |
| SaMi-Trop | 2.0 K | 1.6 K | Brazil | Chagas cohort | O | <a href="https://doi.org/10.5281/zenodo.4905618" target="_blank">Link</a> |
| Pre-/Post-STEMI ECG Database, University of Michigan | 266 | 266 | US | hospital diagnostic ECG, ST... | O | <a href="https://doi.org/10.7302/gk9v-ka27" target="_blank">Link</a> |
| EchoNext | 100K | 36.3K | US | hospital diagnostic ECG | O | <a href="https://physionet.org/content/echonext/1.1.0/" target="_blank">Link</a> |

### Reduced-Lead ECG and PPG Datasets

| Dataset | Records | PPG | ECG | Country | Access | Link |
|---------|---------|-----|-----|---------|--------|------|
| MIMIC-III Waveform Database | 67.8K (MIMIC-III match... | ✓ | ✓ | US | O | <a href="https://physionet.org/content/mimic3wdb-matched/1.0/" target="_blank">Link</a> |
| WAVES | 550K (ECG); 510K (PPG) | ✓ | ✓ | US | R | <a href="https://stanford.redivis.com/WAVES/datasets" target="_blank">Link</a> |
| SCOPE | 4.5K | ✓ | ✓ | South Korea | O | <a href="https://khdp.net/database/data-search-detail/698/icu-cardiac-arrest/1.0" target="_blank">Link</a> |
| VitalDB | 6.4K | ✓ | ✓ | South Korea | O | <a href="https://physionet.org/content/vitaldb/1.0.0/" target="_blank">Link</a> |
| MOVER | 83.5K | ✓ | ✓ | US | O (currently N/A due to data revision) | <a href="https://doi.org/10.24432/C5VS5G" target="_blank">Link</a> |
| MIT-BIH Arrhythmia | 48 | - | ✓ | US | O | <a href="https://doi.org/10.13026/C2F305" target="_blank">Link</a> |
| Long-term ST | 86 | - | ✓ | Slovenia, Italy | O | <a href="https://doi.org/10.13026/C2G01T" target="_blank">Link</a> |
| European ST-T | 90 | - | ✓ | 8 Europe countries | O | <a href="https://doi.org/10.13026/C2D59Z" target="_blank">Link</a> |
| St Petersburg INCART | 75 | - | ✓ | Russia | O | <a href="https://doi.org/10.13026/C2V88N" target="_blank">Link</a> |
| MIT-BIH Atrial fibrillation | 25 | - | ✓ | US | O | <a href="https://doi.org/10.13026/C2MW2D" target="_blank">Link</a> |
| Long term AF | 84 | - | ✓ | US | O | <a href="https://physionet.org/content/ltafdb/1.0.0/" target="_blank">Link</a> |
| IRIDIA-AF | 167 | - | ✓ | Belgium | O | <a href="https://zenodo.org/records/8405941" target="_blank">Link</a> |
| CPSC 2021 Paroxysmal Afib | 1.4K | - | ✓ |  | O | <a href="https://physionet.org/content/cpsc2021/1.0.0/" target="_blank">Link</a> |
| Icentia11k | 54K | - | ✓ | Canada | O | <a href="https://physionet.org/content/icentia11k-continuous-ecg/1.0/" target="_blank">Link</a> |
| CapnoBase | 42 | ✓ | ✓ | Canada | R | <a href="https://doi.org/10.5683/SP2/NLB8IT" target="_blank">Link</a> |
| MESA polysomnography | 2K | ✓ | ✓ | US | R | <a href="https://sleepdata.org/datasets/mesa" target="_blank">Link</a> |
| SDB | 146 | ✓ | ✓ | Canada | O | <a href="https://doi.org/10.6084/m9.figshare.1209662" target="_blank">Link</a> |
| NuMoM2b | 5337 | ✓ | ✓ | US | R | <a href="https://sleepdata.org/datasets/numom2b/" target="_blank">Link</a> |
| PPG-BP | 657 | ✓ | - | China | O | <a href="https://doi.org/10.6084/m9.figshare.5459299.v5" target="_blank">Link</a> |
| PPG DaLiA | 15 | ✓ | ✓ | Germany | O | <a href="https://doi.org/10.24432/C53890" target="_blank">Link</a> |
| WESAD | 15 | ✓ | ✓ | Germany | O | <a href="https://doi.org/10.24432/C57K5T" target="_blank">Link</a> |
| TROIKA 115,116 (= IEEEPPG) | 12 | ✓ | ✓ | China | O | <a href="https://zenodo.org/records/3902710" target="_blank">Link</a> |
| ECSMP | 89 | ✓ | ✓ | China | O | <a href="https://data.mendeley.com/datasets/vn5nknh3mn/2" target="_blank">Link</a> |

---

## Computational Benchmarks

We provide comprehensive computational benchmarks comparing foundation models on parameters, FLOPs, inference speed, training throughput, and memory usage across different hardware (A100, T4, CPU).

```
script/FM_computation/
├── FM_computation.py              # Benchmark script
├── FM_computation.md              # Documentation & results
└── results/
    ├── ecg_benchmark_A100_*.json  # A100 GPU results
    ├── ecg_benchmark_T4_*.json    # T4 GPU results
    └── ecg_benchmark_cpu_*.json   # CPU results
```

Key findings:
- **Training time is dominated by sequence length and FLOPs**, not parameter count
- **HuBERT-ECG** (92.8M params) trains ~50× faster than **ECG-FM** (90.4M params) due to aggressive downsampling
- **MERL (ResNet18)** achieves fastest inference at 9,616 samples/sec on A100
- Large Wav2Vec2 models (ECG-FM, DeepECG) require significant GPU memory (40+ GB for training)

See <a href="script/FM_computation/FM_computation.md" target="_blank">`script/FM_computation/FM_computation.md`</a> for detailed benchmark results and methodology.

---

## Abbreviations

### Pretraining Methods
- **CL** = Contrastive Learning
- **M/R/G** = Masked/Reconstructive/Generative Learning
- **SL** = Supervised Learning
- **SSL** = Self-Supervised Learning

### Technical Terms
- **ECG** = Electrocardiogram
- **PPG** = Photoplethysmogram
- **AUROC** = Area Under the Receiver Operating Characteristic Curve
- **Dx.** = Diagnosis
- **Afib** = Atrial Fibrillation
- **LVEF** = Left Ventricular Ejection Fraction

### Datasets
- **HEED** = Harvard-Emory ECG Database
- **CODE** = Clinical Outcomes in Digital Electrocardiography
- **MIMIC** = Medical Information Mart for Intensive Care
- **PTB-XL** = Physikalisch-Technische Bundesanstalt ECG Database
- **CSN** = Chapman-Shaoxing-Ningbo Database
- **CPSC** = China Physiological Signal Challenge

---

## Citation

If you use this resource, please cite the relevant papers for each model and dataset you use. BibTeX citations are available in the JSON data files.

---

## Contributing

Contributions are welcome! Please open an issue or pull request to:
- Add new open-source foundation models
- Add new publicly available datasets
- Fix errors or update links

---

## License

This repository contains metadata and links only. Please refer to individual model and dataset licenses for usage terms.
