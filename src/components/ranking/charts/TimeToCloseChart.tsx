
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TimeToCloseChartProps {
  data: any;
  isLoading: boolean;
}

const TimeToCloseChart: React.FC<TimeToCloseChartProps> = ({ data, isLoading }) => {
  // Check if data exists before accessing it
  const averageTime = isLoading || !data || !data.datasets || !data.datasets[0]?.data ? 
    '' : 
    `${Math.round(data.datasets[0].data[1] || 0)} dias`;
  
  return (
    <ChartCard
      title="Tempo até Fechamento"
      value={averageTime}
      isLoading={isLoading}
    >
      {!isLoading && data && (
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
                title: {
                  display: true,
                  text: 'Dias'
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default TimeToCloseChart;
