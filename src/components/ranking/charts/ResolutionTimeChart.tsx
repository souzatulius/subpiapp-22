
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResolutionTimeChartProps {
  data: any;
  isLoading: boolean;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({ data, isLoading }) => {
  // Check if data and data.datasets exist before accessing them
  const averageTime = isLoading || !data || !data.datasets || data.datasets[0]?.data?.length === 0 ? 
    '' : 
    `${Math.round(data.datasets[0]?.data[0] || 0)} dias`;
  
  return (
    <ChartCard
      title="Tempo médio de atendimento"
      value={averageTime}
      isLoading={isLoading}
    >
      {!isLoading && data && (
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
