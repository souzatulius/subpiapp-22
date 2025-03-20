
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface FrequentServicesChartProps {
  data: any;
  isLoading: boolean;
}

const FrequentServicesChart: React.FC<FrequentServicesChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Serviços mais frequentes"
      value={isLoading ? '' : 'Por distrito'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default FrequentServicesChart;
