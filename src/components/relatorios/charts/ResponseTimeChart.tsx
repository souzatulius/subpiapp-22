
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResponseTimeChartProps {
  data: any;
  isLoading: boolean;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data, isLoading }) => {
  const averageTime = !isLoading && data ? (data.datasets[0].data[0]).toFixed(1) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Dias'
        }
      }
    }
  };

  return (
    <ChartCard
      title="Tempo Médio de Resposta"
      value={isLoading ? 'Carregando...' : `${averageTime} dias`}
      isLoading={isLoading}
    >
      {data && <Line data={data} options={options} />}
    </ChartCard>
  );
};

export default ResponseTimeChart;
