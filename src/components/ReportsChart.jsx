import React from 'react';

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BiBorderRadius } from 'react-icons/bi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
  barPercentage: 0.4,
};

const labels = [
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'January',
  'February',
  'March',
  'April',
  'May',
];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 2',
      data: [30, 40, 50, 90, 70, 80, 90, 100, 80, 70, 120],
      backgroundColor: 'rgb(93, 103, 241)',
      borderRadius: 20,
      borderSkipped: false,
    },
  ],
};

export function ReportsChart() {
  return (
    <div className="w-full max-h-[500px] p-2">
      <Bar options={options} data={data} className="max-h-[350px]" />
    </div>
  );
}
