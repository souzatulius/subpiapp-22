
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusDistributionChartProps {
  data: any;
  isLoading: boolean;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data, isLoading }) => {
  const totalStatus = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <ChartCard
      title="Status das Solicitações"
      value={isLoading ? 'Carregando...' : `${totalStatus} solicitações`}
      isLoading={isLoading}
    >
      {data && <Pie data={data} options={options} />}
    </ChartCard>
  );
};

export default StatusDistributionChart;
