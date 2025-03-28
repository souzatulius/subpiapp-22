
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceDiversityChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceDiversityChart: React.FC<ServiceDiversityChartProps> = ({ data, isLoading }) => {
  // Safely check if data exists and has the required properties
  const hasValidData = !isLoading && data && data.datasets && Array.isArray(data.datasets);
  
  return (
    <ChartCard
      title="Diversidade de serviços por departamento"
      value={isLoading ? '' : 'Total: 52'}
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

export default ServiceDiversityChart;
