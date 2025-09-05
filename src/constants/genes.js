export const genes = {
  CYP2R1: {
    name: 'CYP2R1',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Vitamins',
    risk: 'Vitamin D deficiency',
    desc: 'Your CYP2R1 gene plays a central role in converting the D3 that your skin makes (or that you takeas a supplement) into the activated hormone, 1,25 dihydroxy calciferol.',
    genotypes: [
      {
        genotype: 'AG',
        risk_level: 'increased',
        desc: 'Moderate activity, Possible mild inefficiency in vitamin D metabolism, Tend to have Moderately reduced 25(OH)D- Associated with Moderately reduced 25(OH)D.',
      },
      {
        genotype: 'GG',
        risk_level: 'increased',
        desc: 'Reduced activity, tend to have lower vitamin D levels- Associated with lower circulating levels of 25(OH)D.-  have a higher risk of vitamin D deficiency and reduced response to supplementation.',
      },
      {
        genotype: 'AA',
        risk_level: 'normal',
        desc: 'TNormal activity, Efficient conversion of vitamin D; lower risk of deficiency tend to have higher vitamin D levels - Associated with optimal 25-hydroxyvitamin D (25(OH)D) levels.',
      },
    ],
    rs_id: 'rs10741657',
  },
  VDR: {
    name: 'VDR',
    risk: 'Vitamin D deficiency',
    desc: 'The VDR gene provides instructions for making a protein called vitamin D receptor (VDR), regulates the expression of genes involved in a wide range of biological processes, including calcium and phosphate homeostasis, bone health, immune function, and cell growth.',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Vitamins',
    genotypes: [
      {
        genotype: 'CT',
        risk_level: 'increased',
        desc: 'Moderate VDR efficiency; moderate risk for vitamin D–related disorders.',
      },
      {
        genotype: 'TT',
        risk_level: 'increased',
        desc: 'Impaired vitamin D signaling; poor cellular uptake and utilization of vitamin D.',
      },
      {
        genotype: 'CC',
        risk_level: 'normal',
        desc: 'Normal vitamin D receptor activity; optimal cellular response to vitamin D.',
      },
    ],
    rs_id: 'rs2228570',
  },
  TCF7L2_rs7903146: {
    name: 'TCF7L2',
    risk: 'Type 2 diabetes',
    desc: 'Your TCF7L2 gene encodes an instruction that allows insulin to efficiently perform its role as one of the most important tuners, TCF7L2 gene is involved in the regulation of fat metabolism and energy balance',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Serum Glucose',
    genotypes: [
      {
        genotype: 'CT',
        risk_level: 'increased',
        desc: 'Moderate risk of Type 2 Diabetes, Impaired insulin secretion and Increased hepatic glucose production.',
      },
      {
        genotype: 'TT',
        risk_level: 'increased',
        desc: 'Increased risk of Type 2 Diabetes, Impaired insulin secretion and Increased hepatic glucose production.',
      },
      {
        genotype: 'CC',
        risk_level: 'normal',
        desc: 'Normal (lower) risk  of Type 2 Diabetes, Impaired insulin secretion and Increased hepatic glucose production.',
      },
    ],
    rs_id: 'rs7903146',
  },
  TCF7L2_rs12255372: {
    name: 'TCF7L2',
    risk: 'Insulin resistance',
    desc: 'Your TCF7L2 gene encodes an instruction that allows insulin to efficiently perform its role as one of the most important tuners, TCF7L2 gene is involved in the regulation of fat metabolism and energy balance',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Serum Glucose',
    genotypes: [
      {
        genotype: 'GT',
        desc: 'Moderate impairment in insulin secretion and moderate risk of Type II diabetes.',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Suboptimal insulin response and increased risk of Type II diabetes , glucose intolerance, and beta-cell dysfunction.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Optimal insulin response and reduced risk of Type II diabetes.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs12255372',
  },
  MTNR1B: {
    name: 'MTNR1B',
    risk: 'Type 2 diabetes',
    desc: 'Your MTNR1B gene encodes an instruction that is needed for your cells to respond to melatonin– so that melatonin can perform the above-mentioned important jobs. MTNR1B gene encodes the melatonin receptor 1B. This receptor is involved in regulating circadian rhythms and has been implicated in glucose metabolism and diabetes risk',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Serum Glucose',
    genotypes: [
      {
        genotype: 'CG',
        desc: 'Moderate reduction in early-phase insulin secretion, moderate risk of metabolic disorders, with slightly lower risks than the CC genotype.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Normal insulin secretion, reduced risk of developing type 2 diabetes, and might influence better regulation of insulin secretion and lower susceptibility to metabolic conditions.',
        risk_level: 'increased',
      },
      {
        genotype: 'CC',
        desc: 'Impaired beta-cell function, elevated fasting glucoseassociated with an increased risk of impaired glucose metabolism and a higher susceptibility to developing type 2 diabetes. They may also experience a higher risk for disrupted sleep patterns and circadian rhythm disturbances.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs10830963',
  },
  COMT: {
    name: 'COMT',
    desc: 'Your COMT gene gives your cells the instructions to make your COMT enzyme which eliminates your estrogen metabolites and  involved in the metabolism of catecholamines such as dopamine, epinephrine, and norepinephrine. It catalyzes the transfer of a methyl group to these compounds, thereby inactivating them and regulating their levels in the brain and other tissues.',
    risk: 'Anxiety and Stress',
    category: 'METHYLATION',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: 'TT',
        desc: 'Lowest COMT activity and longest dopamine half-life which could lead to Potentially better stress management.',
        risk_level: 'normal',
      },
      {
        genotype: 'CT',
        desc: 'Moderate COMT activity and medial dopamine half-life.',
        risk_level: 'increased',
      },
      {
        genotype: 'CC',
        desc: 'Highest COMT activity and shortest dopamine half-life, which could lead to Higher anxiety sensitivity and Higher pain sensitivity.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs4680',
  },
  CYP1A1: {
    name: 'CYP1A1',
    risk: 'Toxins Lung cancer risk for smokers',
    desc: 'The CYP1A1 gene encodes cytochrome P450 1A1, an enzyme involved in the metabolism of xenobiotics and procarcinogens like polycyclic aromatic hydrocarbons (PAHs) and dioxins. This enzyme plays a critical role in the activation of environmental toxins into reactive intermediates, which can form DNA adducts and initiate carcinogenesis.it encodes the instruction for one of the most important metabolizers of both estradiol and estrone.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Increased enzyme activity and increased production of 2-OH-estrogen metabolites, also associated with increased enzyme inducibility upon exposure to toxins with increased risk of toxic intermediate and Reactive oxygen species (ROS) accumulation, potentially higher cancer risk, especially with Smoking or pollution exposure, High estrogen levels & Poor Phase II detoxification (e.g., low GST, COMT function).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate enzyme activity and increased production of 2-OH-estrogen metabolites, Moderate enzyme inducibility upon exposure to toxins with Moderate risk of toxic intermediate and Reactive oxygen species (ROS) accumulation.',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Decreased enzyme activity and decreased production of 2-OH-estrogen metabolites. Low enzyme inducibility upon exposure to toxins with reduced risk of toxic intermediate and Reactive oxygen species (ROS) accumulation.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1048943',
  },
  CYP1B1: {
    name: 'CYP1B1',
    risk: 'Breast cnacer (F), Prostate cancer (M)',
    desc: 'it is primarily responsible for metabolizing your estrogens (both estradiol and estrone) into the more toxic/inflammatory 4OHE metabolite.it has been associated with altered enzyme activity, influencing estrogen metabolism. This has implications for cancers such as breast, ovarian, and endometrial cancer.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Slow production of 4-OH-estrogen metabolites, slow enzyme production  leading to low risk bioactivation of pro-carcinogens.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Increased production of 4-OH-estrogen metabolites, and potentially increased enzyme production leading to increased risk of  bioactivation of pro-carcinogens.',
        risk_level: 'increased',
      },
      {
        genotype: 'CG',
        desc: 'Moderate production of 4-OH-estrogen metabolites, and potentially moderate enzyme production leading to moderate risk of bioactivation of pro-carcinogens.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1056836',
  },
  UGT2B15: {
    name: 'UGT2B15',
    risk: 'Male baldness & Prostate conditions',
    desc: 'Your UGT2B genes encode enzymes that neutralize your androgens by making them more water soluble so that they can be eliminated through your urine. It is important for detoxification processes, regulating steroid hormones, and influencing the metabolism of drugs and toxins in the body.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'TT',
        desc: 'Increased glucuronidation of androgens and androgen metabolites, including DHT a quicker androgen metabolite clearance which may raise the "effective" amount of steroids within the prostate and decrease risk for prostate cancer.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Slow clearance of testosterone and DHT that could be linked to conditions such as male pattern baldness, benign prostatic hyperplasia, and other androgen-sensitive conditions.',
        risk_level: 'increased',
      },
      {
        genotype: 'TG',
        desc: 'Moderate glucuronidation of androgens and androgen metabolites, including DHT ,keeping a moderate balanced endrogine in your body.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1902023',
  },
  GSTP1: {
    name: 'GSTP1',
    desc: 'GSTP1 is a critical enzyme involved in the detoxification of electrophilic compounds, including carcinogens, drugs, and reactive oxygen species. It has been associated with altered susceptibility to several cancers, including lung, breast, prostate, and colorectal cancers.',
    category: ' DETOX & ANTIOXIDATION',
    bloodPanel: 'CBC',
    risk: 'Toxins Lung cancer risk for smokers.',
    genotypes: [
      {
        genotype: 'AG',
        desc: 'Moderate enzyme function and moderate clearance of substrates and reactive oxygen species.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Low GSTP1 enzymatic activity - The G allele (Val variant) has been associated with reduced ability to detoxify carcinogens, which may elevate the risk for cancers like lung, breast, and colorectal cancer.',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Optimal enzyme function and optimal clearance of substrates and reactive oxygen species.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1695',
  },
  GSTT1: {
    name: 'GSTT1',
    desc: 'The GSTT1 gene encodes a member of the glutathione S-transferase family, which plays a role in detoxifying harmful substances, including environmental toxins, drugs, and oxidative stress by conjugating them with glutathione.',
    risk: 'Fatigue, tiredness, and lack of energy',
    category: ' DETOX & ANTIOXIDATION',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: '0',
        risk_level: 'increased',
        desc: '(zero copy) No enzyme activity, represents the absence of the GSTT1 gene due to a deletion, meaning it is associated with increased susceptibility to diseases like cancer or other conditions influenced by oxidative stress and xenobiotic metabolism.',
      },
      {
        genotype: '1',
        risk_level: 'normal',
        desc: '(one copy) Moderate enzyme activity.It represents a partial capacity for detoxification, Moderate risk of toxic intermediate and Reactive oxygen species (ROS) accumulation.',
      },
      {
        genotype: '2',
        risk_level: 'normal',
        desc: '(two copies) Standard or baseline for enzyme activity in most populations.reduced risk of toxic intermediate and Reactive oxygen species (ROS) accumulation.',
      },
      {
        genotype: '3',
        risk_level: 'normal',
        desc: '(three copies) Increased enzyme activity, potentially enhancing detoxification capacity and reduced risk of toxic intermediate and Reactive oxygen species (ROS) accumulation.',
      },
    ],
    rs_id: 'CNV',
  },
  GSTM1: {
    name: 'GSTM1',
    desc: 'The GSTM1 gene plays an essential role in detoxifying xenobiotics, carcinogens, and byproducts of oxidative stress.',
    risk: 'Oxidative Stress-Related Diseases Lung Cancer and Breast Cancer.',
    category: ' DETOX & ANTIOXIDATION',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: '0',
        desc: '(zero copy) No enzyme production and poorer clearance of substrates with decreased ability to detoxify environmental xenobiotics, pharmaceutics and Reactive oxygen species (ROS ).',
        risk_level: 'increased',
      },
      {
        genotype: '1',
        desc: '(One copy) Average enzyme function and clearance of substrates with average ability to detoxify environmental xenobiotics, pharmaceutics and Reactive oxygen species (ROS).',
        risk_level: 'increased',
      },
      {
        genotype: '2',
        desc: '(2 copies) Increased enzyme function and clearance of substrates with increased ability to detoxify environmental xenobiotics, pharmaceutics and Reactive oxygen species (ROS).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'CNV',
  },
  CYP17A1: {
    name: 'CYP17A1',
    risk: 'Steriod Hormone Production',
    desc: 'CYP17A1 gene encodes cytochrome P450 17A1, an enzyme critical in steroidogenesis. This enzyme is involved in the production of steroid hormones, including glucocorticoids, mineralocorticoids, and sex steroids.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Increased transcriptional activity of the CYP17A1 gene, potentially leading to higher enzyme activity and altered levels of steroid hormones. linked to altered prostate cancer risk due to changes in androgen levels,Polycystic ovary syndrome (PCOS): Potential involvement in altered steroidogenesis. and Endometriosis ( Implications in hormonal regulation).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate impact on enzyme activity, Moderate steroid hormone production.common and reflects genetic variability.',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Normal or less risk-associated with hormone-related conditions and Normal steroid hormone production.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs743572',
  },
  SRD5A2: {
    name: 'SRD5A2',
    risk: 'Test conversion to DHT',
    desc: 'Your SRD5A2 gene is responsible for the conversion of your testosterone into dihydrotestosterone ( DHT). DHT is a key androgen involved in the development of male sexual characteristics and the regulation of hair growth, prostate function, and other aspects of male physiology.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Lower activity and low conversion of testosterone to DHT, lower concentrations of free and total testosterone, and lower circulating concentrations of the DHT breakdown product 3α-androstanediol-glucuronide which could be a risk for hormone-sensitive conditions, particularly those affecting the prostate, reproductive system, and metabolic health.',
        risk_level: 'increased',
      },
      {
        genotype: 'CG',
        desc: 'Moderate enzyme activity and moderate conversion of testosterone to DHT, with potential risk associated with high DHT levels.',
        risk_level: 'increased',
      },
      {
        genotype: 'CC',
        desc: 'Normal enzyme activity, Generally considered the protective genotype, associated with reduced enzyme activity and reduced conversion of testosterone into dihydrotestosterone DHT, minimizing risk associated with high DHT levels.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs523349',
  },
  DIO2: {
    name: 'DIO2',
    desc: 'Your TSH, or thyroid stimulating hormone, does exactly what the name implies – it stimulates your thyroid gland to produce your actual thyroid hormones, T3 and T4. Your thyroid gland function is inversely related to your TSH levels.',
    risk: 'Thyroid hormone metabolism.',
    category: 'METABOLISM AND DIET',
    bloodPanel: 'Thyroid',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Reduced T3 conversion , Is associated with various health conditions including psychological symptoms, certain cancers, and thyroid-related disorders.',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate T3 Conversion & thyroid hormone metabolism.',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Normal T3 Conversion & thyroid hormone metabolism.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs225014',
  },
  PSRC1: {
    name: 'PSRC1',
    risk: 'LDL cholesterol',
    desc: 'The PSRC1 (Proline/Serine-Rich Coiled-Coil 1) gene has been studied for its role in lipid metabolism and cardiovascular disease.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'AA',
        desc: 'Higher LDL-C levels, potentially increasing risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderate LDL-C levels, moderate risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Lower levels of LDL cholesterol (LDL-C), which reduce the risk of coronary artery disease (CAD).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs599839',
  },
  SLCO1B1: {
    name: 'SLCO1B1',
    risk: 'Cholesterol statin-induced muscle toxicity.',
    desc: 'SLCO1B1 gene controls statin metabolism.The use of statins blocks cholesterol production.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Decreased ability to clear statins from the bloodstream, increasing the risk of statin-induced muscle toxicity and increased risk of myopathy a disease that affects the muscles that control voluntary movement in the body.',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate ability to clear statins from the bloodstream with a risk of myopathy a disease that affects the muscles that control voluntary movement in the body.',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Normal  ability to clear statins from the bloodstream with no side effects.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs4149056',
  },
  APOE_rs7412: {
    name: 'APOE',
    risk: 'Hypercholesterolemia (High Cholesterol).',
    desc: 'The APOE (Apolipoprotein E) gene plays several important roles in the body, primarily related to lipid metabolism and transport When this gene is not optimal,cholesterol build-up can occur much faster in your bloodstream, increasing your risk of high cholesterol.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Higher risk of Hypercholesterolemia ( High Cholesterol) and triglycerides  leading to the risk of risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate  risk of of Hypercholesterolemia ( High Cholesterol) and triglycerides and moderate risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Lower risk of Hypercholesterolemia ( High Cholesterol) and triglycerides and lower risk of coronary artery disease (CAD).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs7412',
  },
  APOE_rs429358: {
    name: 'APOE',
    risk: 'Hypercholesterolemia (High Cholesterol).',
    desc: 'The APOE (Apolipoprotein E) gene plays several important roles in the body, primarily related to lipid metabolism and transport When this gene is not optimal,cholesterol build-up can occur much faster in your bloodstream, increasing your risk of high cholesterol.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Higher risk of Hypercholesterolemia ( High Cholesterol) and triglycerides  leading to the risk of risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderate  risk of of Hypercholesterolemia ( High Cholesterol) and triglycerides and moderate risk of coronary artery disease (CAD).',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Lower risk of Hypercholesterolemia ( High Cholesterol) and triglycerides and lower risk of coronary artery disease (CAD).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs429358',
  },
  MLXIPL: {
    name: 'MLXIPL',
    risk: 'Triglyceride',
    desc: 'MLXIPL encodes a transcription factor that plays a crucial role in regulating glucose and lipid metabolism. It is activated by glucose metabolites and regulates genes involved in glycolysis, lipogenesis (fat storage), and the synthesis of fatty acids.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Higher triglyceride levels, Lower HDL cholesterol, Increased risk of metabolic syndrome.',
        risk_level: 'increased',
      },
      {
        genotype: 'CG',
        desc: 'Moderate triglyceride levels, Lower HDL cholesterol, moderate  risk of metabolic syndrome.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Lower triglyceride levels, Higher HDL cholesterol, Reduced risk of metabolic syndrome, Protective and Associated with Most protective genotype.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs3812316',
  },
  '9P21_rs10757278': {
    name: '9P21 (CDKN2A)',
    risk: 'coronary artery disease.',
    desc: 'The chromosome 9p21 (Ch9p21) locus remains the most widely recognized and replicated genetic risk factor for coronary heart disease (CHD) to date. It was identified through genome-wide association using predominantly case-control studies in which cases had a first CHD event.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Moderately increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Lowest risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs10757278',
  },
  PCSK9: {
    name: 'PCSK9',
    desc: 'PCSK9 gene encodes a protein that plays a crucial role in regulating low-density lipoprotein cholesterol (LDL-C) levels in the bloodstream.',
    risk: 'LDL cholesterol.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Higher LDL cholesterol levels Common genotype, which increase the risk of cardiovascular events (e.g., heart attack, stroke).',
        risk_level: 'increased',
      },
      {
        genotype: 'GT',
        desc: 'Moderate LDL cholesterol levels, which moderately reduce the risk of cardiovascular events (e.g., heart attack, stroke).',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Lower LDL cholesterol levels, which significantly reduces the risk of cardiovascular events (e.g., heart attack, stroke).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs11591147',
  },
  '9P21_rs10757274': {
    name: '9P21 (CDKN2A)',
    risk: 'Coronary artery disease.',
    desc: 'The chromosome 9p21 (Ch9p21) locus remains the most widely recognized and replicated genetic risk factor for coronary heart disease (CHD) to date. It was identified through genome-wide association using predominantly case-control studies in which cases had a first CHD event.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderately increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Lowest risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs10757274',
  },
  '9P21_rs4977574': {
    name: '9P21 (CDKN2A)',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    risk: 'Coronary artery disease.',
    desc: 'The chromosome 9p21 (Ch9p21) locus remains the most widely recognized and replicated genetic risk factor for coronary heart disease (CHD) to date. It was identified through genome-wide association using predominantly case-control studies in which cases had a first CHD event.',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderately increased risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Lowest risk of coronary artery disease and ischemic stroke (vascular endothelial dysfunction ).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs4977574',
  },
  TMPRSS2: {
    name: 'TMPRSS2',
    risk: 'Respiratory infections.',
    desc: 'The TMPRSS2 gene encodes a serine protease involved in the activation of certain viral proteins, including the spike protein of SARS-CoV-2, the virus responsible for COVID-19.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Increased susceptibility to severe respiratory infections such as COVID-19 infection.',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderate susceptibility to severe respiratory infections.',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Reduced susceptibility to severe respiratory infections such as COVID-19 infection.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs2070788',
  },
  CDKN2A: {
    name: 'CDKN2A',
    desc: 'The CDKN2A is well-known for its involvement in cardiovascular diseases, such as coronary artery disease (CAD), and it has been linked to various cancer susceptibility loci as well. Abdominal Aortic Aneurysm and Brain Aneurysm.',
    risk: 'Coronary artery disease.',
    category: 'CARDIOVASCULAR',
    bloodPanel: 'LIPIDS',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Associated with a higher risk of CAD and ischemic stroke  (vascular endothelial dysfunction).',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Associated with moderate  risk of coronary artery disease (CAD) and ischemic stroke  (vascular endothelial dysfunction).',
        risk_level: 'increased',
      },
      {
        genotype: 'TT',
        desc: 'Associated with a lower risk of coronary artery disease (CAD) and ischemic stroke  (vascular endothelial dysfunction).',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs10757278',
  },
  MTHFR_rs1801133: {
    name: 'MTHFR',
    desc: 'The MTHFR gene provides instructions for making an enzyme called methylenetetrahydrofolate reductase. This enzyme plays a role in processing amino acids, the building blocks of proteins. Methylenetetrahydrofolate reductase is important for a chemical reaction involving the vitamin folate (also called vitamin B9).',
    risk: 'Cardiovascular diseases and complications related to folate deficiency.',
    category: 'METHYLATION',
    bloodPanel: 'Vitamins',
    genotypes: [
      {
        genotype: 'AA',
        desc: 'Reduced MTHFR enzyme activity (Most severe impact on methylation processes) , which can result in higher levels of homocysteine and a greater risk for certain health conditions, including cardiovascular diseases and complications related to folate deficiency which is  foundational requirement for fertility.',
        risk_level: 'increased',
      },
      {
        genotype: 'GA',
        desc: 'Moderate enzyme activity  This can lead to slightly elevated homocysteine levels or  you may have vitamin B deficiency.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Normal MTHFR enzyme activity, and they usually process folate and homocysteine at normal rates.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1801133',
  },
  MTHFR_rs1801131: {
    name: 'MTHFR',
    desc: 'The MTHFR gene provides instructions for making an enzyme called methylenetetrahydrofolate reductase. This enzyme plays a role in processing amino acids, the building blocks of proteins. Methylenetetrahydrofolate reductase is important for a chemical reaction involving the vitamin folate (also called vitamin B9).',
    risk: 'Cardiovascular diseases and complications related to folate deficiency.',
    category: 'METHYLATION',
    bloodPanel: 'Vitamins',
    genotypes: [
      {
        genotype: 'CC',
        desc: 'Reduced MTHFR enzyme activity (Most severe impact on methylation processes) , which can result in higher levels of homocysteine and a greater risk for certain health conditions, including cardiovascular diseases and complications related to folate deficiency which is  foundational requirement for fertility.',
        risk_level: 'increased',
      },
      {
        genotype: 'AC',
        desc: 'Moderate enzyme activity  This can lead to slightly elevated homocysteine levels or  you may have vitamin B deficiency.',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Normal MTHFR enzyme activity, and they usually process folate and homocysteine at normal rates.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1801131',
  },
  SOD2: {
    name: 'SOD2',
    desc: 'SOD2 is essential for protecting the mitochondria and cells from oxidative damage by converting harmful superoxide radicals into less damaging substance as it encodes the mitochondrial enzyme manganese superoxide dismutase (MnSOD).',
    risk: 'Oxidative stress and related conditions.',
    category: 'DETOX & ANTIOXIDATION',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: 'AA',
        desc: 'Increasing the risk of oxidative damage within the mitochondria which cause inflammation and take longer to recover from a bacterial or viral infection.',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderate MnSOD activity which could result in a risk of oxidative damage within the mitochondria which cause inflammation.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Associated with higher MnSOD activity, potentially providing better antioxidant defense.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs4880',
  },
  GPx: {
    name: 'GPx',
    desc: 'Glutathione peroxidase-1 (GPx-1) is an intracellular antioxidant enzyme that enzymatically reduces hydrogen peroxide to water to limit its harmful effects, it  plays  important roles in maintaining redox homeostasis (the endogenous capacity of cells to continuously deal with challenges that generate electrophiles)',
    risk: 'Oxidative stress and related conditions.',
    category: 'DETOX & ANTIOXIDATION',
    bloodPanel: 'CBC',
    genotypes: [
      {
        genotype: 'TT',
        desc: 'May have reduced GPx1 activity, which could lead to lower antioxidant capacity and potentially increased susceptibility to oxidative stress and related conditions, such as cardiovascular disease, bladder cancer, and neurodegenerative disorders.',
        risk_level: 'increased',
      },
      {
        genotype: 'CT',
        desc: 'Associated with medium conversion of hydrogen peroxide created from oxidant metabolism via SOD2 into water and diatomic oxygen, generally have a moderate antioxidant defense which imply moderate risk for cardiovascular disease, bladder cancer, and neurodegenerative disorders.',
        risk_level: 'increased',
      },
      {
        genotype: 'CC',
        desc: 'Associated with faster conversion of hydrogen peroxide created from oxidant metabolism via SOD2 into water and diatomic oxygen, generally have a stronger antioxidant defense. This helps protect cells from oxidative damage, which can be beneficial in reducing the risk of oxidative stress-related diseases like cardiovascular diseases, cancer, and neurodegenerative conditions.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs1050450',
  },
  FOXO3: {
    name: 'FOXO3',
    desc: 'The gene FOXO3 is part of a family of transcription factors that play an important role in regulating various cellular processes such as apoptosis, cell cycle regulation, stress resistance, and metabolism. FOXO3, in particular, has been studied for its potential influence on longevity, age-related diseases, and cellular responses to oxidative stress.',
    risk: 'Oxidative stress and related conditions.',
    category: 'DETOX & ANTIOXIDATION',
    bloodPanel: 'Serum Glucose',
    genotypes: [
      {
        genotype: 'TT',
        desc: "Associated with increased risk for diseases associated with aging, such as cardiovascular diseases, diabetes, neurodegenerative diseases (like Alzheimer's), and certain cancers. The reduced FOXO3 activity could impair the body’s ability to manage cellular damage and oxidative stress, which are key factors in the development of these diseases.",
        risk_level: 'increased',
      },
      {
        genotype: 'GT',
        desc: 'Associated with some protective benefits compared to CC but is still at a disadvantage compared to GG carriers when it comes to longevity and disease resistance.',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Assocaited with longetivity in multiple ethnicities   the benefit of the g allele is linked to improved stem cell homeostasis and improved ros and detox activity.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs2802292',
  },
  SIRT1: {
    name: 'SIRT1',
    desc: 'The SIRT1 gene encodes the enzyme sirtuin 1, which plays a key role in regulating cellular processes related to aging, stress resistance, inflammation, metabolism, and longevity. It is part of a family of proteins known as sirtuins that function as NAD+-dependent deacetylases, involved in regulating various cellular pathways, including DNA repair, cell survival, and inflammation.',
    risk: 'Cardiovascular disease, and other age-related diseases.',
    category: 'DETOX & ANTIOXIDATION',
    bloodPanel: 'Serum Glucose',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Assocaited with reduction in SIRT1 activity could contribute to increased risk for conditions like metabolic syndrome, cardiovascular disease, and other age-related diseases.',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Assocaited with moderate  risk for diseases associated with reduced SIRT1 expression (e.g., metabolic syndrome, cardiovascular diseases, and aging-related conditions).',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Assocaited with lower risk for diseases associated with reduced SIRT1 expression (e.g., metabolic syndrome, cardiovascular diseases, and aging-related conditions). better cognitive aging.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs3758391',
  },
  HTR2A: {
    name: 'HTR2A',
    risk: 'Psychotic or impulsive behaviors.',
    desc: 'HTR2A gene encodes the serotonin receptor 2A (5-HT2A). This receptor is involved in various functions in the brain, including mood regulation, and has been implicated in several psychiatric disorders, such as schizophrenia and depression.',
    category: 'MOOD & BEHAVIOUR',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Might have a lower receptor activity, potentially making them more prone to psychotic or impulsive behaviors, as serotonin is involved in emotional regulation and cognitive processing.',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'May confer serotonin receptor activity and Intermediate risk for psychiatric conditions.',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'May have a higher serotonin receptor activity, which could predispose them to certain mood disorders (like anxiety or depression), especially in stressful environments or in the presence of other risk factors.',
        risk_level: 'increased',
      },
    ],
    rs_id: 'rs6311',
  },
  UGT2B17: {
    name: 'UGT2B17',
    desc: 'The UGT2B17 gene encodes a member of the UDP-glucuronosyltransferase (UGT) enzyme family, which plays a key role in the detoxification and metabolism of a wide range of substances, including steroids, drugs, and environmental toxins.',
    risk: 'Drug response.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: '0',
        desc: '(zero copy) Absent enzyme activity and increased concentrations of circulating testosterone and estradiol levels, deletion has been studied in relation to variations in drug response, particularly for drugs metabolized by glucuronidation, such as some anti-cancer drugs, and steroids like testosterone.',
        risk_level: 'increased',
      },
      {
        genotype: '1',
        desc: '(1 copy) Moderate enzyme activity and moderate concentrations of circulating testosterone and estradiol levels.',
        risk_level: 'increased',
      },
      {
        genotype: '2',
        desc: '(2 copies) increased enzyme activity and decreased concentrations of circulating testosterone and estradiol levels. Associated with low BMD and increased risk for osteoporosis',
        risk_level: 'normal',
      },
    ],
    rs_id: 'CNV',
  },
  CYP3A4: {
    name: 'CYP3A4',
    desc: 'CYP3A4 (Cytochrome P450 3A4) is a key enzyme in the liver and intestines that plays a crucial role in the metabolism of various substances, including drugs (including acetaminophen, codeine, cyclosporin A, diazepam, erythromycin, and chloroquine), steroids, and other xenobiotics. It is part of the cytochrome P450 family of enzymes, which are involved in the oxidative metabolism of many endogenous and exogenous compounds.',
    risk: 'Hormone-related cancers.',
    category: 'SEX HORMONES',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'GG',
        desc: 'Increased enzyme activity, increased production of 16α-OH-estrogen metabolites (have been linked to an increased risk of hormone-related cancers, particularly breast cancer and possible prostate or ovarian cancer), and also can casue  increased catabolism of testosterone.',
        risk_level: 'increased',
      },
      {
        genotype: 'AA',
        desc: 'Decreased enzyme activity, decreased production of 16α-OH-estrogen metabolites, and decreased catabolism of testosterone. howver lower CYP3A4 activity  means slower drug metabolism and potentially higher risk of drug toxicity.',
        risk_level: 'increased',
      },
      {
        genotype: 'AG',
        desc: 'Moderate  enzyme activity, Moderate production of 16α-OH-estrogen metabolites, and Moderate catabolism of testosterone.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs2740574',
  },
  MAOA: {
    name: 'MAOA',
    desc: "Monoamine oxidase A is involved in the breakdown of the neurotransmitters serotonin, epinephrine, norepinephrine, and dopamine. Signals transmitted by serotonin regulate mood, emotion, sleep, and appetite. Epinephrine and norepinephrine control the body's response to stress. Dopamine transmits signals within the brain to produce smooth physical movements.",
    risk: 'Mood disorders.',
    category: 'MOOD & BEHAVIOUR',
    bloodPanel: 'HORMONES',
    genotypes: [
      {
        genotype: 'TT',
        desc: 'Lowest MAO activity and longest dopamine half-life , significantly lower MAO-A activity, leading to slower breakdown of neurotransmitters like serotonin, dopamine, and norepinephrine in the brain, Higher risk for mood disorders (e.g., bipolar), aggression, impulsivity, conduct disorders, and substance abuse (higher with environmental stress).',
        risk_level: 'increased',
      },
      {
        genotype: 'GT',
        desc: 'Moderate MAO activity and medial dopamine half-life, Moderate risk for mood disorders, aggression, or impulsivity (higher if environmental stress is present).',
        risk_level: 'increased',
      },
      {
        genotype: 'GG',
        desc: 'Highest MAO activity and shortest dopamine half-life , Lower risk for aggression, mood disorders, or impulsivity.',
        risk_level: 'normal',
      },
    ],
    rs_id: 'rs6323',
  },
};

export const BIO_MARKER_GROUPS_WITH_GENES = {
  lipids: [
    'PSRC1',
    'SLCO1B1',
    'APOE_rs7412',
    'APOE_rs429358',
    'MLXIPL',
    'PCSK9',
    '9P21_rs10757278',
    '9P21_rs10757274',
    '9P21_rs4977574',
    'CDKN2A',
  ],
  glucose: ['TCF7L2_rs7903146', 'TCF7L2_rs12255372', 'MTNR1B', 'FOXO3', 'SIRT1'],
  renal: [],
  mineral: [],
  inflammation_Markers: [],
  vitamin: ['CYP2R1', 'VDR', 'MTHFR_rs1801133', 'MTHFR_rs1801131'],
  electrolytes: [],
  liver_Enzymes: [],
  thyroid_functions: ['DIO2'],
  hormone: ['CYP1A1', 'UGT2B15', 'CYP1B1', 'CYP17A1', 'SRD5A2', 'HTR2A', 'UGT2B17', 'CYP3A4', 'MAOA'],
  cbc: ['COMT', 'GSTP1', 'GSTT1', 'GSTM1', 'TMPRSS2', 'SOD2', 'GPx'],
};
