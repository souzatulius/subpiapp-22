
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusDistributionChartProps {
  data: any;
  isLoading: boolean;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data, isLoading }) => {
  // Safely check if data exists and has the required properties
  const hasValidData = !isLoading && data && data.datasets && Array.isArray(data.datasets);
  
  return (
    <ChartCard
      title="Status das ordens de serviço"
      value={isLoading ? '' : 'Comparação'}
      isLoading={isLoading}
    >
      {hasValidData && (
        <Bar 
          data={{
            labels: data.labels || [],
            datasets: data.datasets
          }}
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
