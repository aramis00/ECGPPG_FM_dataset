// Data
const MODELS = [
  {
    "model": "ECG-JEPA",
    "title": "Learning general representation of 12-lead electrocardiogram with a joint-embedding predictive architecture",
    "doi": "https://doi.org/10.48550/arXiv.2410.08559 ",
    "citation": "{RN1,\n   author = {Kim, Sehun},\n   title = {Learning general representation of 12-lead electrocardiogram with a joint-embedding predictive architecture},\n   journal = {arXiv preprint arXiv:2410.08559},\n   DOI = {https://doi.org/10.48550/arXiv.2410.08559},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multiclass/ multilabel  classification (5 Dx. class, PTB-XL; 9 ecg Dx., CPSC 2018)\n\u2022 ECG feature extraction",
    "performance": "\u2022 Multilabel classification, AUROC ~0.91(PTB-XL)",
    "Year": 2024,
    "Backbone": "Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "M/R/G",
    "Pretrain Dataset": "CSN, Code-15",
    "ECGs (n)": "180K",
    "Codelink": "https://github.com/sehunfromdaegu/ecg_jepa",
    "Weightlink": "https://github.com/sehunfromdaegu/ecg_jepa",
    "eval_data": "PTB-XL, CPSC2018",
    "ECGlead": 8,
    "sampling_rate": 250.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 1,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Training time, hardware",
    "eval_explainability": 0,
    "ecgs_numeric": 180000.0
  },
  {
    "model": "HuBERT-ECG",
    "title": "HuBERT-ECG as a self-supervised foundation model for broad and scalable cardiac applications",
    "doi": "https://doi.org/10.1101/2024.11.14.24317328",
    "citation": "{RN2,\n   author = {Coppola, Edoardo and Savardi, Mattia and Massussi, Mauro and Adamo, Marianna and Metra, Marco and Signoroni, Alberto},\n   title = {HuBERT-ECG as a self-supervised foundation model for broad and scalable cardiac applications},\n   journal = {medRxiv},\n   pages = {2024.11. 14.24317328},\n   DOI = {https://doi.org/10.1101/2024.11.14.24317328},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification (164 harmonized Dx.)\n\u2022 Prognostic prediction (mortality)",
    "performance": "\u2022 Multilabel diagnosis: macro AUROC 0.85 for 164 conditions (Combined dataset)",
    "Year": 2024,
    "Backbone": "CNN+Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "CODE, CPSC, CPSC-Extra, PTB, PTB-XL, Georgia, CSN, Tianchi, MIMIC-IV, SPH",
    "ECGs (n)": "9.1M",
    "Codelink": "https://github.com/Edoar-do/HuBERT-ECG",
    "Weightlink": "https://huggingface.co/Edoardo-BS",
    "eval_data": "CODE, CPSC, CPSC-Extra, PTB, PTB-XL, Georgia, CSN, Tianchi, SPH, SaMi-Trop",
    "ECGlead": 12,
    "sampling_rate": 100.0,
    "eval_LP": 0,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware, training time proxy: No. of steps per dataset",
    "eval_explainability": "saliency map",
    "ecgs_numeric": 9100000.0
  },
  {
    "model": "DeepECG",
    "title": "Foundation models for electrocardiogram interpretation: clinical implications",
    "doi": "https://doi.org/10.1093/eurheartj/ehaf1119",
    "citation": "{RN3,\n   author = {Nolin-Lapalme, Alexis and Sowa, Achille and Delfrate, Jacques and Tastet, Olivier and Corbin, Denis and Kulbay, Merve and Ozdemir, Derman and No\u00ebl, Marie-Jeanne and Marois-Blanchet, Fran\u00e7ois-Christophe and Harvey, Fran\u00e7ois and Sharma, Surbhi and Ansari, Minhaj and Chiu, I Min and D'souza, Valentina and Friedman, Sam F. and Chass\u00e9, Micha\u00ebl and Potter, Brian J. and Afilalo, Jonathan and Elias, Pierre Adil and Jabbour, Gilbert and Bahani, Mourad and Dub\u00e9, Marie-Pierre and Boyle, Patrick M. and Chatterjee, Neal A. and Barrios, Joshua and Tison, Geoffrey H. and Ouyang, David and Maddah, Mahnaz and Khurshid, Shaan and Cadrin-Tourigny, Julia and Tadros, Rafik and Hussin, Julie and Avram, Robert},\n   title = {Foundation models for electrocardiogram interpretation: clinical implications},\n   journal = {European Heart Journal},\n   pages = {ehaf1119},\n   DOI = {10.1093/eurheartj/ehaf1119},\n   year = {2026},\n   note = {Online ahead of print},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification (77 Dx.)\n\u2022 Clinical assessment (LVEF category, pericarditis, LQTS subtype)\n\u2022 Prognostic prediction (5-Year incident Afib (iAF5)) \t",
    "performance": "\u2022 Multilabel classification: AUROC 0.98 (external)\n\u2022 iAF5 prediction: AUROC 0.74 (MHI-ds)\n\u2022 LVEF\u226440% prediction: AUROC 0.92 ",
    "Year": 2025,
    "Backbone": "CNN+Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "MIMIC-IV-ECG, Code-15, MHI-ds*",
    "ECGs (n)": "1.9M",
    "Codelink": "https://github.com/HeartWise-AI/DeepECG_Docker",
    "Weightlink": "https://huggingface.co/heartwise/SSL_Pretrained_model/tree/main",
    "eval_data": "MIMIC-IV-test, PTB, CLSA, UKB, UCSF*, MGH*, CSH*, JGH*, UW*, NYP*, CHUM*",
    "ECGlead": 12,
    "sampling_rate": null,
    "eval_LP": 0,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 0,
    "eval_fairness": 1,
    "eval_privacy": 1,
    "eval_compute": "Hardware, CO2 emission, training time",
    "eval_explainability": "lime",
    "ecgs_numeric": 1900000.0
  },
  {
    "model": "ECG-FM",
    "title": "Ecg-fm: An open electrocardiogram foundation model",
    "doi": "https://doi.org/10.1093/jamiaopen/ooaf122",
    "citation": "{RN4,\n   author = {McKeen, Kaden and Oliva, Laura and Masood, Sameer and Toma, Augustin and Rubin, Barry and Wang, Bo},\n   title = {Ecg-fm: An open electrocardiogram foundation model},\n   journal = {JAMIA open},\n   volume = {8},\n   number = {5},\n   pages = {ooaf122},\n   ISSN = {2574-2531},\n   DOI = {https://doi.org/10.1093/jamiaopen/ooaf122},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification (17~21 Dx.)\n\u2022 Clinical assessment (acute coronary syndrome, LVEF category)",
    "performance": "\u2022 Multilabel classification: AUROC >0.99 in 12 condition (UHN-ECG)\n\u2022 LVEF\u226440% prediction: AUROC 0.93 (UHN-ECG)",
    "Year": 2024,
    "Backbone": "CNN+Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "CPSC, CPSC-Extra, PTB-XL, Georgia, CSN, MIMIC-IV-ECG",
    "ECGs (n)": "870K",
    "Codelink": "https://github.com/bowang-lab/ECG-FM/",
    "Weightlink": "https://huggingface.co/wanglab/ecg-fm",
    "eval_data": "UHN-ECG*,UHN-ECG*, MIMIC-IV, MEDIC*(Meng et al.)",
    "ECGlead": 12,
    "sampling_rate": 500.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 0,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware,\u00a0\u00a0training time",
    "eval_explainability": "saliency map",
    "ecgs_numeric": 870000.0
  },
  {
    "model": "HeartLang",
    "title": "Reading your heart: Learning ecg words and sentences via pre-training ecg language model",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2502.10707",
    "citation": "{RN5,\n   author = {Jin, Jiarui and Wang, Haoyu and Li, Hongyan and Li, Jun and Pan, Jiahui and Hong, Shenda},\n   title = {Reading your heart: Learning ecg words and sentences via pre-training ecg language model},\n   journal = {arXiv preprint arXiv:2502.10707},\n   DOI = {https://doi.org/10.48550/arXiv.2502.10707},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multiclass classification (5~38 Dx.)",
    "performance": "\u2022 Multiclass classification: \nMacro AUROC 0.90 (PTB-XL, Rhythm)",
    "Year": 2025,
    "Backbone": "Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "MIMIC-IV-ECG",
    "ECGs (n)": "800K",
    "Codelink": "https://github.com/PKUDigitalHealth/HeartLang",
    "Weightlink": "https://huggingface.co/PKUDigitalHealth/HeartLang/",
    "eval_data": "PTB-XL, CPSC2018, CSN",
    "ECGlead": 12,
    "sampling_rate": 100.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 1,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": "Textual; ECG vocab visualization",
    "ecgs_numeric": 800000.0
  },
  {
    "model": "CPC",
    "title": "Benchmarking ECG Foundational Models: A Reality Check Across Clinical Tasks",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2509.25095",
    "citation": "{RN10,\n   author = {Al-Masud, MA and Alcaraz, Juan Miguel Lopez and Strodthoff, Nils},\n   title = {Benchmarking ECG Foundational Models: A Reality Check Across Clinical Tasks},\n   journal = {arXiv preprint arXiv:2509.25095},\n   DOI = {https://doi.org/10.48550/arXiv.2509.25095},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification (adult, pediatric)\n\u2022 Prognostic prediction (acute care, cardiac/noncardiac outcome)\n\u2022 Clinical assessment (age, gender, biometric, ecg features, lab values, vital signs, echo structure/function)",
    "performance": "\u2022 Macro AUROC of adult ECG interpretation of finetuned model are outperforms supervised baseline, rank at the top among other FMs\n\u2022 Best overall performance compared to othe FM and supervised baseline in echo diagnosis, cardiac and noncardiac prediction. ",
    "Year": 2025,
    "Backbone": "CNN+SSM",
    "Pretrain modality": "ecg",
    "Pretrain Method": "CL",
    "Pretrain Dataset": "HEED",
    "ECGs (n)": "10.7M",
    "Codelink": "https://github.com/AI4HealthUOL/ecg-fm-benchmarking",
    "Weightlink": "https://figshare.com/articles/dataset/ECG-CPC_Checkpoint_zip/30192604?file=58173919",
    "eval_data": "PTB, PTB-XL, Ningbo, CPSC2018, CPSC-Extra, Veorgia, Chapman, SPH, CODE-15%, ZZU, EchoNext, MIMIC",
    "ECGlead": 12,
    "sampling_rate": 240.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 0,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware,\u00a0\u00a0training time",
    "eval_explainability": 0,
    "ecgs_numeric": 10700000.0
  },
  {
    "model": "ESI",
    "title": "Ecg semantic integrator (esi): A foundation ecg model pretrained with llm-enhanced cardiological text",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2405.19366",
    "citation": "{RN6,\n   author = {Yu, Han and Guo, Peikun and Sano, Akane},\n   title = {Ecg semantic integrator (esi): A foundation ecg model pretrained with llm-enhanced cardiological text},\n   journal = {arXiv preprint arXiv:2405.19366},\n   DOI = {https://doi.org/10.48550/arXiv.2405.19366},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multiclass classification (Rhythm focused)\n\u2022 Zero-shot capability\n\u2022 Biometric task (individual identification)",
    "performance": "\u2022 Arrhythmia detection: AUROC 0.94 (PTB-XL, FT), 0.98 (CPSC2018, FT)",
    "Year": 2024,
    "Backbone": "CNN+Text",
    "Pretrain modality": "ecg+text",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "PTB-XL, CSN, MIMIC-IV-ECG",
    "ECGs (n)": "660K",
    "Codelink": "https://github.com/comp-well-org/ESI",
    "Weightlink": "https://drive.google.com/drive/folders/1I3ECWBEm-Yxhzl1xgx5JE-tEhDRDtN0o",
    "eval_data": "PTB-XL, CPSC2018",
    "ECGlead": 12,
    "sampling_rate": 500.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": 1,
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": 660000.0
  },
  {
    "model": "MERL",
    "title": "Zero-shot ecg classification with multimodal learning and test-time clinical knowledge enhancement",
    "doi": "https://doi.org/10.48550/arXiv.2403.06659",
    "citation": "{RN7,\n   author = {Liu, Che and Wan, Zhongwei and Ouyang, Cheng and Shah, Anand and Bai, Wenjia and Arcucci, Rossella},\n   title = {Zero-shot ecg classification with multimodal learning and test-time clinical knowledge enhancement},\n   journal = {arXiv preprint arXiv:2403.06659},\n   DOI = {https://doi.org/10.48550/arXiv.2403.06659},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification \n\u2022 Zero-shot capability",
    "performance": "\u2022 Zero-shot classification:\nAUROC 0.75 (average), 0.88 (PTB-XL)",
    "Year": 2024,
    "Backbone": "CNN+Text",
    "Pretrain modality": "ecg+text",
    "Pretrain Method": "CL",
    "Pretrain Dataset": "MIMIC-IV-ECG",
    "ECGs (n)": "771K",
    "Codelink": "https://github.com/cheliu-computation/MERL-ICML2024",
    "Weightlink": "https://drive.google.com/drive/folders/13wb4DppUciMn-Y_qC2JRWTbZdz3xX0w2",
    "eval_data": "PTB-XL, CPSC2018, CSN",
    "ECGlead": 12,
    "sampling_rate": 500.0,
    "eval_LP": 1,
    "eval_FT": 0,
    "eval_zeroshot": 1,
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": 771000.0
  },
  {
    "model": "MELP",
    "title": "From Token to Rhythm: A Multi-Scale Approach for ECG-Language Pretraining",
    "doi": "https://doi.org/10.48550/arXiv.2506.21803",
    "citation": "{RN8,\n   author = {Wang, Fuying and Xu, Jiacheng and Yu, Lequan},\n   title = {From Token to Rhythm: A Multi-Scale Approach for ECG-Language Pretraining},\n   journal = {arXiv preprint arXiv:2506.21803},\n   DOI = {https://doi.org/10.48550/arXiv.2506.21803},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification \n\u2022 Zero-shot capability\n\u2022 Report generation",
    "performance": "\u2022 Zero-shot classification:\nAUROC 0.79 (average)",
    "Year": 2025,
    "Backbone": "CNN+Text",
    "Pretrain modality": "ecg+text",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "MIMIC-IV-ECG",
    "ECGs (n)": "760K",
    "Codelink": "https://github.com/HKU-MedAI/MELP",
    "Weightlink": "https://huggingface.co/fuyingw/MELP_Encoder",
    "eval_data": "PTB-XL, CPSC2018, CSN",
    "ECGlead": 12,
    "sampling_rate": 500.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": 1,
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": 760000.0
  },
  {
    "model": "KED",
    "title": "Foundation model of ECG diagnosis: Diagnostics and explanations of any form and rhythm on ECG",
    "doi": "https://doi.org/10.1016/j.xcrm.2024.101875",
    "citation": "{RN9,\n   author = {Tian, Yuanyuan and Li, Zhiyuan and Jin, Yanrui and Wang, Mengxiao and Wei, Xiaoyang and Zhao, Liqun and Liu, Yunqing and Liu, Jinlei and Liu, Chengliang},\n   title = {Foundation model of ECG diagnosis: Diagnostics and explanations of any form and rhythm on ECG},\n   journal = {Cell Reports Medicine},\n   volume = {5},\n   number = {12},\n   ISSN = {2666-3791},\n   DOI = {https://doi.org/10.1016/j.xcrm.2024.101875},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification\n\u2022 Zero-shot capability",
    "performance": "\u2022 Zero-shot classification:\nAUROC >0.90 for 6 tasks\n\u2022 Zero-shot on 7 common ECG diagnosis comparable to cardiologists ",
    "Year": 2024,
    "Backbone": "CNN+Text",
    "Pretrain modality": "ecg+text",
    "Pretrain Method": "CL+M/R/G",
    "Pretrain Dataset": "MIMIC-IV-ECG",
    "ECGs (n)": "800K",
    "Codelink": "https://github.com/control-spiderman/ECGFM-KED/",
    "Weightlink": "https://zenodo.org/records/14881564",
    "eval_data": "CPSC2018, CSN, Georgia, PTB-XL, SFPH*",
    "ECGlead": 12,
    "sampling_rate": 100.0,
    "eval_LP": 0,
    "eval_FT": 1,
    "eval_zeroshot": 1,
    "eval_data_efficiency": 1,
    "eval_reduced_lead": 0,
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": 800000.0
  },
  {
    "model": "ECGFounder",
    "title": "An Electrocardiogram Foundation Model Built on over 10 Million Recordings",
    "doi": "https://doi.org/10.1056/AIoa2401033",
    "citation": "{RN11,\n   author = {Li, Jun and Aguirre, Aaron D. and Junior, Valdery Moura and Jin, Jiarui and Liu, Che and Zhong, Lanhai and Sun, Chenxi and Clifford, Gari and Brandon Westover, M. and Hong, Shenda},\n   title = {An Electrocardiogram Foundation Model Built on over 10 Million Recordings},\n   journal = {Nejm Ai},\n   volume = {2},\n   number = {7},\n   ISSN = {2836-9386},\n   DOI = {10.1056/AIoa2401033},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Multilabel classification (150 diagnoses)\n\u2022 Clinical assessment (age, gender, CKD, CHD, LVEF category, NT-proBNP)\n\u2022 Single-lead analysis \n\u2022 Afib detection from PPG",
    "performance": "\u2022 AUROC \u2265 0.95 in 82 out of 150 diagnostic label (internal test)\n\u2022 For single-lead analysis,\nAUROC >0.95 for rhythm abnormalities, >0.80 for others (internal test)",
    "Year": 2024,
    "Backbone": "CNN",
    "Pretrain modality": "ecg+text (SL)",
    "Pretrain Method": "SL (multilabel)",
    "Pretrain Dataset": "HEED",
    "ECGs (n)": "10.7M",
    "Codelink": "https://github.com/PKUDigitalHealth/ECGFounder",
    "Weightlink": "PKUDigitalHealth/ECGFounder",
    "eval_data": "HEED, CODE-test, PTB-XL, PhysioNet Challenge 2017, MIMIC-IV-ECG",
    "ECGlead": 12,
    "sampling_rate": 500.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 0,
    "eval_reduced_lead": 1,
    "eval_ablation": 1,
    "eval_fairness": 1,
    "eval_privacy": 0,
    "eval_compute": 0,
    "eval_explainability": 0,
    "ecgs_numeric": 10700000.0
  },
  {
    "model": "ECG-PT",
    "title": "Interpretable Pre-Trained Transformers for Heart Time-Series Data",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2407.20775",
    "citation": "{RN12,\n   author = {Davies, Harry J and Monsen, James and Mandic, Danilo P},\n   title = {Interpretable pre-trained transformers for heart time-series data},\n   journal = {arXiv preprint arXiv:2407.20775},\n   DOI = {https://doi.org/10.48550/arXiv.2407.20775},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Cardiovascular (Afib classification \n\u2022 Generative model evaluation",
    "performance": "\u2022 Afib detection: AUROC 0.99 ",
    "Year": 2024,
    "Backbone": "Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "M/R/G",
    "Pretrain Dataset": "PhysioNet CinC 2020",
    "ECGs (n)": "42M tokens",
    "Codelink": "https://github.com/harryjdavies/HeartGPT",
    "Weightlink": "https://github.com/harryjdavies/HeartGPT/tree/main/Model_files",
    "eval_data": "MIMIC PERform, Bed-based ballistocardiography dataset",
    "ECGlead": 1,
    "sampling_rate": 100.0,
    "eval_LP": 0,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 0,
    "eval_reduced_lead": "na",
    "eval_ablation": 0,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware,  training time, finetuning time",
    "eval_explainability": "Attention based interpretability",
    "ecgs_numeric": null
  },
  {
    "model": "PPG-PT",
    "title": "Interpretable Pre-Trained Transformers for Heart Time-Series Data",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2407.20775",
    "citation": "{RN12,\n   author = {Davies, Harry J and Monsen, James and Mandic, Danilo P},\n   title = {Interpretable pre-trained transformers for heart time-series data},\n   journal = {arXiv preprint arXiv:2407.20775},\n   DOI = {https://doi.org/10.48550/arXiv.2407.20775},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Cardiovascular (Afib classification \nheart beat detection)\n\u2022 Generative model evaluation",
    "performance": "\u2022 Afib detection: AUROC 0.93 \n\u2022 PPG beat detection: F1 0.98 ",
    "Year": 2024,
    "Backbone": "Transformer",
    "Pretrain modality": "ppg ",
    "Pretrain Method": "M/R/G",
    "Pretrain Dataset": "Capnobase/BIDMC/Cuffless BP ",
    "ECGs (n)": "128M tokens",
    "Codelink": "https://github.com/harryjdavies/HeartGPT",
    "Weightlink": "https://github.com/harryjdavies/HeartGPT/tree/main/Model_files",
    "eval_data": "MIMIC PERform, Bed-based ballistocardiography dataset",
    "ECGlead": "na",
    "sampling_rate": 50.0,
    "eval_LP": 0,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 0,
    "eval_reduced_lead": "na",
    "eval_ablation": 0,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware,  training time, finetuning time",
    "eval_explainability": "Attention based interpretability",
    "ecgs_numeric": null
  },
  {
    "model": "HeartBERT",
    "title": "HeartBERT: A Self-Supervised ECG Embedding Model for Efficient and Effective Medical Signal Analysis",
    "doi": "https://doi.org/10.48550/arXiv.2411.11896",
    "citation": "{RN13,\n   author = {Tahery, Saedeh and Akhlaghi, Fatemeh Hamid and Amirsoleimani, Termeh},\n   title = {HeartBERT: A Self-Supervised ECG Embedding Model for Efficient and Effective Medical Signal Analysis},\n   journal = {arXiv preprint arXiv:2411.11896},\n   DOI = {https://doi.org/10.48550/arXiv.2411.11896},\n   year = {2024},\n   type = {Journal Article}\n}",
    "task": "\u2022 Cardiovascular (Heart beat classification)\n\u2022 Sleep-related (sleep stage classification)",
    "performance": "\t\u2022 Sleep-stage classification:\nF1 0.75 (3-stage), F1 0.62 (5-stage)\n\u2022 Heartbeat classification:\nF1 0.89 (half frozen model)",
    "Year": 2024,
    "Backbone": "Transformer",
    "Pretrain modality": "ecg",
    "Pretrain Method": "M/R/G",
    "Pretrain Dataset": "MIT-BIH, PTB-XL, European ST-T",
    "ECGs (n)": "72M tokens",
    "Codelink": "https://github.com/ecgResearch/HeartBert",
    "Weightlink": "https://drive.google.com/drive/folders/10flbRia9rDWeS8-TLScRUT6JBv81iN-4",
    "eval_data": "MIT-BIH Polysomnographic Database, Icentia11k ",
    "ECGlead": 1,
    "sampling_rate": 360.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 0,
    "eval_reduced_lead": "na",
    "eval_ablation": 0,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": null
  },
  {
    "model": "PaPaGei-S/-P",
    "title": "PaPaGei: Open Foundation Models for Optical Physiological Signals",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2410.20542",
    "citation": "{RN14,\n   author = {Pillai, Arvind and Spathis, Dimitris and Kawsar, Fahim and Malekzadeh, Mohammad},\n   title = {PaPaGei: Open Foundation Models for Optical Physiological Signals},\n   journal = {arXiv preprint arXiv:2410.20542},\n   pages = {28},\n   keywords = {Computer Science - Learning},\n   DOI = {10.48550/arXiv.2410.20542},\n   url = {http://arxiv.org/pdf/2410.20542v1\nhttps://arxiv.org/pdf/2410.20542v1.pdf\nhttp://arxiv.org/abs/2410.20542v1},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Cardiovascular (BP, heart rate estimation, hypertension)\n\u2022 Sleep-related (AHI, sleep disturbance)\n\u2022 Pregnancy monitoring (gestational age, pregnancy stage)\n\u2022 Emotional and activity monitoring\n\u2022 Prognostic/ risk prediction (ICU mortality, admission)\t",
    "performance": "\u2022 Classification: average AUROC 0.67 across 9 tasks \n\u2022 Regression: average MAE 10.1 across 9 tasks\n(SBP MAE 13~14, average HR MAE 3.5, HR MAE 11.5)",
    "Year": 2024,
    "Backbone": "Transformer",
    "Pretrain modality": "ppg ",
    "Pretrain Method": "CL",
    "Pretrain Dataset": "VitalDB, MIMIC-III waveform, MESA sleep",
    "ECGs (n)": "57K hours",
    "Codelink": "https://github.com/Nokia-Bell-Labs/papagei-foundation-model",
    "Weightlink": "https://zenodo.org/records/13983110",
    "eval_data": "nuMom2B, VV, PPH-BP, SDB, ECSMP, WESAD, PPG-DaLiA",
    "ECGlead": "na",
    "sampling_rate": 125.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 1,
    "eval_reduced_lead": "na",
    "eval_ablation": 1,
    "eval_fairness": 1,
    "eval_privacy": 0,
    "eval_compute": "Hardware",
    "eval_explainability": 0,
    "ecgs_numeric": null
  },
  {
    "model": "PulsePPG",
    "title": "Pulse-PPG: An Open-Source Field-Trained PPG Foundation Model for Wearable Applications Across Lab and Field Settings",
    "doi": "\nhttps://doi.org/10.48550/arXiv.2502.01108",
    "citation": "{RN15,\n   author = {Saha, Mithun and Xu, Maxwell A and Mao, Wanting and Neupane, Sameer and Rehg, James M and Kumar, Santosh},\n   title = {Pulse-ppg: An open-source field-trained ppg foundation model for wearable applications across lab and field settings},\n   journal = {Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies},\n   volume = {9},\n   number = {3},\n   pages = {1-35},\n   ISSN = {2474-9567},\n   DOI = {https://doi.org/10.48550/arXiv.2502.01108},\n   year = {2025},\n   type = {Journal Article}\n}\n",
    "task": "\u2022 Cardiovascular (BP, heart rate, hypertension)\n\u2022 Sleep, stress, activity classification \n\u2022 Prognostic/ risk prediction (ICU mortality, admission)\t",
    "performance": "\u2022 Outperform PaPaGei for 10/11 (6/7 classification, 4/4 regression) tasks at linear probing ",
    "Year": 2025,
    "Backbone": "CNN",
    "Pretrain modality": "ppg ",
    "Pretrain Method": "CL",
    "Pretrain Dataset": "MOODS",
    "ECGs (n)": "55K hours",
    "Codelink": "https://github.com/maxxu05/pulseppg",
    "Weightlink": "https://zenodo.org/records/17345536",
    "eval_data": "MIMIC III/IV, UQVS, WESAD, PPG-DaLiA",
    "ECGlead": "na",
    "sampling_rate": 50.0,
    "eval_LP": 1,
    "eval_FT": 1,
    "eval_zeroshot": "na",
    "eval_data_efficiency": 0,
    "eval_reduced_lead": "na",
    "eval_ablation": 1,
    "eval_fairness": 0,
    "eval_privacy": 0,
    "eval_compute": "Hardware,  training time",
    "eval_explainability": 0,
    "ecgs_numeric": null
  }
];

const DATASETS_12LEAD = [
  {
    "Dataset": "HEED",
    "Record": "11.7 M",
    "Patient (n)": "2.1 M",
    "Year": "1980s ~ ongoing",
    "site": 1,
    "Country": "US",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": "250, 500",
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, death, race, ethnicity, marital status, religion, language, veteran status, gender, cause of death, education level, ICD-9/10 Dx. codes",
    "ECG label": "ECG Dx. (Marquette 12SL codes, human-readable 12SL report), measurements (HR, PR, QRSD, QT, QTc, Pax, Rax, Tax)",
    "Data type": "wfdb",
    "Access": "C",
    "dataset_link": "https://bdsp.io/content/heedb/4.0/",
    "citation": "{RN66,\n   author = {Koscova, Zuzana and Li, Qiao and Robichaux, Chad and Moura Junior, Valdery and Ghanta, Manohar and Gupta, Aditya and Rosand, Jonathan and Aguirre, Aaron and Hong, Shenda and Albert, David E},\n   title = {The Harvard-Emory ECG Database},\n   journal = {medRxiv},\n   pages = {2024.09. 27.24314503},\n   DOI = {10.1101/2024.09.27.24314503},\n   url = {https://doi.org/10.1101/2024.09.27.24314503},\n   year = {2024},\n   type = {Journal Article}\n}\n",
    "related_dataset": null,
    "records_numeric": 11700000,
    "patients_numeric": 2100000
  },
  {
    "Dataset": "CODE",
    "Record": "2.3 M\u00a0(346 K CODE-15%) ",
    "Patient (n)": "1.7 M(234 K CODE-15%)",
    "Year": "2010-2016",
    "site": "multi",
    "Country": "Brazil",
    "Setting ": "Tele-health setting",
    "Sample rate (Hz)": 400,
    "Time (sec)": "7~10",
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender",
    "ECG label": "1dAVb, RBBB, LBBB, sinus bradycardia, AFib, sinus tachycardia, normal_ecg, death, follow up time",
    "Data type": "hdf5",
    "Access": "R (CODE 15%, O; CODE-test, O)",
    "dataset_link": "https://doi.org/10.17044/scilifelab.15169716",
    "citation": "{RN67,\n   author = {Ribeiro, A. H. and Ribeiro, M. H. and Paixao, G. M. M. and Oliveira, D. M. and Gomes, P. R. and Canazart, J. A. and Ferreira, M. P. S. and Andersson, C. R. and Macfarlane, P. W. and Meira, W., Jr. and Schon, T. B. and Ribeiro, A. L. P.},\n   title = {Automatic diagnosis of the 12-lead ECG using a deep neural network},\n   journal = {Nat Commun},\n   volume = {11},\n   number = {1},\n   pages = {1760},\n   keywords = {Adolescent\nAdult\nAged\nAged, 80 and over\nAtrial Fibrillation/*diagnosis/physiopathology\nCardiology/*methods\n*Deep Learning\n*Electrocardiography\nHumans\nMiddle Aged\n*Neural Networks, Computer\nReproducibility of Results\nSensitivity and Specificity\nYoung Adult},\n   ISSN = {2041-1723 (Electronic)\n2041-1723 (Linking)},\n   DOI = {10.1038/s41467-020-15432-4},\n   url = {https://doi.org/10.1038/s41467-020-15432-4},\n   year = {2020},\n   type = {Journal Article}\n}\n",
    "related_dataset": "CODE-15%",
    "records_numeric": 2300000,
    "patients_numeric": 1700000
  },
  {
    "Dataset": "MIMIC-IV ECG",
    "Record": "800 K",
    "Patient (n)": "161 K",
    "Year": "2008-2019",
    "site": 1,
    "Country": "US",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, race, language, ICD-9/10 Dx. codes, longitudinal laboratory measurements, drugs, procedures, vital signs, death during ED/ ICU admission",
    "ECG label": "machine measurements (machine generated ECG Dx., bandwidth, filtering, p/qrs/t interval and axis)",
    "Data type": "wfdb",
    "Access": "C",
    "dataset_link": "https://doi.org/10.13026/b95v-ff39",
    "citation": "{RN70,\n   author = {Gow, Brian and Pollard, Tom and Nathanson, Larry A and Johnson, Alistair and Moody, Benjamin and Fernandes, Chrystinne and Greenbaum, Nathaniel and Waks, Jonathan W and Eslami, Parastou and Carbonati, Tanner},\n   title = {Mimic-iv-ecg: Diagnostic electrocardiogram matched subset},\n   DOI = {10.13026/4nqg-sb35},\n   url = {https://doi.org/10.13026/4nqg-sb35},\n   year = {2023},\n   type = {Dataset}\n}\n",
    "related_dataset": "MIMIC-IV-ECG-Ext-ICD(https://physionet.org/content/mimic-iv-ecg-ext-icd-labels/1.0.1/), Diagnostic labels for MIMIC-IV-ECG; MEETI, Multimodal Description of MIMIC-IV-ECG with ECG Signals, Images, Feature Values and Diagnostic Texts; Symile-MIMIC(https://physionet.org/content/symile-mimic/1.0.0/), a multimodal clinical dataset of chest X-rays, electrocardiograms, and blood labs from MIMIC-IV; MIMIC-IV-Ext-MDS-ED (https://physionet.org/content/multimodal-emergency-benchmark/1.0.0/), Multimodal Decision Support in the Emergency Department - a Benchmark Dataset for Diagnoses and Deterioration Prediction in Emergency Medicine, MIMIC-IV-Ext Cardiac Disease (https://physionet.org/content/mimic-iv-ext-cardiac-disease/1.0.0/) - image, lab, culture, electrocardiogram report from cardiac disease patients",
    "records_numeric": 800000,
    "patients_numeric": 161000
  },
  {
    "Dataset": "SNUH LYDUS  167K",
    "Record": "167 K/, 50K",
    "Patient (n)": "167 K/ 50K",
    "Year": "2010-2020",
    "site": 1,
    "Country": "South Korea",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": "500 / 100",
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, ",
    "ECG label": "ECG Dx (text, machine generated,  expert reviewed), measurement (ventricular rate, atrial rate, qrs duration, pr/qt intervals, p/r/t axes)",
    "Data type": "npz",
    "Access": "R (50K, O)",
    "dataset_link": "https://khdp.net/database/data-search-detail/402/LYDUS-SNUH-ECG-160K/1.0.0",
    "citation": "{RN71,\n   author = {SNUH},\n   title = {SNUH LYDUS ECG 160K},\n   publisher = {Korea Health Data Platform},\n   url = {https://khdp.net/database/data-search-detail/402/LYDUS-SNUH-ECG-160K/1.0.0},\n   year = {2025},\n   type = {Dataset}\n}\n",
    "related_dataset": "SNUH LYDUS  50K",
    "records_numeric": 167000,
    "patients_numeric": 167000
  },
  {
    "Dataset": "IKEM",
    "Record": "98.1 K",
    "Patient (n)": "30.3 K",
    "Year": null,
    "site": 1,
    "Country": "Czech Republic",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, weight, height",
    "ECG label": "ventricular_rate, atrial_rate",
    "Data type": "hdf5",
    "Access": "O",
    "dataset_link": "https://doi.org/10.5281/zenodo.8393007",
    "citation": "{RN73,\n   author = {Sej\u00e1k, Michal and Sido, Jakub and \u017dahour, David},\n   title = {IKEM dataset v1.0.0},\n   DOI = {10.5281/zenodo.8393007},\n   url = {https://doi.org/10.5281/zenodo.8393007},\n   year = {2023},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 98100,
    "patients_numeric": 30300
  },
  {
    "Dataset": "UK Biobank",
    "Record": "91.1 K",
    "Patient (n)": "82.7 K",
    "Year": "2014~",
    "site": "multi",
    "Country": "UK",
    "Setting ": "Volunteered exams, diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, indices of deprivation, clinical, imaging, metabolomic, proteomic, genomic data, (can be linked to cancer and death registries, hospital admissions, and primary care records)",
    "ECG label": "Ventricular rate, suspicious flag raised by device, p and qrs duration, automatic Dx. comments",
    "Data type": "xml",
    "Access": "R",
    "dataset_link": "https://www.ukbiobank.ac.uk/",
    "citation": "{RN75,\n   author = {Zheng, Jianwei and Guo, Hangyuan and Chu, Huimin},\n   title = {A large scale 12-lead electrocardiogram database for arrhythmia study},\n   month = {2022},\n   DOI = {10.13026/WGEX-ER52},\n   url = {https://doi.org/10.13026/wgex-er52},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 91100,
    "patients_numeric": 82700
  },
  {
    "Dataset": "CSN",
    "Record": "45.2 K",
    "Patient (n)": "45.2 K",
    "Year": "2013-2018",
    "site": 2,
    "Country": "China",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender",
    "ECG label": "ECG Dx. (63 SNOMED CT std. - expert reviewed), ventricular rate, atrial rate, qrs duration and counts, r and t axis",
    "Data type": "wfdb",
    "Access": "O",
    "dataset_link": "https://doi.org/10.13026/wgex-er52",
    "citation": "{RN75,\n   author = {Zheng, Jianwei and Guo, Hangyuan and Chu, Huimin},\n   title = {A large scale 12-lead electrocardiogram database for arrhythmia study},\n   month = {2022},\n   DOI = {10.13026/WGEX-ER52},\n   url = {https://doi.org/10.13026/wgex-er52},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 45200,
    "patients_numeric": 45200
  },
  {
    "Dataset": "SPH",
    "Record": "25.8 K",
    "Patient (n)": "25.7 K",
    "Year": "2019-2020",
    "site": 1,
    "Country": "China",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": "10~60",
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender",
    "ECG label": "ECG Dx.(AHA std. - 11 category, 44 statement, expert reviewed)",
    "Data type": "h5",
    "Access": "O",
    "dataset_link": "https://doi.org/10.6084/m9.figshare.c.5779802.v1",
    "citation": "{RN76,\n   author = {Liu, Hui and Wang, Yinglong and Chen, Da and Zhang, Xiyu and Li, Huijie and Bian, Lipan and Shu, Minglei and Chen, Dan},\n   title = {A large-scale multi-label 12-lead electrocardiogram database with standardized diagnostic statements},\n   month = {2022/5/25},\n   DOI = {10.6084/M9.FIGSHARE.C.5779802.V1},\n   url = {https://doi.org/10.6084/m9.figshare.c.5779802.v1},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 25800,
    "patients_numeric": 25700
  },
  {
    "Dataset": "PTB-XL",
    "Record": "21.8 K",
    "Patient (n)": "18.9 K",
    "Year": "1989-1996",
    "site": "multi",
    "Country": "Germany",
    "Setting ": "Diagnostic ECG - NR-Schiller AG device use",
    "Sample rate (Hz)": "500 or 1000",
    "Time (sec)": "10-120",
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, weight, height, site, device",
    "ECG label": "ECG Dx. (SCP-ECG std. - 5 class/ 71 statements, expert annotated or machine generated; AHA std.); - PTB-XL+: added algorithm extracted ECG features, median beats, fiducial points, SNOMED-CT std.",
    "Data type": "wfdb",
    "Access": "O",
    "dataset_link": "https://doi.org/10.13026/6sec-a640",
    "citation": "{RN77,\n   author = {Wagner, Patrick and Strodthoff, Nils and Bousseljot, Ralf-Dieter and Kreiseler, Dieter and Lunze, Fatima I. and Samek, Wojciech and Schaeffter, Tobias},\n   title = {PTB-XL, a large publicly available electrocardiography dataset},\n   journal = {Sci. Data},\n   volume = {7},\n   number = {1},\n   pages = {154},\n   ISSN = {2052-4463},\n   DOI = {10.1038/s41597-020-0495-6},\n   url = {http://doi.org/10.1038/s41597-020-0495-6},\n   year = {2020},\n   type = {Journal Article}\n}\n",
    "related_dataset": "PTB-XL+ - ECG feature dataset (12SL, SNOMED) of PTB-XL",
    "records_numeric": 21800,
    "patients_numeric": 18900
  },
  {
    "Dataset": "ZZU pECG",
    "Record": "14.2 K",
    "Patient (n)": "11.6 K",
    "Year": "2018-2024",
    "site": 1,
    "Country": "China",
    "Setting ": "Hospital diagnostic ECG, pediatrics",
    "Sample rate (Hz)": 500,
    "Time (sec)": "5-120",
    "No. of leads ": "12 or 9",
    "Demographic/ clinical data": "Age, gender, ICD-10 Dx. codes",
    "ECG label": "ECG Dx.(AHA std., CHN std.; expert reviewed)",
    "Data type": "wfdb",
    "Access": "O",
    "dataset_link": "https://doi.org/10.6084/m9.figshare.27078763",
    "citation": "{RN79,\n   author = {Tan, Jian and Fan, Haoyi and Luo, Jiawei and Zhou, Yanjie and Wang, Ning and Wang, Xizheng and Liu, Guizhi and Liu, Chengyu and Wang, Zongmin},\n   title = {A pediatric ECG database with disease diagnosis covering 11643 children},\n   journal = {Scientific Data},\n   volume = {12},\n   number = {1},\n   pages = {867},\n   ISSN = {2052-4463},\n   url = {https://doi.org/10.1038/s41597-025-05225-z},\n   year = {2025},\n   type = {Journal Article}\n}",
    "related_dataset": null,
    "records_numeric": 14200,
    "patients_numeric": 11600
  },
  {
    "Dataset": "Georgia*",
    "Record": "10.3 K",
    "Patient (n)": "10.2 K",
    "Year": null,
    "site": 1,
    "Country": "US",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender",
    "ECG label": "SNOMED CT std.",
    "Data type": "wfdb",
    "Access": "O",
    "dataset_link": "https://physionet.org/content/challenge-2020/1.0.2/training/georgia/#files-panel",
    "citation": "{RN80,\n   author = {Perez Alday, Erick Andres and Gu, Annie and Shah, Amit and Liu, Chengyu and Sharma, Ashish and Seyedi, Salman and Bahrami Rad, Ali and Reyna, Matthew and Clifford, Gari},\n   title = {Classification of 12-lead ECGs: The PhysioNet/Computing in Cardiology Challenge 2020},\n   month = {2022},\n   DOI = {10.13026/DVYD-KD57},\n   url = {https://doi.org/10.13026/dvyd-kd57},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 10300,
    "patients_numeric": 10200
  },
  {
    "Dataset": "CPSC 2018, CPSC 2018 extra",
    "Record": "10.3 K",
    "Patient (n)": "9.5 K",
    "Year": null,
    "site": 11,
    "Country": "China",
    "Setting ": "Hospital diagnostic ECG",
    "Sample rate (Hz)": 500,
    "Time (sec)": "6\u201360",
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, diagnosis,",
    "ECG label": "SNOMED CT std. ",
    "Data type": "wfdb",
    "Access": "O",
    "dataset_link": "https://physionet.org/content/challenge-2020/1.0.2/training/cpsc_2018/#files-panel",
    "citation": "{RN80,\n   author = {Perez Alday, Erick Andres and Gu, Annie and Shah, Amit and Liu, Chengyu and Sharma, Ashish and Seyedi, Salman and Bahrami Rad, Ali and Reyna, Matthew and Clifford, Gari},\n   title = {Classification of 12-lead ECGs: The PhysioNet/Computing in Cardiology Challenge 2020},\n   month = {2022},\n   DOI = {10.13026/DVYD-KD57},\n   url = {https://doi.org/10.13026/dvyd-kd57},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "related_dataset": null,
    "records_numeric": 10300,
    "patients_numeric": 9500
  },
  {
    "Dataset": "SaMi-Trop",
    "Record": "2.0 K",
    "Patient (n)": "1.6 K",
    "Year": "2013-2016",
    "site": "multi",
    "Country": "Brazil",
    "Setting ": "Chagas cohort",
    "Sample rate (Hz)": 400,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, death, time to death",
    "ECG label": "ECG Dx. - normal or not ",
    "Data type": "hdf5",
    "Access": "O",
    "dataset_link": "https://doi.org/10.5281/zenodo.4905618",
    "citation": "{RN81,\n   author = {Cardoso, C. S. and Sabino, E. C. and Oliveira, C. D. and de Oliveira, L. C. and Ferreira, A. M. and Cunha-Neto, E. and Bierrenbach, A. L. and Ferreira, J. E. and Haikal, D. S. and Reingold, A. L. and Ribeiro, A. L.},\n   title = {Longitudinal study of patients with chronic Chagas cardiomyopathy in Brazil (SaMi-Trop project): a cohort profile},\n   journal = {BMJ Open},\n   volume = {6},\n   number = {5},\n   pages = {e011181},\n   keywords = {Aged\nBiomarkers/blood\nBrazil/epidemiology\nChagas Cardiomyopathy/blood/drug therapy/*epidemiology/physiopathology\nChronic Disease/drug therapy/*epidemiology\nDisease Progression\nFemale\nFollow-Up Studies\nHeart Failure/*epidemiology/physiopathology/prevention & control\nHumans\nImmunosuppressive Agents/*therapeutic use\nLongitudinal Studies\nMale\nMiddle Aged\nNatriuretic Peptide, Brain/*blood\nNitroimidazoles/*therapeutic use\nPeptide Fragments/*blood\nPopulation Surveillance\nPredictive Value of Tests\nPrognosis\nProspective Studies\nQuality of Life\nSocioeconomic Factors\nBiomarkers\nChemical pathology\nChagas disease\nCohort Studies},\n   ISSN = {2044-6055 (Electronic)\n2044-6055 (Linking)},\n   DOI = {10.1136/bmjopen-2016-011181},\n   url = {https://doi.org/10.1136/bmjopen-2016-011181},\n   year = {2016},\n   type = {Journal Article}\n}\n",
    "related_dataset": null,
    "records_numeric": 2000,
    "patients_numeric": 1600
  },
  {
    "Dataset": "Pre-/Post-STEMI ECG Database, University of Michigan",
    "Record": 266,
    "Patient (n)": 266,
    "Year": "2016-2021",
    "site": 1,
    "Country": "US",
    "Setting ": "Hospital diagnostic ECG, STEMI cohort",
    "Sample rate (Hz)": 500,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, gender, diabetes, hypertension, smoking, cerebrovascular disease, HF onset, death, death time",
    "ECG label": "ECG label - Pre-STEMI or Post-STEMI (within 1week pre- and post- event; time of ECG recorded)",
    "Data type": "csv",
    "Access": "O",
    "dataset_link": "https://doi.org/10.7302/gk9v-ka27",
    "citation": "{RN83,\n   author = {Asthana, Vishwaratn and Monovoukas, Demetri and Kucharski, Kevin and Chopra, Zoey and Perkins, Sidney and Bugga, Pallavi},\n   title = {Pre-/Post-STEMI ECG Database},\n   month = {2024},\n   DOI = {10.7302/GK9V-KA27},\n   url = {https://doi.org/10.7302/gk9v-ka27},\n   year = {2024},\n   type = {Dataset}\n}",
    "related_dataset": null,
    "records_numeric": 266,
    "patients_numeric": 266
  },
  {
    "Dataset": "EchoNext",
    "Record": "100K",
    "Patient (n)": "36.3K",
    "Year": "2018-2022",
    "site": 1,
    "Country": "US",
    "Setting ": "Hospital diagnostic ECG paired with Echo",
    "Sample rate (Hz)": 250,
    "Time (sec)": 10,
    "No. of leads ": 12,
    "Demographic/ clinical data": "Age, sex, acquisition_year, setting, race, previous ECG presence",
    "ECG label": "11 Structural heart disease labels derived from matched Echo (AR, MR, TR, PR, RV systolic function, pericardial effusion, aortic stenosis, LVEF, interventricular septum thickness, posterior wall thickness, PASP, TR Max Velocity), ECG labels - ventricular rate, atrial rate, pr/qrs/qt duration and counts, r and t axis",
    "Data type": "npy",
    "Access": "O",
    "dataset_link": "https://physionet.org/content/echonext/1.1.0/",
    "citation": "{RN84,\n   author = {Elias, Pierre and Finer, Joshua},\n   title = {Echonext: A dataset for detecting echocardiogram-confirmed structural heart disease from ecgs},\n   publisher = {PhysioNet},\n   year = {2025},\n   type = {Generic}\n}",
    "related_dataset": null,
    "records_numeric": 100000,
    "patients_numeric": 36300
  }
];

const DATASETS_REDUCED = [
  {
    "Dataset": "MIMIC-III Waveform Database",
    "Record (n)": "67.8K (MIMIC-III matched subset: 22.3K)",
    "Patient (n)": "30.0K (MIMIC-III matched subset: 10.3K)",
    "Year": "2008-2014",
    "site": 1,
    "Country": "US",
    "Setting": "ICU monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 125,
    "Time (sec)": "variable",
    "No. of ECG leads": "2~3",
    "Demographic/ clinical data": "Matched subset: Age, gender, height, weight, race, language, ICD-9/10 Dx. codes, longitudinal laboratory measurements, drugs, procedures, V/S, death during ED/ ICU admission",
    "ECG label": "No individual beat/ rhythm annotation.",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://physionet.org/content/mimic3wdb-matched/1.0/",
    "citation": "{RN85,\n   author = {Moody, Benjamin and Moody, George and Villarroel, Mauricio and Clifford, Gari and Silva, Ikaro},\n   title = {MIMIC-III Waveform Database Matched Subset},\n   month = {2020},\n   DOI = {10.13026/C2294B},\n   url = {https://doi.org/10.13026/c2294b},\n   year = {2020},\n   type = {Dataset}\n}\n",
    "derived_dataset": "MIMIC-BP (https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DBM1NF) - Curated dataset for blood pressure estimation; PulseDB (https://github.com/pulselabteam/PulseDB)- cleaned dataset based on MIMIC-III and VitalDB for benchmarking cuff-less blood pressure estimation methods",
    "records_numeric": 67800,
    "patients_numeric": 30000.0
  },
  {
    "Dataset": "WAVES",
    "Record (n)": "550K (ECG); 510K (PPG)",
    "Patient (n)": "50.4K",
    "Year": "2008-2017",
    "site": 1,
    "Country": "US",
    "Setting": "ICU monitoring, pediatric",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 125,
    "Time (sec)": "variable (mean 7 hr)",
    "No. of ECG leads": null,
    "Demographic/ clinical data": "Age, gender, monitor alarm, length of stay",
    "ECG label": "No individual beat/ rhythm annotation; other waveforms present: ABP, capnography. respiratory, CVP, etc",
    "Data type": "csv",
    "Access": "R",
    "data_link": "https://stanford.redivis.com/WAVES/datasets",
    "citation": "{RN86,\n   author = {Miller, Daniel and Dhillon, Gurpreet S. and Bambos, N. and Shin, A. and Scheinker, David},\n   title = {WAVES \u2013 the Lucile Packard children\u2019s hospital pediatric physiological waveforms dataset},\n   journal = {Sci. Data},\n   volume = {10},\n   ISSN = {2052-4463},\n   DOI = {10.1038/s41597-023-02037-x},\n   url = {http://dx.doi.org/10.1038/s41597-023-02037-x},\n   year = {2023},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 550000,
    "patients_numeric": 50400.0
  },
  {
    "Dataset": "SCOPE",
    "Record (n)": "4.5K",
    "Patient (n)": "4.5K",
    "Year": "2019-2023",
    "site": 1,
    "Country": "South Korea",
    "Setting": "ICU monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "500 (ECG); 125 (PPG)",
    "Time (sec)": "24~48 hrs (prior to event: cardiac arrest, discharge, death)",
    "No. of ECG leads": "1 (lead II)",
    "Demographic/ clinical data": "Age, gender, APACHE II, ICU type, LOS, post-ICU mortality, pre-ICU arrest, DNR status, outcome event (cardiac arrest, death, discharge)",
    "ECG label": "No individual beat/ rhythm annotation.",
    "Data type": "vital file",
    "Access": "O",
    "data_link": "https://khdp.net/database/data-search-detail/698/icu-cardiac-arrest/1.0",
    "citation": "{RN88,\n   title = {SCOPE: A survival and cardiac arrest outcome dataset with PPG and ECG waveforms from intensive care units},\n   publisher = {Korea Health Data Platform},\n   url = {https://khdp.net/database/data-search-detail/698/icu-cardiac-arrest/1.0},\n   year = {2025},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 4500,
    "patients_numeric": 4500.0
  },
  {
    "Dataset": "VitalDB",
    "Record (n)": "6.4K",
    "Patient (n)": "6.1K",
    "Year": "2016-2017",
    "site": 1,
    "Country": "South Korea",
    "Setting": "Intraoperative monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 500,
    "Time (sec)": "variable (entire time monitored in OR)",
    "No. of ECG leads": "2~3",
    "Demographic/ clinical data": "Age, gender, height, weight, surgery-related info, preoperative laboratory value, intraoperative medication data, anesthesia-related data, perioperative procedure",
    "ECG label": "No individual beat/ rhythm annotation; other waveforms present: ABP, capnography, BIS, etc.",
    "Data type": "vital file",
    "Access": "O",
    "data_link": "https://physionet.org/content/vitaldb/1.0.0/",
    "citation": "{RN89,\n   author = {Lee, Hyung-Chul and Park, Yoonsang and Yoon, Soo Bin and Yang, Seong Mi and Park, Dongnyeok and Jung, Chul-Woo},\n   title = {VitalDB, a high-fidelity multi-parameter vital signs database in surgical patients},\n   journal = {Sci. Data},\n   volume = {9},\n   number = {1},\n   pages = {279},\n   ISSN = {2052-4463},\n   DOI = {10.1038/s41597-022-01411-5},\n   url = {http://dx.doi.org/10.1038/s41597-022-01411-5},\n   year = {2022},\n   type = {Journal Article}\n}\n",
    "derived_dataset": "INSPIRE (https://physionet.org/content/inspire/1.3/) -  a publicly available research dataset for perioperative medicine (vitals, ward_vitals, labs, medications- can be linked to vitaldb through caseid),; PulseDB (https://github.com/pulselabteam/PulseDB)- cleaned dataset based on MIMIC-III and VitalDB for benchmarking cuff-less blood pressure estimation methods",
    "records_numeric": 6400,
    "patients_numeric": 6100.0
  },
  {
    "Dataset": "MOVER",
    "Record (n)": "83.5K",
    "Patient (n)": "58.8K",
    "Year": "2015-2122",
    "site": 1,
    "Country": "US",
    "Setting": "Intraoperative monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "180 or 300 (ECG); 100 (PPG)",
    "Time (sec)": "variable",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Age, gender, height, weight, surgery-related info, preoperative laboratory value, intraoperative medication data, anesthesia type, in-hospital death",
    "ECG label": "No individual beat/ rhythm annotation; other waveforms present: ABP, capnography, BIS, etc.",
    "Data type": "xml file",
    "Access": "O (currently N/A due to data revision)",
    "data_link": "https://doi.org/10.24432/C5VS5G",
    "citation": "{RN90,\n   author = {Samad, Muntaha and Angel, Mirana and Rinehart, Joseph and Kanomata, Yuzo and Baldi, Pierre and Cannesson, Maxime},\n   title = {Medical Informatics Operating Room Vitals and Events Repository (MOVER): a public-access operating room database},\n   journal = {JAMIA Open},\n   volume = {6},\n   number = {4},\n   pages = {ooad084},\n   keywords = {anesthesiology\nartificial intelligence\nelectronic medical record\nphysiology\nsurgery},\n   ISSN = {2574-2531},\n   DOI = {10.1093/jamiaopen/ooad084},\n   url = {https://doi.org/10.1093/jamiaopen/ooad084},\n   year = {2023},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 83500,
    "patients_numeric": 58800.0
  },
  {
    "Dataset": "MIT-BIH Arrhythmia",
    "Record (n)": 48,
    "Patient (n)": 47,
    "Year": "1975-1979",
    "site": 1,
    "Country": "US",
    "Setting": "Ambulatory (arrhythmia)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 360,
    "Time (sec)": "30 min",
    "No. of ECG leads": 2,
    "Demographic/ clinical data": "Age, gender, medication",
    "ECG label": "Beat & rhythm annotations (beat-to-beat, expert reviewed); signal quality labels",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://doi.org/10.13026/C2F305",
    "citation": "{RN92,\n   author = {Moody, George B. and Mark, Roger G.},\n   title = {MIT-BIH Arrhythmia Database},\n   month = {1992},\n   DOI = {10.13026/C2F305},\n   url = {https://doi.org/10.13026/C2F305},\n   year = {1992},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 48,
    "patients_numeric": 47.0
  },
  {
    "Dataset": "Long-term ST",
    "Record (n)": 86,
    "Patient (n)": 80,
    "Year": null,
    "site": "multi",
    "Country": "Slovenia, Italy",
    "Setting": "Ambulatory (ST change)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 250,
    "Time (sec)": "21~24 hr",
    "No. of ECG leads": "2~3",
    "Demographic/ clinical data": "Cardiac history, Dx., symptoms, medications, treatment",
    "ECG label": "ST changes (ischemic, axis-related non-ischemic, episodes of slow ST level drift); ECG record description",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://doi.org/10.13026/C2G01T",
    "citation": "{RN93,\n   author = {Jager, Franc and Taddei, Alessandro and Moody, George B. and Emdin, Michele and Antolic, Gorazd and Dorn, Roman and Smrdel, Ales and Marchesi, Carlo and Mark, Roger G.},\n   title = {The Long-Term ST database},\n   month = {1995},\n   DOI = {10.13026/C2G01T},\n   url = {https://doi.org/10.13026/C2G01T},\n   year = {1995},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 86,
    "patients_numeric": 80.0
  },
  {
    "Dataset": "European ST-T",
    "Record (n)": 90,
    "Patient (n)": 79,
    "Year": null,
    "site": "multi",
    "Country": "8 Europe countries",
    "Setting": "Ambulatory (ST and T change)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 250,
    "Time (sec)": "2 hr",
    "No. of ECG leads": 2,
    "Demographic/ clinical data": "Age, gender, medication",
    "ECG label": "Beat & rhythm annotations (beat-to-beat, expert annotated); signal quality labels",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://doi.org/10.13026/C2D59Z",
    "citation": "{RN94,\n   author = {Taddei, A. and Distante, G. and Emdin, M. and Pisani, P. and Moody, G. B. and Zeelenberg, C. and Marchesi, C.},\n   title = {The European ST-T database: standard for evaluating systems for the analysis of ST-T changes in ambulatory electrocardiography},\n   journal = {Eur. Heart J.},\n   volume = {13},\n   number = {9},\n   pages = {1164-1172},\n   ISSN = {0195-668X},\n   DOI = {10.1093/oxfordjournals.eurheartj.a060332},\n   url = {https://doi.org/10.1093/oxfordjournals.eurheartj.a060332},\n   year = {1992},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 90,
    "patients_numeric": 79.0
  },
  {
    "Dataset": "St Petersburg INCART",
    "Record (n)": 75,
    "Patient (n)": 32,
    "Year": null,
    "site": 1,
    "Country": "Russia",
    "Setting": "Ambulatory (arrhythmia)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 257,
    "Time (sec)": "30 min",
    "No. of ECG leads": 12,
    "Demographic/ clinical data": "Age, gender, cardiac diagnosis",
    "ECG label": "Beat annotation (human reviewed); ECG record description",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://doi.org/10.13026/C2V88N",
    "citation": "{RN96,\n   author = {Tihonenko, Viktor and Khaustov, Alexander and Ivanov, Sergey and Rivin, Alexei},\n   title = {St.-Petersburg institute of cardiological technics 12-lead arrhythmia database},\n   month = {2007},\n   DOI = {10.13026/C2V88N},\n   url = {https://doi.org/10.13026/C2V88N},\n   year = {2007},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 75,
    "patients_numeric": 32.0
  },
  {
    "Dataset": "MIT-BIH Atrial fibrillation",
    "Record (n)": 25,
    "Patient (n)": null,
    "Year": null,
    "site": 1,
    "Country": "US",
    "Setting": "Ambulatory (Afib)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 250,
    "Time (sec)": "10 hr",
    "No. of ECG leads": 2,
    "Demographic/ clinical data": null,
    "ECG label": "Beat & rhythm annotations (beat-to-beat, expert reviewed)",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://doi.org/10.13026/C2MW2D",
    "citation": "{RN97,\n   author = {Moody, George B. and Mark, Roger G.},\n   title = {MIT-BIH Atrial Fibrillation Database},\n   month = {1992},\n   DOI = {10.13026/C2MW2D},\n   url = {https://doi.org/10.13026/C2MW2D},\n   year = {1992},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 25,
    "patients_numeric": null
  },
  {
    "Dataset": "Long term AF",
    "Record (n)": 84,
    "Patient (n)": null,
    "Year": null,
    "site": 1,
    "Country": "US",
    "Setting": "Ambulatory (Afib)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 128,
    "Time (sec)": "24~25 hr",
    "No. of ECG leads": 2,
    "Demographic/ clinical data": null,
    "ECG label": "Beat & rhythm annotations (beat-to-beat, expert reviewed)",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://physionet.org/content/ltafdb/1.0.0/",
    "citation": "{RN98,\n   author = {Petrutiu, Simona and Sahakian, Alan V. and Swiryn, Steven},\n   title = {The long-term AF database},\n   month = {2003},\n   DOI = {10.13026/C2QG6Q},\n   url = {https://doi.org/10.13026/C2QG6Q},\n   year = {2003},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 84,
    "patients_numeric": null
  },
  {
    "Dataset": "IRIDIA-AF",
    "Record (n)": 167,
    "Patient (n)": "152 (all paroxysmal Afib)",
    "Year": "2006-2017",
    "site": 1,
    "Country": "Belgium",
    "Setting": "Ambulatory (Afib)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 200,
    "Time (sec)": "19~95 hr",
    "No. of ECG leads": "2 (I and II)",
    "Demographic/ clinical data": "Age, gender, record start/end",
    "ECG label": "Atrial fibrillation start/end annotation, RR interval",
    "Data type": "hdf5",
    "Access": "O",
    "data_link": "https://zenodo.org/records/8405941",
    "citation": "{RN117,\n   author = {Gilon, C\u00e9dric and Gr\u00e9goire, Jean-Marie and Mathieu, Marianne and Carlier, St\u00e9phane and Bersini, Hugues},\n   title = {IRIDIA-AF, a large paroxysmal atrial fibrillation long-term electrocardiogram monitoring database},\n   journal = {Scientific data},\n   volume = {10},\n   number = {1},\n   pages = {714},\n   ISSN = {2052-4463},\n   year = {2023},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 167,
    "patients_numeric": 152.0
  },
  {
    "Dataset": "CPSC 2021 Paroxysmal Afib",
    "Record (n)": "1.4K",
    "Patient (n)": 63,
    "Year": null,
    "site": "multi",
    "Country": null,
    "Setting": "Ambulatory (Afib)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 200,
    "Time (sec)": "variable (mean 20 min)",
    "No. of ECG leads": "12 (Holter); 3 (wearable)",
    "Demographic/ clinical data": null,
    "ECG label": "Rhythm abnormality Dx. group (non-AF, paroxysmal AF, persistent AF); beat & rhythm annotations",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://physionet.org/content/cpsc2021/1.0.0/",
    "citation": "{RN99,\n   author = {Wang, Xingyao and Ma, Caiyun and Zhang, Xiangyu and Gao, Hongxiang and Clifford, Gari and Liu, Chengyu},\n   title = {Paroxysmal atrial fibrillation events detection from dynamic ECG recordings: The 4th China Physiological Signal Challenge 2021},\n   month = {2021},\n   DOI = {10.13026/KSYA-QW89},\n   url = {https://doi.org/10.13026/ksya-qw89},\n   year = {2021},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 1400,
    "patients_numeric": 63.0
  },
  {
    "Dataset": "Icentia11k",
    "Record (n)": "54K",
    "Patient (n)": "11K",
    "Year": "2017-2018",
    "site": "multi",
    "Country": "Canada",
    "Setting": "Ambulatory (arrhythmia)",
    "PPG": 0,
    "ECG": 1,
    "Sample rate (Hz)": 250,
    "Time (sec)": "70 min",
    "No. of ECG leads": "1 (ML I)",
    "Demographic/ clinical data": null,
    "ECG label": "Beat & rhythm annotation (expert reviewed)",
    "Data type": "wfdb",
    "Access": "O",
    "data_link": "https://physionet.org/content/icentia11k-continuous-ecg/1.0/",
    "citation": "{RN100,\n   author = {Tan, Shawn and Androz, Guillaume and Chamseddine, A. and Fecteau, P. and Courville, Aaron C. and Bengio, Yoshua and Cohen, Joseph Paul},\n   title = {Icentia11K: An unsupervised representation learning dataset for arrhythmia subtype discovery},\n   journal = {arXiv preprint arXiv:1910.09570},\n   volume = {abs/1910.09570},\n   ISSN = {2331-8422},\n   url = {https://doi.org/10.48550/arXiv.1910.09570},\n   year = {2019},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 54000,
    "patients_numeric": 11000.0
  },
  {
    "Dataset": "CapnoBase",
    "Record (n)": 42,
    "Patient (n)": 42,
    "Year": null,
    "site": 1,
    "Country": "Canada",
    "Setting": "Intraoperative monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 100,
    "Time (sec)": "8 min",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": null,
    "ECG label": "ECG R peak; PPG pulse peak label (expert reviewed); other waveforms present: capnography",
    "Data type": "csv",
    "Access": "R",
    "data_link": "https://doi.org/10.5683/SP2/NLB8IT",
    "citation": "{RN102,\n   author = {Karlen, Walter},\n   title = {CapnoBase IEEE TBME Respiratory Rate Benchmark},\n   publisher = {Borealis},\n   month = {2021},\n   DOI = {10.5683/SP2/NLB8IT},\n   url = {https://doi.org/10.5683/SP2/NLB8IT},\n   year = {2021},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 42,
    "patients_numeric": 42.0
  },
  {
    "Dataset": "MESA polysomnography",
    "Record (n)": "2K",
    "Patient (n)": "2K",
    "Year": "2010-2013",
    "site": "multi",
    "Country": "US",
    "Setting": "Polysomnography monitoring",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 256,
    "Time (sec)": "variable (mean 10.6 h)",
    "No. of ECG leads": 2,
    "Demographic/ clinical data": "Age, gender, BMI, race, smoking, apnea-hypopnea index, arousal index, sleep scores and quality metrics",
    "ECG label": "Sleep stage & event annotation (respiratory event, desaturation, arousal, limb event, etc); additional waveforms: EEG, EMG",
    "Data type": "edf; xml",
    "Access": "R",
    "data_link": "https://sleepdata.org/datasets/mesa",
    "citation": "{RN104,\n   author = {National Sleep Research, Resource},\n   title = {Multi-ethnic study of atherosclerosis (MESA)},\n   publisher = {National Sleep Research Resource},\n   month = {2016},\n   DOI = {10.25822/N7HQ-C406},\n   url = {https://doi.org/10.25822/n7hq-c406},\n   year = {2016},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 2000,
    "patients_numeric": 2000.0
  },
  {
    "Dataset": "SDB",
    "Record (n)": 146,
    "Patient (n)": "146 (pediatrics: 56 SDB, 90 NonSDB)",
    "Year": null,
    "site": 1,
    "Country": "Canada",
    "Setting": "Polysomnography monitoring (pediatric)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 62.5,
    "Time (sec)": ">3 hr",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": null,
    "ECG label": "Apneas/hypopnea index (AHI); SpO2 (1 Hz)",
    "Data type": "csv",
    "Access": "O",
    "data_link": "https://doi.org/10.6084/m9.figshare.1209662",
    "citation": "{RN113,\n   author = {Garde, Ainara and Dehkordi, Parastoo and Karlen, Walter and Wensley, David and Ansermino, J Mark and Dumont, Guy A},\n   title = {Development of a screening tool for sleep disordered breathing in children using the phone Oximeter\u2122},\n   journal = {PloS one},\n   volume = {9},\n   number = {11},\n   pages = {e112959},\n   ISSN = {1932-6203},\n   url = {https://figshare.com/articles/dataset/Development_of_a_Screening_Tool_for_Sleep_Disordered_Breathing_in_Children_Using_the_Phone_Oximeter/1209662},\n   year = {2014},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 146,
    "patients_numeric": 146.0
  },
  {
    "Dataset": "NuMoM2b",
    "Record (n)": 5337,
    "Patient (n)": 3163,
    "Year": "2011-2013",
    "site": "multi",
    "Country": "US",
    "Setting": "Polysomnography monitoring (pregnancy)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "20 (ECG); 75 (PPG)",
    "Time (sec)": ">2 hr",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Age, gender (all female), race, gestational age, height, weight, BMI, visit (early 6\u201315 wks; late 22\u201331 wks gestation)",
    "ECG label": "AHI, central apnea index, hypopnea index, obstructive AHI (OAHI), HR, position, activity; additional waveforms: SpO2 (3 Hz), pulse (3 Hz), respiratory channels (nasal pressure, airflow, snore, thorax/abdomen belt)",
    "Data type": "edf; xml",
    "Access": "R",
    "data_link": "https://sleepdata.org/datasets/numom2b/",
    "citation": "{RN114,\n   author = {Facco, Francesca L and Parker, Corette B and Reddy, Uma M and Silver, Robert M and Louis, Judette M and Basner, Robert C and Chung, Judith H and Schubert, Frank P and Pien, Grace W and Redline, Susan},\n   title = {NuMoM2b Sleep-Disordered Breathing study: objectives and methods},\n   journal = {American journal of obstetrics and gynecology},\n   volume = {212},\n   number = {4},\n   pages = {542. e1-542. e127},\n   ISSN = {0002-9378},\n   year = {2015},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 5337,
    "patients_numeric": 3163.0
  },
  {
    "Dataset": "PPG-BP",
    "Record (n)": 657,
    "Patient (n)": "219 (healthy)",
    "Year": null,
    "site": 1,
    "Country": "China",
    "Setting": "Clinical lab setting, with matched BP",
    "PPG": 1,
    "ECG": 0,
    "Sample rate (Hz)": 1000,
    "Time (sec)": "2.1 sec",
    "No. of ECG leads": "na",
    "Demographic/ clinical data": "Age, gender, height, weight, cardiac disease",
    "ECG label": "SBP, DBP, HR measurements matched to PPG segment",
    "Data type": "txt",
    "Access": "O",
    "data_link": "https://doi.org/10.6084/m9.figshare.5459299.v5",
    "citation": "{RN112,\n   author = {Liang, Yongbo and Liu, Guiyong and Chen, Zhencheng and Elgendi, Mohamed},\n   title = {PPG-BP Database},\n   publisher = {figshare},\n   month = {2022/9/22},\n   DOI = {10.6084/M9.FIGSHARE.5459299.V5},\n   url = {https://doi.org/10.6084/m9.figshare.5459299.v5},\n   year = {2022},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 657,
    "patients_numeric": 219.0
  },
  {
    "Dataset": "PPG DaLiA",
    "Record (n)": 15,
    "Patient (n)": 15,
    "Year": null,
    "site": 1,
    "Country": "Germany",
    "Setting": "Wearable (daytime activity)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "700 (ECG); 64 (PPG)",
    "Time (sec)": "~2.5 hr",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Age, gender, height, weight, skin type, fitness",
    "ECG label": "Activity labels (sitting, walking, cycling, driving, table soccer, lunch, office work, stairs); heart rate label; additional waveforms: respiration, ACC, TEMP",
    "Data type": "pkl",
    "Access": "O",
    "data_link": "https://doi.org/10.24432/C53890",
    "citation": "{RN105,\n   author = {Schmidt, Attila Reiss Ina Indlekofer},\n   title = {PPG-DaLiA},\n   publisher = {UCI Machine Learning Repository},\n   month = {2019},\n   DOI = {10.24432/C53890},\n   url = {https://doi.org/10.24432/C53890},\n   year = {2019},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 15,
    "patients_numeric": 15.0
  },
  {
    "Dataset": "WESAD",
    "Record (n)": 15,
    "Patient (n)": 15,
    "Year": null,
    "site": 1,
    "Country": "Germany",
    "Setting": "Wearable (induced emotion)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "700 (ECG); 64 (PPG)",
    "Time (sec)": "2 hr",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Self-reported emotion metrics",
    "ECG label": "Emotion states; additional waveforms: respiration, ACC, TEMP, EMG",
    "Data type": "pkl",
    "Access": "O",
    "data_link": "https://doi.org/10.24432/C57K5T",
    "citation": "{RN107,\n   author = {Philip Schmidt, Attila Reiss},\n   title = {WESAD (Wearable Stress and Affect Detection)},\n   publisher = {UCI Machine Learning Repository},\n   month = {2018},\n   DOI = {10.24432/C57K5T},\n   url = {https://doi.org/10.24432/C57K5T},\n   year = {2018},\n   type = {Dataset}\n}\n",
    "derived_dataset": null,
    "records_numeric": 15,
    "patients_numeric": 15.0
  },
  {
    "Dataset": "TROIKA 115,116 (= IEEEPPG)",
    "Record (n)": 12,
    "Patient (n)": "12 (all male)",
    "Year": null,
    "site": 1,
    "Country": "China",
    "Setting": "Wearable (treadmill)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": 125,
    "Time (sec)": "5 min",
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Age, gender, height, weight, health status",
    "ECG label": "SBP, DBP; additional waveforms: ACC",
    "Data type": "mat",
    "Access": "O",
    "data_link": "https://zenodo.org/records/3902710",
    "citation": "{RN110,\n   author = {Zhang, Zhilin and Pi, Zhouyue and Liu, Benyuan},\n   title = {TROIKA: a general framework for heart rate monitoring using wrist-type photoplethysmographic signals during intensive physical exercise},\n   journal = {IEEE Trans. Biomed. Eng.},\n   volume = {62},\n   number = {2},\n   pages = {522-531},\n   ISSN = {0018-9294},\n   DOI = {10.1109/TBME.2014.2359372},\n   url = {http://doi.org/10.1109/TBME.2014.2359372},\n   year = {2015},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 12,
    "patients_numeric": 12.0
  },
  {
    "Dataset": "ECSMP",
    "Record (n)": 89,
    "Patient (n)": "89 (healthy)",
    "Year": null,
    "site": 1,
    "Country": "China",
    "Setting": "Wearable, clinical grade monitoring (induced emotion, sleep)",
    "PPG": 1,
    "ECG": 1,
    "Sample rate (Hz)": "512 (ECG holter); 64 (PPG)",
    "Time (sec)": null,
    "No. of ECG leads": 1,
    "Demographic/ clinical data": "Age, gender; sleep-related (sleep time, sleep efficiency, apnea index, apnea type), questionnaires (emotion, sleep quality, depression), Profile of Mood States (POMS?)",
    "ECG label": "Sleep stage (deep, light, REM); additional waveforms during emotion induction: BT (4 Hz), EDA (4 Hz), ACC (32 Hz), inter-beat-interval (from PPG), HR (1 Hz, from PPG), EEG (250 Hz)",
    "Data type": "csv",
    "Access": "O",
    "data_link": "https://data.mendeley.com/datasets/vn5nknh3mn/2",
    "citation": "{RN115,\n   author = {Gao, Zhilin and Cui, Xingran and Wan, Wang and Zheng, Wenming and Gu, Zhongze},\n   title = {ECSMP: A dataset on emotion, cognition, sleep, and multi-model physiological signals},\n   journal = {Data in Brief},\n   volume = {39},\n   pages = {107660},\n   ISSN = {2352-3409},\n   year = {2021},\n   type = {Journal Article}\n}\n",
    "derived_dataset": null,
    "records_numeric": 89,
    "patients_numeric": 89.0
  }
];

// Architecture data
const ARCHITECTURES = [
  { model: "ECG-JEPA", architecture: "[Transformer (student–teacher, EMA teacher, CroPA attention)] + masked representation prediction in latent space (time-synchronized patch masking across leads)" },
  { model: "HuBERT-ECG", architecture: "[Wav2Vec 2.0-style CNN + Transformer] + masked prediction of quantized latent ECG embeddings using cluster-based pseudo-labels (multi-task ensemble of clustering models, refined iteratively)" },
  { model: "DeepECG", architecture: "[CNN + Transformer (WCR)] + masked lead modeling + dual contrastive learning (SimCLR-style local + CMSC-style global) + random lead masking" },
  { model: "ECG-FM", architecture: "[CNN + Transformer (WCR)] + masked lead modeling + dual contrastive learning (SimCLR-style local + CMSC-style global) + random lead masking" },
  { model: "HeartLang", architecture: "[ST-ECGFormer Transformer] + heartbeat tokenization (QRS-based) + discrete ECG vocabulary (EMA-vector quantization) + masked token prediction (MLM)" },
  { model: "CPC", architecture: "[4-layer CNN encoder + 4-layer S4 (Structured State Space Model)] + Contrastive Predictive Coding (CPC) predicting future latent representations (14 steps ahead via InfoNCE loss)" },
  { model: "ESI", architecture: "[1D ConvNext v2 + Clinical Text Encoder] + RAG based LLM-generated expert prompts + dual contrastive loss" },
  { model: "MERL", architecture: "[1D-ResNet18+ Clinical Text Encoder (Med-CPT)] + Multi-modal contrastive pretraining + clinical knowledge enhanced prompting at test time" },
  { model: "MELP", architecture: "[Wav2Vec 2.0 + Transformer Encoder + GPT-style Text Decoder] + Multi-scale cross-modal supervision (Token + Beat + Rhythm levels) + Cardiology-specific language model pretraining" },
  { model: "KED", architecture: "[1D CNN signal encoder + Transformer label query network + BioClinicalBERT] + signal–text–label contrastive learning (AugCL, CLIP/UniCL-inspired) → knowledge-augmented, query-based multi-label ECG diagnosis" },
  { model: "ECGFounder", architecture: "[1D RegNet-based CNN (Net1D) + Bottleneck blocks + Channel-wise attention + Skip Connections] + Supervised pretraining on 10M ECGs (150 labels)" },
  { model: "ECG-PT", architecture: "[Decoder-only Transformer (GPT-style)] + Next-token prediction (cross-entropy loss) on tokenized ECG/PPG (integer-scaled windows: 5s 100 Hz, ECG; 10s 50 Hz PPG)" },
  { model: "PPG-PT", architecture: "[Decoder-only Transformer (GPT-style)] + Next-token prediction (cross-entropy loss) on tokenized ECG/PPG (integer-scaled windows: 5s 100 Hz, ECG; 10s 50 Hz PPG)" },
  { model: "HeartBERT", architecture: "[RoBERTa-based Transformer Encoder] + Lloyd–Max quantization (100-level, 360 Hz resampled ECG → ASCII 'synthetic language') + SentencePiece BPE tokenizer → MLM on discretized ECG text" },
  { model: "PaPaGei-S/-P", architecture: "[Conv front-end + BERT-style Transformer encoder] + Spectrogram patch masking + subject-level & morphology-aware contrastive SSL (MoE heads for IPA/SQI prediction)" },
  { model: "PulsePPG", architecture: "[1D ResNet-26 Encoder + Dilated CNN Cross-Attention Distance Function + PPG Motif-based Relative Ranking] + Two-Phase Self-Supervised Pretraining (Masked Reconstruction + Relative Contrastive Learning)" }
];

// Benchmark data - A100
const BENCHMARKS_A100 = [
  { Model: "hubert_ecg", Leads: 12, Params_M: 92.8, GFLOPs: 18.0, Infer_ms: 40.7, Throughput: 786, Train_ms_per_sample: 3.7, Finetune_Hours: 1.0, Infer_Mem_GB: 1.02, Train_Mem_GB: 4.05 },
  { Model: "ecgfm", Leads: 12, Params_M: 90.4, GFLOPs: 646.0, Infer_ms: 2047.9, Throughput: 16, Train_ms_per_sample: 186.5, Finetune_Hours: 51.8, Infer_Mem_GB: 5.31, Train_Mem_GB: 44.30 },
  { Model: "deepecg", Leads: 12, Params_M: 90.4, GFLOPs: 323.0, Infer_ms: 790.4, Throughput: 40, Train_ms_per_sample: 76.9, Finetune_Hours: 21.4, Infer_Mem_GB: 3.03, Train_Mem_GB: 44.30 },
  { Model: "esi", Leads: 12, Params_M: 85.6, GFLOPs: 46.8, Infer_ms: 117.4, Throughput: 273, Train_ms_per_sample: 11.8, Finetune_Hours: 3.3, Infer_Mem_GB: 1.03, Train_Mem_GB: 15.91 },
  { Model: "ecg_jepa", Leads: 8, Params_M: 85.4, GFLOPs: 45.4, Infer_ms: 172.6, Throughput: 185, Train_ms_per_sample: 15.3, Finetune_Hours: 4.3, Infer_Mem_GB: 1.66, Train_Mem_GB: 10.44 },
  { Model: "heartbert", Leads: 1, Params_M: 83.5, GFLOPs: 43.5, Infer_ms: 88.8, Throughput: 361, Train_ms_per_sample: 8.9, Finetune_Hours: 2.5, Infer_Mem_GB: 1.28, Train_Mem_GB: 6.80 },
  { Model: "melp", Leads: 12, Params_M: 62.0, GFLOPs: 27.3, Infer_ms: 82.0, Throughput: 390, Train_ms_per_sample: 7.7, Finetune_Hours: 2.1, Infer_Mem_GB: 0.92, Train_Mem_GB: 6.09 },
  { Model: "heartlang", Leads: 12, Params_M: 47.7, GFLOPs: 9.9, Infer_ms: 54.7, Throughput: 586, Train_ms_per_sample: 6.1, Finetune_Hours: 1.7, Infer_Mem_GB: 0.79, Train_Mem_GB: 4.90 },
  { Model: "ecgfounder_12lead", Leads: 12, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 14.2, Throughput: 2256, Train_ms_per_sample: 1.6, Finetune_Hours: 0.4, Infer_Mem_GB: 0.64, Train_Mem_GB: 2.46 },
  { Model: "ecgfounder_1lead", Leads: 1, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 14.3, Throughput: 2238, Train_ms_per_sample: 1.5, Finetune_Hours: 0.4, Infer_Mem_GB: 0.63, Train_Mem_GB: 2.44 },
  { Model: "pulseppg", Leads: 1, Params_M: 29.4, GFLOPs: 4.7, Infer_ms: 5.2, Throughput: 6124, Train_ms_per_sample: 0.7, Finetune_Hours: 0.2, Infer_Mem_GB: 0.58, Train_Mem_GB: 1.15 },
  { Model: "st_mem", Leads: 12, Params_M: 21.5, GFLOPs: 1.5, Infer_ms: 6.6, Throughput: 4876, Train_ms_per_sample: 1.1, Finetune_Hours: 0.3, Infer_Mem_GB: 0.50, Train_Mem_GB: 1.26 },
  { Model: "ecgfm_ked", Leads: 12, Params_M: 7.9, GFLOPs: 1.2, Infer_ms: 13.4, Throughput: 2388, Train_ms_per_sample: 1.7, Finetune_Hours: 0.5, Infer_Mem_GB: 0.47, Train_Mem_GB: 1.10 },
  { Model: "merl_vit_tiny", Leads: 12, Params_M: 5.5, GFLOPs: 0.7, Infer_ms: 6.8, Throughput: 4678, Train_ms_per_sample: 0.9, Finetune_Hours: 0.3, Infer_Mem_GB: 0.45, Train_Mem_GB: 1.04 },
  { Model: "papagei", Leads: 1, Params_M: 5.3, GFLOPs: 0.2, Infer_ms: 7.2, Throughput: 4430, Train_ms_per_sample: 1.0, Finetune_Hours: 0.3, Infer_Mem_GB: 0.43, Train_Mem_GB: 0.59 },
  { Model: "merl_resnet18", Leads: 12, Params_M: 3.8, GFLOPs: 3.5, Infer_ms: 3.3, Throughput: 9616, Train_ms_per_sample: 0.5, Finetune_Hours: 0.1, Infer_Mem_GB: 0.52, Train_Mem_GB: 1.31 },
  { Model: "s4_supervised", Leads: 12, Params_M: 2.2, GFLOPs: 1.1, Infer_ms: 5.1, Throughput: 6256, Train_ms_per_sample: 0.5, Finetune_Hours: 0.1, Infer_Mem_GB: 0.59, Train_Mem_GB: 1.14 },
  { Model: "ecg_cpc", Leads: 12, Params_M: 1.4, GFLOPs: 3.2, Infer_ms: 7.2, Throughput: 4429, Train_ms_per_sample: 0.9, Finetune_Hours: 0.3, Infer_Mem_GB: 1.27, Train_Mem_GB: 2.13 },
  { Model: "heartgpt_ppg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 19.2, Throughput: 1666, Train_ms_per_sample: 0.8, Finetune_Hours: 0.2, Infer_Mem_GB: 1.00, Train_Mem_GB: 1.05 },
  { Model: "heartgpt_ecg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 19.3, Throughput: 1658, Train_ms_per_sample: 0.9, Finetune_Hours: 0.2, Infer_Mem_GB: 1.00, Train_Mem_GB: 1.05 }
];

// Benchmark data - T4
const BENCHMARKS_T4 = [
  { Model: "hubert_ecg", Leads: 12, Params_M: 92.8, GFLOPs: 18.0, Infer_ms: 224.5, Throughput: 143, Train_ms_per_sample: 18.7, Finetune_Hours: 5.2, Infer_Mem_GB: 0.96, Train_Mem_GB: 4.05 },
  { Model: "ecgfm", Leads: 12, Params_M: 90.4, GFLOPs: 646.0, Infer_ms: 12735.2, Throughput: 3, Train_ms_per_sample: 1502.8, Finetune_Hours: 417.4, Infer_Mem_GB: 5.31, Train_Mem_GB: 12.21 },
  { Model: "deepecg", Leads: 12, Params_M: 90.4, GFLOPs: 323.0, Infer_ms: 5055.7, Throughput: 6, Train_ms_per_sample: 517.7, Finetune_Hours: 143.8, Infer_Mem_GB: 3.03, Train_Mem_GB: 12.20 },
  { Model: "esi", Leads: 12, Params_M: 85.6, GFLOPs: 46.8, Infer_ms: 620.6, Throughput: 52, Train_ms_per_sample: 58.1, Finetune_Hours: 16.1, Infer_Mem_GB: 1.03, Train_Mem_GB: 8.82 },
  { Model: "ecg_jepa", Leads: 8, Params_M: 85.4, GFLOPs: 45.4, Infer_ms: 708.0, Throughput: 45, Train_ms_per_sample: 71.9, Finetune_Hours: 20.0, Infer_Mem_GB: 1.66, Train_Mem_GB: 10.39 },
  { Model: "heartbert", Leads: 1, Params_M: 83.5, GFLOPs: 43.5, Infer_ms: 501.6, Throughput: 64, Train_ms_per_sample: 49.6, Finetune_Hours: 13.8, Infer_Mem_GB: 1.28, Train_Mem_GB: 6.72 },
  { Model: "melp", Leads: 12, Params_M: 62.0, GFLOPs: 27.3, Infer_ms: 419.4, Throughput: 76, Train_ms_per_sample: 44.3, Finetune_Hours: 12.3, Infer_Mem_GB: 0.93, Train_Mem_GB: 6.04 },
  { Model: "heartlang", Leads: 12, Params_M: 47.7, GFLOPs: 9.9, Infer_ms: 269.0, Throughput: 119, Train_ms_per_sample: 32.7, Finetune_Hours: 9.1, Infer_Mem_GB: 0.79, Train_Mem_GB: 4.87 },
  { Model: "ecgfounder_12lead", Leads: 12, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 115.5, Throughput: 277, Train_ms_per_sample: 8.9, Finetune_Hours: 2.5, Infer_Mem_GB: 0.61, Train_Mem_GB: 2.60 },
  { Model: "ecgfounder_1lead", Leads: 1, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 115.5, Throughput: 277, Train_ms_per_sample: 8.9, Finetune_Hours: 2.5, Infer_Mem_GB: 0.60, Train_Mem_GB: 2.57 },
  { Model: "pulseppg", Leads: 1, Params_M: 29.4, GFLOPs: 4.7, Infer_ms: 40.9, Throughput: 783, Train_ms_per_sample: 5.2, Finetune_Hours: 1.4, Infer_Mem_GB: 0.63, Train_Mem_GB: 1.19 },
  { Model: "st_mem", Leads: 12, Params_M: 21.5, GFLOPs: 1.5, Infer_ms: 24.9, Throughput: 1285, Train_ms_per_sample: 2.7, Finetune_Hours: 0.8, Infer_Mem_GB: 0.50, Train_Mem_GB: 1.26 },
  { Model: "ecgfm_ked", Leads: 12, Params_M: 7.9, GFLOPs: 1.2, Infer_ms: 20.4, Throughput: 1571, Train_ms_per_sample: 2.4, Finetune_Hours: 0.7, Infer_Mem_GB: 0.47, Train_Mem_GB: 1.10 },
  { Model: "merl_vit_tiny", Leads: 12, Params_M: 5.5, GFLOPs: 0.7, Infer_ms: 18.5, Throughput: 1727, Train_ms_per_sample: 2.0, Finetune_Hours: 0.5, Infer_Mem_GB: 0.45, Train_Mem_GB: 1.04 },
  { Model: "papagei", Leads: 1, Params_M: 5.3, GFLOPs: 0.2, Infer_ms: 6.3, Throughput: 5069, Train_ms_per_sample: 0.8, Finetune_Hours: 0.2, Infer_Mem_GB: 0.43, Train_Mem_GB: 0.60 },
  { Model: "merl_resnet18", Leads: 12, Params_M: 3.8, GFLOPs: 3.5, Infer_ms: 37.1, Throughput: 863, Train_ms_per_sample: 4.3, Finetune_Hours: 1.2, Infer_Mem_GB: 0.52, Train_Mem_GB: 1.29 },
  { Model: "s4_supervised", Leads: 12, Params_M: 2.2, GFLOPs: 1.1, Infer_ms: 24.5, Throughput: 1309, Train_ms_per_sample: 2.2, Finetune_Hours: 0.6, Infer_Mem_GB: 0.59, Train_Mem_GB: 1.14 },
  { Model: "ecg_cpc", Leads: 12, Params_M: 1.4, GFLOPs: 3.2, Infer_ms: 52.2, Throughput: 613, Train_ms_per_sample: 5.0, Finetune_Hours: 1.4, Infer_Mem_GB: 1.27, Train_Mem_GB: 2.13 },
  { Model: "heartgpt_ppg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 82.9, Throughput: 386, Train_ms_per_sample: 4.0, Finetune_Hours: 1.1, Infer_Mem_GB: 1.00, Train_Mem_GB: 1.05 },
  { Model: "heartgpt_ecg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 82.8, Throughput: 387, Train_ms_per_sample: 4.0, Finetune_Hours: 1.1, Infer_Mem_GB: 1.00, Train_Mem_GB: 1.05 }
];

// Benchmark data - CPU
const BENCHMARKS_CPU = [
  { Model: "hubert_ecg", Leads: 12, Params_M: 92.8, GFLOPs: 18.0, Infer_ms: 863.3, Throughput: 9, Train_ms_per_sample: 474.7, Finetune_Hours: 131.8, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecgfm", Leads: 12, Params_M: 90.4, GFLOPs: 646.0, Infer_ms: "OOM", Throughput: "OOM", Train_ms_per_sample: "OOM", Finetune_Hours: "OOM", Infer_Mem_GB: "OOM", Train_Mem_GB: "OOM" },
  { Model: "deepecg", Leads: 12, Params_M: 90.4, GFLOPs: 323.0, Infer_ms: "OOM", Throughput: "OOM", Train_ms_per_sample: "OOM", Finetune_Hours: "OOM", Infer_Mem_GB: "OOM", Train_Mem_GB: "OOM" },
  { Model: "esi", Leads: 12, Params_M: 85.6, GFLOPs: 46.8, Infer_ms: 2554.9, Throughput: 3, Train_ms_per_sample: 982.9, Finetune_Hours: 273.0, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecg_jepa", Leads: 8, Params_M: 85.4, GFLOPs: 45.4, Infer_ms: 4047.9, Throughput: 2, Train_ms_per_sample: 2432.5, Finetune_Hours: 675.7, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "heartbert", Leads: 1, Params_M: 83.5, GFLOPs: 43.5, Infer_ms: 1981.6, Throughput: 4, Train_ms_per_sample: 1159.1, Finetune_Hours: 322.0, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "melp", Leads: 12, Params_M: 62.0, GFLOPs: 27.3, Infer_ms: 2093.2, Throughput: 4, Train_ms_per_sample: 739.1, Finetune_Hours: 205.3, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "heartlang", Leads: 12, Params_M: 47.7, GFLOPs: 9.9, Infer_ms: 1163.2, Throughput: 7, Train_ms_per_sample: 707.5, Finetune_Hours: 196.5, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecgfounder_12lead", Leads: 12, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 242.4, Throughput: 33, Train_ms_per_sample: 99.1, Finetune_Hours: 27.5, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecgfounder_1lead", Leads: 1, Params_M: 30.8, GFLOPs: 2.3, Infer_ms: 206.2, Throughput: 39, Train_ms_per_sample: 103.2, Finetune_Hours: 28.7, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "pulseppg", Leads: 1, Params_M: 29.4, GFLOPs: 4.7, Infer_ms: 269.8, Throughput: 30, Train_ms_per_sample: 117.2, Finetune_Hours: 32.6, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "st_mem", Leads: 12, Params_M: 21.5, GFLOPs: 1.5, Infer_ms: 101.7, Throughput: 79, Train_ms_per_sample: 75.9, Finetune_Hours: 21.1, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecgfm_ked", Leads: 12, Params_M: 7.9, GFLOPs: 1.2, Infer_ms: 122.0, Throughput: 66, Train_ms_per_sample: 48.9, Finetune_Hours: 13.6, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "merl_vit_tiny", Leads: 12, Params_M: 5.5, GFLOPs: 0.7, Infer_ms: 97.5, Throughput: 82, Train_ms_per_sample: 63.3, Finetune_Hours: 17.6, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "papagei", Leads: 1, Params_M: 5.3, GFLOPs: 0.2, Infer_ms: 32.1, Throughput: 250, Train_ms_per_sample: 20.8, Finetune_Hours: 5.8, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "merl_resnet18", Leads: 12, Params_M: 3.8, GFLOPs: 3.5, Infer_ms: 159.9, Throughput: 50, Train_ms_per_sample: 74.9, Finetune_Hours: 20.8, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "s4_supervised", Leads: 12, Params_M: 2.2, GFLOPs: 1.1, Infer_ms: 151.9, Throughput: 53, Train_ms_per_sample: 100.1, Finetune_Hours: 27.8, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "ecg_cpc", Leads: 12, Params_M: 1.4, GFLOPs: 3.2, Infer_ms: 257.6, Throughput: 31, Train_ms_per_sample: 177.8, Finetune_Hours: 49.4, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "heartgpt_ppg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 383.6, Throughput: 21, Train_ms_per_sample: 344.0, Finetune_Hours: 95.5, Infer_Mem_GB: 0, Train_Mem_GB: 0 },
  { Model: "heartgpt_ecg", Leads: 1, Params_M: 0.4, GFLOPs: 0.3, Infer_ms: 386.4, Throughput: 21, Train_ms_per_sample: 345.4, Finetune_Hours: 96.0, Infer_Mem_GB: 0, Train_Mem_GB: 0 }
];

let currentBenchmarkData = BENCHMARKS_A100;

// Benchmark model name mappings to match MODELS data
const BENCHMARK_NAME_MAP = {
    'ecg_jepa': 'ECG-JEPA',
    'heartlang': 'HeartLang',
    'ecg_cpc': 'CPC',
    's4_supervised': 'S4 (supervised)',
    'hubert_ecg': 'HuBERT-ECG',
    'ecgfm': 'ECG-FM',
    'deepecg': 'DeepECG',
    'esi': 'ESI',
    'melp': 'MELP',
    'merl_resnet18': 'MERL (ResNet18)',
    'merl_vit_tiny': 'MERL (ViT-Tiny)',
    'ecgfm_ked': 'KED',
    'st_mem': 'ST-MEM',
    'ecgfounder_12lead': 'ECGFounder (12-lead)',
    'ecgfounder_1lead': 'ECGFounder (1-lead)',
    'heartgpt_ecg': 'ECG-PT',
    'heartgpt_ppg': 'PPG-PT',
    'heartbert': 'HeartBERT',
    'papagei': 'PaPaGei',
    'pulseppg': 'PulsePPG'
};

function getBenchmarkDisplayName(rawName) {
    return BENCHMARK_NAME_MAP[rawName] || rawName;
}

// Architecture lookup by model name
const ARCHITECTURE_MAP = {};
ARCHITECTURES.forEach(a => { ARCHITECTURE_MAP[a.model] = a.architecture; });

// Model input/output specifications from FM_computation benchmarks
const MODEL_IO_MAP = {
    'ECG-JEPA': { input: '8 leads × 2500 @ 250Hz', output_dim: 768 },
    'HeartLang': { input: '256 tokens × 96 (pre-tokenized via QRS-Tokenizer)', output_dim: 768 },
    'CPC': { input: '12 leads × 2400 @ 240Hz', output_dim: 512 },
    'S4': { input: '12 leads × 250 @ 100Hz', output_dim: 512 },
    'HuBERT-ECG': { input: '12 leads × 2500 @ 500Hz (5x decimation)', output_dim: 768 },
    'ECG-FM': { input: '12 leads × 5000 @ 500Hz', output_dim: 768 },
    'DeepECG': { input: '12 leads × 2500 @ 250Hz', output_dim: 768 },
    'ESI': { input: '12 leads × 5000 @ 500Hz', output_dim: 1024 },
    'MELP': { input: '12 leads × 5000 @ 500Hz', output_dim: 768 },
    'MERL': { input: '12 leads × 5000 @ 500Hz', output_dim: '512 (ResNet18) / 192 (ViT-Tiny)' },
    'KED': { input: '12 leads × 1000 @ 100Hz', output_dim: 768 },
    'ECGFounder': { input: '12 leads × 5000 @ 500Hz (or 1 lead)', output_dim: 1024 },
    'ST-MEM': { input: '12 leads × 2500 @ 250Hz', output_dim: 768 },
    'ECG-PT': { input: '1 lead × 500 @ 100Hz', output_dim: 64 },
    'HeartBERT': { input: '1 lead × 512 (tokenized)', output_dim: 768 },
    'PPG-PT': { input: '1 lead × 500 @ 100Hz', output_dim: 64 },
    'PaPaGei': { input: '1 lead × 1250 @ 125Hz', output_dim: 512 },
    'PulsePPG': { input: '1 lead × 1000 @ 50Hz', output_dim: 512 }
};

// Helper functions
function getModelType(model) {
    const modality = (model['Pretrain modality'] || '').toLowerCase();
    if (modality.includes('ppg')) return 'ppg';
    const leads = model.ECGlead;
    if (leads === 1 || leads === 2) return '1lead';
    return '12lead';
}

function getTypeBadge(model) {
    const type = getModelType(model);
    const labels = { '12lead': '12-Lead ECG', '1lead': 'Single-Lead', 'ppg': 'PPG' };
    return `<span class="badge badge-${type}">${labels[type]}</span>`;
}

function getAccessBadge(access) {
    if (!access) return '-';
    const a = String(access).trim();
    if (a.startsWith('O')) return `<span class="badge badge-open">${a}</span>`;
    if (a.startsWith('R')) return `<span class="badge badge-restricted">${a}</span>`;
    if (a.startsWith('C')) return `<span class="badge badge-credentialed">${a}</span>`;
    return a;
}

function createLinks(model) {
    let html = '';
    if (model.doi) html += `<a href="${model.doi}" target="_blank" class="link-btn">Paper</a>`;
    if (model.Codelink) html += `<a href="${model.Codelink}" target="_blank" class="link-btn secondary">Code</a>`;
    if (model.Weightlink) html += `<a href="${model.Weightlink}" target="_blank" class="link-btn secondary">Weights</a>`;
    return html || '-';
}

// Find models using dataset - returns { pretrain: [], eval: [] }
function findModelsUsingDataset(datasetName) {
    if (!datasetName) return { pretrain: [], eval: [] };

    const name = datasetName.toLowerCase().replace(/[-_\s]/g, '');
    const result = { pretrain: [], eval: [] };

    MODELS.forEach(m => {
        const pd = (m['Pretrain Dataset'] || '').toLowerCase().replace(/[-_\s]/g, '');
        const ed = (m['eval_data'] || '').toLowerCase().replace(/[-_\s]/g, '');

        // Simple substring match
        if (pd.includes(name) || name.includes(pd.split(',')[0])) {
            result.pretrain.push(m.model);
        }
        if (ed.includes(name) || name.includes(ed.split(',')[0])) {
            result.eval.push(m.model);
        }
    });

    return result;
}

// Legacy function for backward compatibility
function findModelsUsingDatasetLegacy(datasetName) {
    const usage = findModelsUsingDataset(datasetName);
    return [...new Set([...usage.pretrain, ...usage.eval])];
}

function createDatasetLinks(pretrainData) {
    if (!pretrainData) return '-';
    const datasets = pretrainData.split(/[,;]+/).map(d => d.trim()).filter(d => d);
    return datasets.map(dataset => {
        const cleanName = dataset.replace(/\*$/, '').trim();
        // Use data attribute instead of onclick to avoid escaping issues
        return `<span class="clickable dataset-link" data-dataset="${cleanName.replace(/"/g, '&quot;')}">${dataset}</span>`;
    }).join(', ');
}

// Populate models table
function populateModels() {
    const tbody = document.getElementById('models-tbody');
    tbody.innerHTML = '';
    
    MODELS.forEach(m => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-type', getModelType(m));
        tr.innerHTML = `
            <td><span class="clickable" onclick="showModel('${m.model}')">${m.model}</span></td>
            <td>${m.Year || '-'}</td>
            <td>${getTypeBadge(m)}</td>
            <td>${m.Backbone || '-'}</td>
            <td>${m['Pretrain Method'] || '-'}</td>
            <td>${createDatasetLinks(m['Pretrain Dataset'])}</td>
            <td data-order="${m.ecgs_numeric || 0}">${m['ECGs (n)'] || '-'}</td>
            <td>${createLinks(m)}</td>
        `;
        tbody.appendChild(tr);
    });
    
    $('#models-table').DataTable({ pageLength: 25, order: [[1, 'desc']] });
}

// Populate 12-lead datasets
function populate12Lead() {
    const tbody = document.getElementById('datasets-12lead-tbody');
    tbody.innerHTML = '';

    DATASETS_12LEAD.forEach(d => {
        const usage = findModelsUsingDataset(d.Dataset);
        const pretrainHtml = usage.pretrain.length ? usage.pretrain.map(m => `<span class="model-tag clickable" data-model="${m}">${m}</span>`).join(' ') : '-';
        const evalHtml = usage.eval.length ? usage.eval.map(m => `<span class="model-tag clickable" data-model="${m}">${m}</span>`).join(' ') : '-';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="clickable" onclick="showDataset('${d.Dataset}')">${d.Dataset}</span></td>
            <td data-order="${d.records_numeric || 0}">${d.Record || '-'}</td>
            <td data-order="${d.patients_numeric || 0}">${d['Patient (n)'] || '-'}</td>
            <td>${d.Country || '-'}</td>
            <td>${(d['Setting '] || '-').substring(0, 40)}</td>
            <td>${getAccessBadge(d.Access)}</td>
            <td>${pretrainHtml}</td>
            <td>${evalHtml}</td>
            <td>${d.dataset_link ? `<a href="${d.dataset_link}" target="_blank" class="link-btn">Access</a>` : '-'}</td>
        `;
        tbody.appendChild(tr);
    });

    $('#datasets-12lead-table').DataTable({ pageLength: 25, order: [[0, 'asc']] });
}

// Populate reduced datasets
function populateReduced() {
    const tbody = document.getElementById('datasets-reduced-tbody');
    tbody.innerHTML = '';

    DATASETS_REDUCED.forEach(d => {
        const usage = findModelsUsingDataset(d.Dataset);
        const pretrainHtml = usage.pretrain.length ? usage.pretrain.map(m => `<span class="model-tag clickable" data-model="${m}">${m}</span>`).join(' ') : '-';
        const evalHtml = usage.eval.length ? usage.eval.map(m => `<span class="model-tag clickable" data-model="${m}">${m}</span>`).join(' ') : '-';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="clickable" onclick="showDataset('${d.Dataset}')">${d.Dataset}</span></td>
            <td data-order="${d.records_numeric || 0}">${d['Record (n)'] || '-'}</td>
            <td>${d.PPG === 1 ? '<span class="check-yes">✓</span>' : '-'}</td>
            <td>${d.ECG === 1 ? '<span class="check-yes">✓</span>' : '-'}</td>
            <td>${d.Country || '-'}</td>
            <td>${d.Setting || '-'}</td>
            <td>${getAccessBadge(d.Access)}</td>
            <td>${pretrainHtml}</td>
            <td>${evalHtml}</td>
            <td>${d.data_link ? `<a href="${d.data_link}" target="_blank" class="link-btn">Access</a>` : '-'}</td>
        `;
        tbody.appendChild(tr);
    });

    $('#datasets-reduced-table').DataTable({ pageLength: 25, order: [[0, 'asc']] });
}

// Clean citation by removing RN# prefix from citation manager
function cleanCitation(citation) {
    if (!citation) return '-';
    // Remove {RN#, pattern at the beginning (e.g., {RN10, -> {)
    return citation.replace(/\{RN\d+,\s*/g, '{');
}

// Show model modal with ALL details (excluding eval_* columns)
function showModel(name) {
    const m = MODELS.find(x => x.model === name);
    if (!m) return;

    const architecture = ARCHITECTURE_MAP[m.model] || '-';
    const ioSpec = MODEL_IO_MAP[m.model] || {};

    document.getElementById('modal-title').textContent = m.model;
    document.getElementById('modal-body').innerHTML = `
        <div class="info-row"><span class="info-label">Title</span>${m.title || '-'}</div>
        <div class="info-row"><span class="info-label">Year</span>${m.Year || '-'}</div>
        <div class="info-row"><span class="info-label">Backbone</span>${m.Backbone || '-'}</div>
        <div class="info-row"><span class="info-label">Modality</span>${m['Pretrain modality'] || '-'}</div>
        <div class="info-row"><span class="info-label">Pretrain Method</span>${m['Pretrain Method'] || '-'}</div>
        <div class="info-row"><span class="info-label">Pretrain Dataset</span>${m['Pretrain Dataset'] || '-'}</div>
        <div class="info-row"><span class="info-label">Data Size</span>${m['ECGs (n)'] || '-'}</div>
        <div class="info-row"><span class="info-label">Input Specification</span>${ioSpec.input || '-'}</div>
        <div class="info-row"><span class="info-label">Output Dimension</span>${ioSpec.output_dim || '-'}</div>
        <div class="info-row"><span class="info-label">Evaluation Data</span>${m.eval_data || '-'}</div>
        <div class="info-row"><span class="info-label">Task</span>${(m.task || '-').replace(/\n/g, '<br>')}</div>
        <div class="info-row"><span class="info-label">Performance</span>${(m.performance || '-').replace(/\n/g, '<br>')}</div>
        <div class="info-row"><span class="info-label">Architecture</span><span style="font-size: 0.9em;">${architecture}</span></div>
        <div class="info-row"><span class="info-label">Citation</span><pre style="font-size: 0.8em; white-space: pre-wrap; margin: 0;">${cleanCitation(m.citation)}</pre></div>
        <div class="info-row">${createLinks(m)}</div>
    `;
    document.getElementById('modal').style.display = 'block';
}

// Find dataset by name with fuzzy matching
function findDataset(name) {
    const searchName = name.toLowerCase().replace(/[-_*]/g, '').trim();

    // Try exact match first
    let d = DATASETS_12LEAD.find(x => x.Dataset === name) || DATASETS_REDUCED.find(x => x.Dataset === name);
    if (d) return d;

    // Try fuzzy match
    const allDatasets = [...DATASETS_12LEAD, ...DATASETS_REDUCED];
    d = allDatasets.find(x => {
        const dsName = x.Dataset.toLowerCase().replace(/[-_*]/g, '');
        return dsName.includes(searchName) || searchName.includes(dsName.split(' ')[0]);
    });

    return d;
}

// Show dataset modal with ALL details
function showDataset(name) {
    let d = findDataset(name);
    if (!d) {
        // Show a simple message if dataset not found in our tables
        document.getElementById('modal-title').textContent = name;
        document.getElementById('modal-body').innerHTML = `
            <div class="info-row"><span class="info-label">Note</span>This dataset is referenced in model pretraining but detailed information is not available in our database.</div>
        `;
        document.getElementById('modal').style.display = 'block';
        return;
    }
    const usage = findModelsUsingDataset(d.Dataset);
    const link = d.dataset_link || d.data_link;
    const is12Lead = DATASETS_12LEAD.some(x => x.Dataset === d.Dataset);

    document.getElementById('modal-title').textContent = d.Dataset;
    document.getElementById('modal-body').innerHTML = `
        <div class="info-row"><span class="info-label">Records</span>${d.Record || d['Record (n)'] || '-'}</div>
        <div class="info-row"><span class="info-label">Patients</span>${d['Patient (n)'] || '-'}</div>
        <div class="info-row"><span class="info-label">Year</span>${d.Year || '-'}</div>
        <div class="info-row"><span class="info-label">Sites</span>${d.site || '-'}</div>
        <div class="info-row"><span class="info-label">Country</span>${d.Country || '-'}</div>
        <div class="info-row"><span class="info-label">Setting</span>${d['Setting '] || d.Setting || '-'}</div>
        ${!is12Lead ? `<div class="info-row"><span class="info-label">PPG</span>${d.PPG === 1 ? '✓' : '-'}</div>` : ''}
        ${!is12Lead ? `<div class="info-row"><span class="info-label">ECG</span>${d.ECG === 1 ? '✓' : '-'}</div>` : ''}
        <div class="info-row"><span class="info-label">Sample Rate (Hz)</span>${d['Sample rate (Hz)'] || '-'}</div>
        <div class="info-row"><span class="info-label">Duration (sec)</span>${d['Time (sec)'] || '-'}</div>
        <div class="info-row"><span class="info-label">Number of Leads</span>${d['No. of leads '] || d['No. of ECG leads'] || '-'}</div>
        <div class="info-row"><span class="info-label">Demographics/Clinical</span>${d['Demographic/ clinical data'] || '-'}</div>
        <div class="info-row"><span class="info-label">ECG Labels</span>${d['ECG label'] || '-'}</div>
        <div class="info-row"><span class="info-label">Data Type</span>${d['Data type'] || '-'}</div>
        <div class="info-row"><span class="info-label">Access</span>${getAccessBadge(d.Access)}</div>
        <div class="info-row"><span class="info-label">Related Dataset</span>${d.related_dataset || d.derived_dataset || '-'}</div>
        <div class="info-row"><span class="info-label">Used for Pretraining</span>${usage.pretrain.length ? usage.pretrain.join(', ') : 'None'}</div>
        <div class="info-row"><span class="info-label">Used for Evaluation</span>${usage.eval.length ? usage.eval.join(', ') : 'None'}</div>
        <div class="info-row">${link ? `<a href="${link}" target="_blank" class="link-btn">Access Dataset</a>` : '-'}</div>
    `;
    document.getElementById('modal').style.display = 'block';
}

// Setup tabs
function setupTabs() {
    document.querySelectorAll('.nav-tabs li').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tabs li').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

// Setup filters for model type (only buttons with data-filter attribute)
function setupFilters() {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('#models-tbody tr').forEach(row => {
                row.style.display = (filter === 'all' || row.dataset.type === filter) ? '' : 'none';
            });
        });
    });
}

// Setup compare
function setupCompare() {
    const container = document.getElementById('model-checkboxes');
    MODELS.forEach(m => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${m.model}"><span>${m.model}</span>`;
        label.querySelector('input').addEventListener('change', updateCompareBtn);
        container.appendChild(label);
    });
    
    document.getElementById('compare-btn').addEventListener('click', compareModels);
}

function updateCompareBtn() {
    const checked = document.querySelectorAll('#model-checkboxes input:checked');
    const btn = document.getElementById('compare-btn');
    btn.disabled = checked.length < 2 || checked.length > 4;
    btn.textContent = `Compare Selected (${checked.length})`;
}

function compareModels() {
    const selected = Array.from(document.querySelectorAll('#model-checkboxes input:checked')).map(cb => cb.value);
    const models = MODELS.filter(m => selected.includes(m.model));

    // All properties from model card for comparison
    const props = [
        { key: 'title', label: 'Paper Title' },
        { key: 'Year', label: 'Year' },
        { key: 'Backbone', label: 'Backbone' },
        { key: 'Pretrain modality', label: 'Modality' },
        { key: 'Pretrain Method', label: 'Pretrain Method' },
        { key: 'Pretrain Dataset', label: 'Pretrain Dataset' },
        { key: 'ECGs (n)', label: 'Data Size' },
        { key: 'ECGlead', label: 'ECG Leads' },
        { key: 'sampling_rate', label: 'Sampling Rate (Hz)' },
        { key: 'eval_data', label: 'Evaluation Data' },
        { key: 'task', label: 'Task' },
        { key: 'performance', label: 'Performance' }
    ];

    document.getElementById('comparison-thead').innerHTML = '<tr><th>Property</th>' + models.map(m => `<th>${m.model}</th>`).join('') + '</tr>';
    document.getElementById('comparison-tbody').innerHTML = props.map(p => {
        const cells = models.map(m => {
            let val = m[p.key] || '-';
            // Handle multiline text
            if (typeof val === 'string' && val.includes('\n')) {
                val = val.replace(/\n/g, '<br>');
            }
            return `<td>${val}</td>`;
        }).join('');
        return `<tr><td><strong>${p.label}</strong></td>${cells}</tr>`;
    }).join('');
    document.getElementById('comparison-table').style.display = 'table';
}

// Setup modal
function setupModal() {
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') e.target.style.display = 'none';
    });
}

// Setup dataset link click handlers using event delegation
function setupDatasetLinks() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('dataset-link')) {
            const datasetName = e.target.getAttribute('data-dataset');
            if (datasetName) {
                showDataset(datasetName);
            }
        }
        // Handle model-tag clicks in dataset tables
        if (e.target.classList.contains('model-tag') && e.target.hasAttribute('data-model')) {
            const modelName = e.target.getAttribute('data-model');
            if (modelName) {
                showModel(modelName);
            }
        }
    });
}

// Populate benchmark table
function populateBenchmarks(data) {
    const tbody = document.getElementById('benchmark-tbody');
    if (!tbody) return;

    // Destroy existing DataTable if present
    if ($.fn.DataTable.isDataTable('#benchmark-table')) {
        $('#benchmark-table').DataTable().destroy();
    }

    tbody.innerHTML = '';

    data.forEach(b => {
        const tr = document.createElement('tr');
        // Helper to format values, handling OOM strings - use large number for sorting OOM to end
        const fmt = (v, decimals = 1) => v === "OOM" ? '<span style="color:#c00;">OOM</span>' : (typeof v === 'number' ? v.toFixed(decimals) : v);
        const fmtInt = (v) => v === "OOM" ? '<span style="color:#c00;">OOM</span>' : (typeof v === 'number' ? v.toLocaleString() : v);
        const sortVal = (v) => v === "OOM" ? 999999 : (typeof v === 'number' ? v : 0);
        // For CPU, memory columns show N/A since those weren't captured
        const inferMem = b.Infer_Mem_GB === "OOM" ? '<span style="color:#c00;">OOM</span>' : (b.Infer_Mem_GB > 0 ? b.Infer_Mem_GB.toFixed(2) : 'N/A');
        const trainMem = b.Train_Mem_GB === "OOM" ? '<span style="color:#c00;">OOM</span>' : (b.Train_Mem_GB > 0 ? b.Train_Mem_GB.toFixed(2) : 'N/A');
        const inferMemSort = b.Infer_Mem_GB === "OOM" ? 999999 : (b.Infer_Mem_GB > 0 ? b.Infer_Mem_GB : 0);
        const trainMemSort = b.Train_Mem_GB === "OOM" ? 999999 : (b.Train_Mem_GB > 0 ? b.Train_Mem_GB : 0);
        const displayName = getBenchmarkDisplayName(b.Model);
        // HeartLang uses 12 leads but pre-tokenizes to 256 tokens
        const leadsDisplay = b.Model === 'heartlang' ? b.Leads + '*' : b.Leads;

        tr.innerHTML = `
            <td><span class="clickable" onclick="showModel('${displayName}')">${displayName}</span></td>
            <td>${leadsDisplay}</td>
            <td data-order="${b.Params_M}">${b.Params_M.toFixed(1)}</td>
            <td data-order="${b.GFLOPs}">${b.GFLOPs.toFixed(1)}</td>
            <td data-order="${sortVal(b.Infer_ms)}">${fmt(b.Infer_ms)}</td>
            <td data-order="${sortVal(b.Throughput)}">${fmtInt(b.Throughput)}</td>
            <td data-order="${sortVal(b.Train_ms_per_sample)}">${fmt(b.Train_ms_per_sample)}</td>
            <td data-order="${sortVal(b.Finetune_Hours)}">${fmt(b.Finetune_Hours)}</td>
            <td data-order="${inferMemSort}">${inferMem}</td>
            <td data-order="${trainMemSort}">${trainMem}</td>
        `;
        tbody.appendChild(tr);
    });

    $('#benchmark-table').DataTable({
        pageLength: 25,
        order: [[2, 'desc']]  // Sort by params by default
    });
}

// Setup benchmark hardware filters
function setupBenchmarkFilters() {
    document.querySelectorAll('.benchmark-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.benchmark-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const hw = btn.dataset.hw;

            if (hw === 'a100') {
                currentBenchmarkData = BENCHMARKS_A100;
            } else if (hw === 't4') {
                currentBenchmarkData = BENCHMARKS_T4;
            } else if (hw === 'cpu') {
                currentBenchmarkData = BENCHMARKS_CPU;
            }

            populateBenchmarks(currentBenchmarkData);
        });
    });
}

// Continent groupings for country filter
const CONTINENT_MAP = {
    'US': 'North America',
    'Canada': 'North America',
    'Brazil': 'South America',
    'UK': 'Europe',
    'Germany': 'Europe',
    'Czech Republic': 'Europe',
    'Slovenia, Italy': 'Europe',
    '8 Europe countries': 'Europe',
    'Russia': 'Europe',
    'Belgium': 'Europe',
    'China': 'Asia',
    'South Korea': 'Asia'
};

// Populate country filter dropdown grouped by continent
function setupCountryFilter(selectId, data, tableId, colIndex) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const countries = [...new Set(data.map(d => d.Country).filter(c => c))];

    // Group by continent
    const byContinent = {};
    countries.forEach(c => {
        const continent = CONTINENT_MAP[c] || 'Other';
        if (!byContinent[continent]) byContinent[continent] = [];
        byContinent[continent].push(c);
    });

    const continentOrder = ['North America', 'South America', 'Europe', 'Asia', 'Other'];

    select.innerHTML = '<option value="">All Countries</option>';

    continentOrder.forEach(continent => {
        if (byContinent[continent] && byContinent[continent].length > 0) {
            select.innerHTML += `<option value="CONTINENT:${continent}" style="font-weight:bold;">── ${continent} ──</option>`;
            byContinent[continent].sort().forEach(c => {
                select.innerHTML += `<option value="${c}">&nbsp;&nbsp;&nbsp;${c}</option>`;
            });
        }
    });

    select.onchange = function() {
        const table = $('#' + tableId).DataTable();
        const value = this.value;

        if (value === '') {
            table.column(colIndex).search('').draw();
        } else if (value.startsWith('CONTINENT:')) {
            const continent = value.replace('CONTINENT:', '');
            const countriesInContinent = Object.keys(CONTINENT_MAP).filter(c => CONTINENT_MAP[c] === continent);
            const regex = countriesInContinent.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            table.column(colIndex).search(regex, true, false).draw();
        } else {
            table.column(colIndex).search('^' + value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', true, false).draw();
        }
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        populateModels();
        populate12Lead();
        populateReduced();
        populateBenchmarks(BENCHMARKS_A100);
        setupTabs();
        setupFilters();
        setupBenchmarkFilters();
        setupCompare();
        setupModal();
        setupDatasetLinks();
        setupCountryFilter('filter-12lead-country', DATASETS_12LEAD, 'datasets-12lead-table', 3);
        setupCountryFilter('filter-reduced-country', DATASETS_REDUCED, 'datasets-reduced-table', 4);
        console.log('Loaded:', MODELS.length, 'models,', DATASETS_12LEAD.length, '12-lead,', DATASETS_REDUCED.length, 'reduced');
    } catch (e) {
        console.error('Initialization error:', e);
    }
});
