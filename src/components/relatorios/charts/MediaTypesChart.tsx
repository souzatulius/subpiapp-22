
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface MediaTypesChartProps {
  data: any;
  isLoading: boolean;
}

const MediaTypesChart: React.FC<MediaTypesChartProps> = ({ data, isLoading }) => {
  const totalMedia = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <ChartCard
      title="Tipos de Mídia Mais Demandantes"
      value={isLoading ? 'Carregando...' : `${totalMedia} veículos`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default MediaTypesChart;
