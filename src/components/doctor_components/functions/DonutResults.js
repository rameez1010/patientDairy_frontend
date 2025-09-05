// Scores for each category
const scores = {
  optimal: 100,
  normal: 75,
  abnormal: 50,
};

const lipidsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Lipids
  const thresholds = {
    cholesterol: {
      optimal: (value) => value <= 5.2,
      abnormal: (value) => value > 5.2,
    },
    ldlCholesterol: {
      optimal: (value) => value <= 3.5,
      abnormal: (value) => value > 3.5,
    },
    hdlCholesterol: {
      optimal: (value) => value > 2,
      normal: (value) => value >= 1.3 && value <= 2,
      abnormal: (value) => value < 1.3,
    },
    triglyceride: {
      optimal: (value) => value <= 1.0,
      normal: (value) => value > 1.0 && value <= 1.7,
      abnormal: (value) => value > 1.7,
    },
    nonHdlCholesterol: {
      optimal: (value) => value <= 3.5,
      normal: (value) => value > 3.5 && value <= 4.2,
      abnormal: (value) => value > 4.2,
    },
    cholesterolToHdlRatio: {
      optimal: (value) => value <= 3,
      normal: (value) => value > 3 && value <= 6,
      abnormal: (value) => value > 6,
    },
  };
  // Function to evaluate a single lipid result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each lipid result
  if (recentLab?.cholesterol) {
    evaluateResult(recentLab?.cholesterol, thresholds.cholesterol);
  }
  if (recentLab?.ldlCholesterol) {
    evaluateResult(recentLab?.ldlCholesterol, thresholds.ldlCholesterol);
  }
  if (recentLab?.hdlCholesterol) {
    evaluateResult(recentLab?.hdlCholesterol, thresholds.hdlCholesterol);
  }
  if (recentLab?.triglyceride) {
    evaluateResult(recentLab?.triglyceride, thresholds.triglyceride);
  }
  if (recentLab?.nonHdlCholesterol) {
    evaluateResult(recentLab?.nonHdlCholesterol, thresholds.nonHdlCholesterol);
  }
  if (recentLab?.cholesterolToHdlRatio) {
    evaluateResult(recentLab?.cholesterolToHdlRatio, thresholds.cholesterolToHdlRatio);
  }

  const averageScore = (totalScore / totalTests).toFixed(0);

  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const vitaminsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Vitamins
  const thresholds = {
    vitaminB12: {
      optimal: (value) => value >= 800.0,
      normal: (value) => value >= 138.0 && value <= 652.0,
      abnormal: (value) => value < 138.0 || (value > 652.0 && value < 800.0),
    },
    vitaminD: {
      optimal: (value) => value >= 200 && value <= 250,
      normal: (value) => value > 76 && value < 200,
      abnormal: (value) => value > 250 || value < 76,
    },
    vitaminA: {
      optimal: (value) => value <= 3.0 && value >= 1.99,
      normal: (value) => (value > 3 && value <= 3.5) || ((value) => 1.2 && value < 1.99),
      abnormal: (value) => value > 3.5 && value < 1.2,
    },
  };
  // Function to evaluate a single lipid result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each vitamin result
  if (recentLab?.vitaminA) {
    evaluateResult(recentLab?.vitaminA, thresholds.vitaminA);
  }
  if (recentLab?.vitaminB12) {
    evaluateResult(recentLab?.vitaminB12, thresholds.vitaminB12);
  }
  if (recentLab?.vitaminD) {
    evaluateResult(recentLab?.vitaminD, thresholds.vitaminD);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const mineralsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Minerals
  const thresholds = {
    calcium: {
      optimal: (value) => value >= 2.2 && value <= 2.45,
      normal: (value) => (value > 2.45 && value <= 2.6) || (value >= 2.15 && value < 2.2),
      abnormal: (value) => value < 2.15 || value > 2.6,
    },
    magnesium: {
      optimal: (value) => value >= 0.9 && value <= 1.1,
      normal: (value) => value >= 0.65 && value < 0.9,
      abnormal: (value) => value < 0.65 || value > 1.1,
    },
    zinc: {
      optimal: (value) => value <= 16.8 && value >= 12.0,
      normal: (value) => value >= 7.8 && value < 12.0,
      abnormal: (value) => value > 16.8 || value < 7.8,
    },
    ferritin: {
      optimal: (value) => value >= 200 && value <= 90,
      normal: (value) => (value >= 12 && value < 90.0) || (value > 200 && value <= 272.0),
      abnormal: (value) => value < 12.0 || value > 272.0,
    },
    seleniumPlasma: {
      optimal: (value) => value <= 160.4 && value >= 120.0,
      normal: (value) => value >= 105.3 && value < 120.0,
      abnormal: (value) => value > 160.4 || value < 105.3,
    },
  };
  // Function to evaluate a single lipid result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each mineral result
  if (recentLab?.calcium) {
    evaluateResult(recentLab?.calcium, thresholds.calcium);
  }
  if (recentLab?.magnesium) {
    evaluateResult(recentLab?.magnesium, thresholds.magnesium);
  }
  if (recentLab?.zinc) {
    evaluateResult(recentLab?.zinc, thresholds.zinc);
  }
  if (recentLab?.ferritin) {
    evaluateResult(recentLab?.ferritin, thresholds.ferritin);
  }
  if (recentLab?.seleniumPlasma) {
    evaluateResult(recentLab?.seleniumPlasma, thresholds.seleniumPlasma);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const renalsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Renal
  const thresholds = {
    creatinine: {
      optimal: (value) => value >= 50.0 && value <= 110.0,
      abnormal: (value) => value > 110.0 || value < 50.0,
    },
    eGFR: {
      optimal: (value) => value >= 99.0,
      normal: (value) => value >= 60 && value < 99.0,
      abnormal: (value) => value < 60,
    },
  };
  // Function to evaluate a single lipid result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.creatinine) {
    evaluateResult(recentLab?.creatinine, thresholds.creatinine);
  }
  if (recentLab?.eGFR) {
    evaluateResult(recentLab?.eGFR, thresholds.eGFR);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const inflamationsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Inflamation
  const thresholds = {
    sedimentationRate: {
      optimal: (value) => value >= 2.0 && value <= 10.0,
      normal: (value) => value > 10.0 && value <= 30.0,
      abnormal: (value) => value > 30.0 || value < 2.0,
    },
    cReactiveProtein: {
      optimal: (value) => value <= 1.0,
      normal: (value) => value > 1 && value <= 4.0,
      abnormal: (value) => value > 4.0,
    },
    fibrinoginQ: {
      optimal: (value) => value >= 2.0 && value <= 3.0,
      normal: (value) => value > 3.0 && value <= 3.9,
      abnormal: (value) => value > 3.9 || value < 2.0,
    },
    creatineCK: {
      optimal: (value) => value >= 65.0 && value <= 165.0,
      normal: (value) => (value >= 33.0 && value < 65.0) || (value > 135.0 && value <= 165.0),
      abnormal: (value) => value > 165.0 || value < 33.0,
    },
    uricAcid: {
      optimal: (value) => value >= 178.0 && value <= 280.0,
      normal: (value) => (value >= 150.0 && value < 178.0) || (value > 280.0 && value <= 450.0),
      abnormal: (value) => value > 450.0 || value < 150.0,
    },
  };
  // Function to evaluate a single Inflamation result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.sedimentationRate) {
    evaluateResult(recentLab?.sedimentationRate, thresholds.sedimentationRate);
  }
  if (recentLab?.cReactiveProtein) {
    evaluateResult(recentLab?.cReactiveProtein, thresholds.cReactiveProtein);
  }
  if (recentLab?.fibrinoginQ) {
    evaluateResult(recentLab?.fibrinoginQ, thresholds.fibrinoginQ);
  }
  if (recentLab?.creatineCK) {
    evaluateResult(recentLab?.creatineCK, thresholds.creatineCK);
  }
  if (recentLab?.uricAcid) {
    evaluateResult(recentLab?.uricAcid, thresholds.uricAcid);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const glucosesScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Glucose
  const thresholds = {
    hbA1c: {
      optimal: (value) => value >= 3.6 && value <= 5.3,
      normal: (value) => (value > 5.3 && value <= 6.0) || value < 4.6,
      abnormal: (value) => value > 6.0,
    },
    insulin: {
      optimal: (value) => value >= 15.0 && value <= 60.0,
      normal: (value) => value > 60 && value <= 180.0,
      abnormal: (value) => value > 180.0 || value < 15,
    },
    glucose: {
      optimal: (value) => value >= 3.6 && value <= 5.0,
      normal: (value) => value > 5 && value <= 6.0,
      abnormal: (value) => value > 6.0 || value < 3.6,
    },
  };
  // Function to evaluate a single glucose result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.hbA1c) {
    evaluateResult(recentLab?.hbA1c, thresholds.hbA1c);
  }
  if (recentLab?.insulin) {
    evaluateResult(recentLab?.insulin, thresholds.insulin);
  }
  if (recentLab?.glucose) {
    evaluateResult(recentLab?.glucose, thresholds.glucose);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const liversScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Inflamation
  const thresholds = {
    alkalinePhosphate: {
      optimal: (value) => value >= 45.0 && value <= 100.0,
      normal: (value) => (value >= 35.0 && value < 45.0) || (value > 100.0 && value <= 122.0),
      abnormal: (value) => value > 122.0 || value < 35.0,
    },
    alanineTransaminase: {
      optimal: (value) => value <= 46.0,
      abnormal: (value) => value > 46.0,
    },
    aspartateTransaminase: {
      optimal: (value) => value >= 10.0 && value <= 26.0,
      normal: (value) => (value > 26.0 && value <= 30) || value < 10.0,
      abnormal: (value) => value > 30.0,
    },
    gammaGlutamylTransferase: {
      optimal: (value) => value >= 10.0 && value <= 30.0,
      normal: (value) => (value > 30.0 && value <= 44) || value < 10.0,
      abnormal: (value) => value > 44.0,
    },
    totalBilirubin: {
      optimal: (value) => value >= 5.0 && value <= 15.0,
      normal: (value) => (value > 15.0 && value <= 20) || value < 5.0,
      abnormal: (value) => value > 52.0 || value < 35,
    },
    albumin: {
      optimal: (value) => value >= 45.0 && value <= 52.0,
      normal: (value) => value >= 35.0 && value < 45,
      abnormal: (value) => value > 20.0,
    },
  };
  // Function to evaluate a single Inflamation result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.alkalinePhosphate) {
    evaluateResult(recentLab?.alkalinePhosphate, thresholds.alkalinePhosphate);
  }
  if (recentLab?.alanineTransaminase) {
    evaluateResult(recentLab?.alanineTransaminase, thresholds.alanineTransaminase);
  }
  if (recentLab?.aspartateTransaminase) {
    evaluateResult(recentLab?.aspartateTransaminase, thresholds.aspartateTransaminase);
  }
  if (recentLab?.gammaGlutamylTransferase) {
    evaluateResult(recentLab?.gammaGlutamylTransferase, thresholds.gammaGlutamylTransferase);
  }
  if (recentLab?.totalBilirubin) {
    evaluateResult(recentLab?.totalBilirubin, thresholds.totalBilirubin);
  }
  if (recentLab?.albumin) {
    evaluateResult(recentLab?.albumin, thresholds.albumin);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const thyroidsScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Inflamation
  const thresholds = {
    thyroidStimulatingHormone: {
      optimal: (value) => value >= 0.32 && value <= 1.0,
      normal: (value) => value > 1.0 && value <= 4.0,
      abnormal: (value) => value > 4.0 || value < 0.32,
    },
    freeT4: {
      optimal: (value) => value >= 10.0 && value <= 23.0,
      normal: (value) => value >= 9.0 && value < 10.0,
      abnormal: (value) => value > 23.0 || value < 9.0,
    },
    freeT3: {
      optimal: (value) => value >= 4.8 && value <= 6.0,
      normal: (value) => value >= 3.4 && value < 4.8,
      abnormal: (value) => value > 6.0 || value < 3.4,
    },
    reverseT3: {
      optimal: (value) => value >= 10.0 && value <= 16.0,
      normal: (value) => (value > 16.0 && value <= 25) || (value < 10.0 && value >= 8),
      abnormal: (value) => value > 25.0 || value < 8,
    },
    thyroidPeroxidaseAntibody: {
      optimal: (value) => value <= 35.0,
      abnormal: (value) => value > 35.0,
    },
    thyroglobulinAntibodies: {
      optimal: (value) => value <= 41.0,
      abnormal: (value) => value > 41.0,
    },
  };
  // Function to evaluate a single Inflamation result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.thyroidStimulatingHormone) {
    evaluateResult(recentLab?.thyroidStimulatingHormone, thresholds.thyroidStimulatingHormone);
  }
  if (recentLab?.freeT4) {
    evaluateResult(recentLab?.freeT4, thresholds.freeT4);
  }
  if (recentLab?.freeT3) {
    evaluateResult(recentLab?.freeT3, thresholds.freeT3);
  }
  if (recentLab?.reverseT3) {
    evaluateResult(recentLab?.reverseT3, thresholds.reverseT3);
  }
  if (recentLab?.thyroidPeroxidaseAntibody) {
    evaluateResult(recentLab?.thyroidPeroxidaseAntibody, thresholds.thyroidPeroxidaseAntibody);
  }
  if (recentLab?.thyroglobulinAntibodies) {
    evaluateResult(recentLab?.thyroglobulinAntibodies, thresholds.thyroglobulinAntibodies);
  }

  const averageScore = (totalScore / totalTests).toFixed(0);

  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

const hormonesScore = (recentLab) => {
  let optimal = 0;
  let normal = 0;
  let abnormal = 0;
  let totalTests = 0;
  let totalScore = 0;

  // Define thresholds for optimal, normal, and abnormal values Inflamation
  const thresholds = {
    follitropin: {
      optimal: (value) => value >= 3.0 && value <= 15.0,
      abnormal: (value) => value > 15.0 || value < 3.0,
    },
    lutropin: {
      optimal: (value) => value >= 2.0 && value <= 12.0,
      abnormal: (value) => value > 12.0 || value < 2.0,
    },
    estradiol: {
      optimal: (value) => value >= 921.0 && value <= 77.0,
      abnormal: (value) => value > 921.0 || value < 77.0,
    },
    progesterone: {
      optimal: (value) => value >= 1.7,
      abnormal: (value) => value < 1.7,
    },
    testosterone: {
      optimal: (value) => value <= 10.0 && value >= 3.0,
      normal: (value) => value <= 2,
      abnormal: (value) => value > 10.0 || (value < 3 && value > 2),
    },
    testosteroneFree: {
      optimal: (value) => value <= 36.0 && value >= 26.0,
      normal: (value) => value < 26,
      abnormal: (value) => value > 36.0,
    },
    dhea: {
      optimal: (value) => value <= 10.0 && value >= 5.0,
      normal: (value) => value < 5 && value >= 2.68,
      abnormal: (value) => value > 10.0 || value < 2.68,
    },
    prolactin: {
      optimal: (value) => value >= 5.0 && value <= 27.0,
      abnormal: (value) => value > 27.0 || value < 5.0,
    },
    sexHormoneBindGlobulin: {
      optimal: (value) => value <= 180.0 && value >= 80.0,
      normal: (value) => value < 80 && value >= 20.0,
      abnormal: (value) => value > 180.0 || value < 20.0,
    },
  };
  // Function to evaluate a single Inflamation result
  const evaluateResult = (value, threshold) => {
    let score = 0;
    if (threshold.optimal(value)) {
      score = scores.optimal;
      optimal++;
    } else if (threshold.normal && threshold.normal(value)) {
      score = scores.normal;
      normal++;
    } else if (threshold.abnormal(value)) {
      score = scores.abnormal;
      abnormal++;
    }
    totalScore += score;
    totalTests++;
  };

  // Check each renal result
  if (recentLab?.follitropin) {
    evaluateResult(recentLab?.follitropin, thresholds.follitropin);
  }
  if (recentLab?.lutropin) {
    evaluateResult(recentLab?.lutropin, thresholds.lutropin);
  }
  if (recentLab?.estradiol) {
    evaluateResult(recentLab?.estradiol, thresholds.estradiol);
  }
  if (recentLab?.progesterone) {
    evaluateResult(recentLab?.progesterone, thresholds.progesterone);
  }
  if (recentLab?.testosterone) {
    evaluateResult(recentLab?.testosterone, thresholds.testosterone);
  }
  if (recentLab?.testosteroneFree) {
    evaluateResult(recentLab?.testosteroneFree, thresholds.testosteroneFree);
  }
  if (recentLab?.dhea) {
    evaluateResult(recentLab?.dhea, thresholds.dhea);
  }
  if (recentLab?.prolactin) {
    evaluateResult(recentLab?.prolactin, thresholds.prolactin);
  }
  if (recentLab?.sexHormoneBindGlobulin) {
    evaluateResult(recentLab?.sexHormoneBindGlobulin, thresholds.sexHormoneBindGlobulin);
  }
  const averageScore = (totalScore / totalTests).toFixed(0);
  return {
    optimal,
    normal,
    abnormal,
    averageScore,
  };
};

export {
  lipidsScore,
  vitaminsScore,
  mineralsScore,
  renalsScore,
  inflamationsScore,
  glucosesScore,
  liversScore,
  thyroidsScore,
  hormonesScore,
};
