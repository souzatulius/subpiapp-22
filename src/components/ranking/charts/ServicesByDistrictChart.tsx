
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServicesByDistrictChartProps {
  data: any;
  isLoading: boolean;
}

const ServicesByDistrictChart: React.FC<ServicesByDistrictChartProps> = ({ data, isLoading }) => {
  // Safely check if data exists and has the required properties
  const hasValidData = !isLoading && 
                       data && 
                       data.datasets && 
                       Array.isArray(data.datasets) &&
                       data.datasets.length > 0;
  
  // Create default empty arrays for labels and datasets to prevent "map of undefined" errors
  const chartData = {
    labels: (hasValidData && data.labels) ? data.labels : [],
    datasets: (hasValidData && data.datasets) ? data.datasets : []
  };
  
  return (
    <ChartCard
      title="Serviços por distrito"
      value={isLoading ? '' : 'Diversidade'}
      isLoading={isLoading}
    >
      {hasValidData && (
        <Bar 
          data={chartData}
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

export default ServicesByDistrictChart;
