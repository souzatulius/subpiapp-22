
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceTypesChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Serviços mais solicitados"
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

export default ServiceTypesChart;
