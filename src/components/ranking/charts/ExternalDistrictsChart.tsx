
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ExternalDistrictsChartProps {
  data: any;
  isLoading: boolean;
}

const ExternalDistrictsChart: React.FC<ExternalDistrictsChartProps> = ({ data, isLoading }) => {
  const totalOrders = isLoading ? '' : 
    `Total: ${data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}`;
  
  return (
    <ChartCard
      title="Ordens de distritos externos"
      value={totalOrders}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Pie
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right' as const,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value * 100) / total) + '%';
                    return `${label}: ${value} (${percentage})`;
                  }
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ExternalDistrictsChart;
