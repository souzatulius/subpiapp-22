
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface NeighborhoodDistributionChartProps {
  data: any;
  isLoading: boolean;
}

const NeighborhoodDistributionChart: React.FC<NeighborhoodDistributionChartProps> = ({ data, isLoading }) => {
  const totalOccurrences = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <ChartCard
      title="Distribuição das Solicitações por Bairro"
      value={isLoading ? 'Carregando...' : `${totalOccurrences} solicitações`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default NeighborhoodDistributionChart;
