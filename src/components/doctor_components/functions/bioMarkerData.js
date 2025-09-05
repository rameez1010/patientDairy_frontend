const biomarkerRanges = {
  cholesterol: {
    normal: [0, 3.5],
    optimal: [3.5, 5.2],
    abnormal: [5.2, 25.0],
  },
  ldl_cholesterol: {
    optimal: [0, 3.5],
    abnormal: [3.5, 12.0],
  },
  hdl_cholesterol: {
    normal: [1.0, 2.0],
    optimal: [2.0, 4.0],
    abnormal: [0, 1.0],
  },
  non_hdl_cholesterol: {
    optimal: [0, 3.5],
    normal: [3.5, 4.2],
    abnormal: [4.2, 8.0],
  },
  triglycerides: {
    normal: [0, 0.4, 0.99, 1.7],
    optimal: [0.4, 0.99],
    abnormal: [0.99, 12.0],
  },
  cholesterol_hdl_ratio: {
    optimal: [0, 3],
    normal: [3, 6],
    abnormal: [6, 12],
  },
  zinc: {
    normal: [7.8, 12.0],
    optimal: [12.0, 16.8],
    abnormal: [0, 7.8, 16.8, 100],
  },
  calcium: {
    normal: [2.15, 2.22, 2.45, 2.6],
    optimal: [2.22, 2.45],
    abnormal: [0, 2.15, 2.6, 20],
  },
  glucoseFasting: {
    optimal: [0, 5],
    normal: [5, 6],
    abnormal: [6, 12],
  },
  hba1c: {
    optimal: [0, 4.6],
    normal: [4.6, 5.3],
    elevated: [5.3, 6],
    abnormal: [6, 12],
  },
  insulinFasting: {
    optimal: [0, 60],
    normal: [60, 180],
    elevated: [180, 300],
  },
  creatinine: {
    low: [0, 67],
    normal: [67, 117],
    high: [117, 250],
  },
  eGFR: {
    abnormal: [0, 60],
    normal: [60, 100],
    optimal: [100, 300],
  },
};

const getStatus = (biomarkerName, value) => {
  const ranges = biomarkerRanges[biomarkerName];

  if (!ranges) return 'Unknown Biomarker'; // If the biomarker is not found in the data

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return 'Invalid Value'; // Handle invalid value
  }

  // Iterate through the ranges and determine where the value fits
  for (const [status, range] of Object.entries(ranges)) {
    const sortedRange = range.slice().sort((a, b) => a - b); // Sort the range to handle unordered values

    if (status === 'normal') {
      // Normal: If the value is within either of the two intervals
      if (
        (value >= sortedRange[0] && value <= sortedRange[1]) ||
        (value >= sortedRange[2] && value <= sortedRange[3])
      ) {
        return 'Normal'; // Capitalize first letter
      }
    }

    if (status === 'optimal') {
      // Optimal: If the value is between the two numbers
      if (value >= sortedRange[0] && value <= sortedRange[1]) {
        return 'Optimal';
      }
    }

    if (status === 'abnormal') {
      // Abnormal: If the value is outside of the normal intervals
      if (value < sortedRange[0] || value > sortedRange[3] || value < sortedRange[1] || value > sortedRange[2]) {
        return 'Abnormal';
      }
    }
  }

  return 'Out of Range'; // If the value doesn't fall into any range
};

export { biomarkerRanges, getStatus };
