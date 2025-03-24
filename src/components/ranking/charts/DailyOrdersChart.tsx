
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DailyOrdersChartProps {
  data: any;
  isLoading: boolean;
}

const DailyOrdersChart: React.FC<DailyOrdersChartProps> = ({ data, isLoading }) => {
  // Calculate average daily volume
  const averageVolume = isLoading || !data || !data.datasets || !data.datasets[0]?.data.length === 0 ? 
    0 : 
    Math.round(data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0) / data.datasets[0].data.length);
  
  return (
    <ChartCard
      title="Volume Diário de Novas Ordens"
      value={isLoading ? '' : `Média: ${averageVolume}/dia`}
      isLoading={isLoading}
    >
      {!isLoading && data && (
        <Line 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
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
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
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
