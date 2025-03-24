
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusDistributionChartProps {
  data: any;
  isLoading: boolean;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Status das ordens de serviço"
      value={isLoading ? '' : 'Comparação'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default StatusDistributionChart;
