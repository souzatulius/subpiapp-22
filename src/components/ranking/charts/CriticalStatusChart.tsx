
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface CriticalStatusChartProps {
  data: any;
  isLoading: boolean;
}

const CriticalStatusChart: React.FC<CriticalStatusChartProps> = ({ data, isLoading }) => {
  const totalOrders = isLoading ? 0 : data?.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  
  return (
    <ChartCard
      title="Status críticos"
      value={isLoading ? '' : `Total: ${totalOrders}`}
      isLoading={isLoading}
    >
      {!isLoading && data && (
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
                    const value = context.parsed || 0;
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

export default CriticalStatusChart;
