import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const HealthDonut = ({ optimalVal, abnormalVal, normalVal, text }) => {
  let data = [
    {
      label: 'Optimal',
      value: optimalVal,
      color: '#BF7BD3',
    },
    {
      label: 'Abnormal',
      value: abnormalVal,
      color: '#FFB224',
    },
    {
      label: 'Normal',
      value: normalVal,
      color: '#73CEF8',
    },
  ];

  const options = {
    plugins: {
      responsive: true,
      legend: {
        position: 'top',
        display: false,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 5,
          boxHeight: 5,
        },
      },
    },
    cutout: '80%',
  };

  const finalData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => Math.round(item.value)),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(data.length).fill(true),
      },
    ],
  };

  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 185).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'top';

        // Draw Text
        var text1 = text;
        var textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
        var textY1 = height / 2.2;
        ctx.fillText(text1, textX1, textY1);

        ctx.save();
      },
    },
  ];

  return <Doughnut data={finalData} options={options} plugins={plugins} />;
};

HealthDonut.propTypes = {
  optimalVal: PropTypes.number.isRequired,
  abnormalVal: PropTypes.number.isRequired,
  normalVal: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default HealthDonut;
