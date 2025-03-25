
import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { NoDataMessage } from '../charts/NoDataMessage';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

interface SGZChartProps {
  type: 'bar' | 'pie' | 'line';
  data: any;
}

const SGZChart: React.FC<SGZChartProps> = ({ type, data }) => {
  // Check if data is valid for rendering
  const isDataValid = data && 
    data.labels && 
    data.labels.length > 0 && 
    data.datasets && 
    data.datasets.length > 0 &&
    data.datasets[0].data && 
    data.datasets[0].data.length > 0;

  if (!isDataValid) {
    return <NoDataMessage message="Sem dados para exibir" />;
  }

  // Common options for all chart types
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  // Bar chart options
  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Render the appropriate chart type
  switch (type) {
    case 'bar':
      return <Bar data={data} options={barOptions} />;
    case 'pie':
      return <Pie data={data} options={commonOptions} />;
    case 'line':
      return <Line data={data} options={barOptions} />;
    default:
      return <NoDataMessage message="Tipo de gráfico não suportado" />;
  }
};

export default SGZChart;
