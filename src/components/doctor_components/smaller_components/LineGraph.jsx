import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const LineGraph = ({ dates, values, units, label }) => {
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: label || (units ? `Value (${units})` : 'Value'),
        data: values,
        borderColor: '#5558E4',
        backgroundColor: 'rgba(75, 192, 255, 0.37)',
        borderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 5,
          boxHeight: 5,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: units ? `Value (${units})` : 'Value',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return <Line data={chartData} options={options} className="w-full h-full" />;
};

LineGraph.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  units: PropTypes.string,
  label: PropTypes.string,
};

export default LineGraph;
