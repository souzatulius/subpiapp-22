
import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, LineElement);

interface SGZChartProps {
  type: 'bar' | 'pie' | 'line';
  data: any;
  options?: any;
}

const SGZChart: React.FC<SGZChartProps> = ({ type, data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Dados não disponíveis</p>
      </div>
    );
  }

  switch (type) {
    case 'bar':
      return <Bar data={data} options={mergedOptions} />;
    case 'pie':
      return <Pie data={data} options={mergedOptions} />;
    case 'line':
      return <Line data={data} options={mergedOptions} />;
    default:
      return <Bar data={data} options={mergedOptions} />;
  }
};

export default SGZChart;
