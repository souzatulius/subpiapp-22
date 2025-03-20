
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DistrictDistributionChartProps {
  data: any;
  isLoading: boolean;
}

const DistrictDistributionChart: React.FC<DistrictDistributionChartProps> = ({ data, isLoading }) => {
  const totalOccurrences = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
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
      title="Distribuição das Solicitações por Distrito"
      value={isLoading ? 'Carregando...' : `${totalOccurrences} solicitações`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default DistrictDistributionChart;
