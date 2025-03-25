
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResolutionTimeChartProps {
  data: any;
  isLoading: boolean;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({ data, isLoading }) => {
  const averageTime = isLoading ? '' : `${data.datasets[0].data[0]} dias`;
  
  return (
    <ChartCard
      title="Tempo médio de atendimento"
      value={averageTime}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Line 
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

export default ResolutionTimeChart;
