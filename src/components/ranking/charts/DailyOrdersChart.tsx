
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DailyOrdersChartProps {
  data: any;
  isLoading: boolean;
}

const DailyOrdersChart: React.FC<DailyOrdersChartProps> = ({ data, isLoading }) => {
  // Calculate the total or average if appropriate
  const chartValue = isLoading || !data || !data.datasets || data.datasets[0]?.data?.length === 0 
    ? '' 
    : `${data.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0)} ordens`;
  
  return (
    <ChartCard
      title="Volume Diário de Novas Ordens"
      value={chartValue}
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
                title: {
                  display: true,
                  text: 'Quantidade'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Data'
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default DailyOrdersChart;
