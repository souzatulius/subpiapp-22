
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface CompaniesPerformanceChartProps {
  data: any;
  isLoading: boolean;
  title?: string;
}

const CompaniesPerformanceChart: React.FC<CompaniesPerformanceChartProps> = ({ 
  data, 
  isLoading,
  title = "Empresas com Mais Ordens Concluídas"
}) => {
  // Calculate total
  const total = isLoading || !data || !data.datasets || !data.datasets[0]?.data ? 
    0 : 
    data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
  
  return (
    <ChartCard
      title={title}
      value={isLoading ? '' : `${total} ocorrências`}
      isLoading={isLoading}
    >
      {!isLoading && data && (
        <Bar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                ticks: {
                  autoSkip: false,
                  callback: function(value) {
                    const label = this.getLabelForValue(value as number);
                    // Truncate long labels
                    return label.length > 15 ? label.substring(0, 15) + '...' : label;
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

export default CompaniesPerformanceChart;
