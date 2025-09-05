import React from 'react';

import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const GaugeChart = ({ value = 75, maxValue = 100 }) => {
  const remainingValue = maxValue - value;

  const needleValue = (value / maxValue) * 180;

  const data = {
    datasets: [
      {
        data: [value, remainingValue],
        backgroundColor: [getColor(value, maxValue), '#e0e0e0'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270, 
        cutout: '75%', 
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    events: [],
  };

  function getColor(value, max) {
    const percentage = (value / max) * 100;
    if (percentage <= 50) return '#FFB224';
    if (percentage > 50 && percentage <= 75) return '#73CEF8'; //
    return '#BF7BD3'; 
  }

  return (
    <div style={{ position: 'relative', width: '95%', height: '70%' }}>
      <Doughnut data={data} options={options} />
      {/* Value display */}
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '34px',
          fontWeight: 'bold',
          color: '#333',
          zIndex: 2,
        }}
      >
        {value}%
      </div>
    </div>
  );
};

export default GaugeChart;
