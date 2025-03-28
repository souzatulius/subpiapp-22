
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TopCompaniesChartProps {
  data: any;
  isLoading: boolean;
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data, isLoading }) => {
  // Add null checks to avoid "Cannot read properties of undefined" error
  const totalOrders = isLoading || !data || !data.datasets || !data.datasets[0] || !data.datasets[0].data 
    ? 0 
    : data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  
  return (
    <ChartCard
      title="Empresas com mais ordens concluídas"
      value={isLoading ? '' : `Total: ${totalOrders}`}
      isLoading={isLoading}
    >
      {!isLoading && data && data.datasets && data.datasets[0] && (
        <Bar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    return `${label}: ${context.parsed.x}`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default TopCompaniesChart;
