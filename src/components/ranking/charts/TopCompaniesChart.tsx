
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TopCompaniesChartProps {
  data: any;
  isLoading: boolean;
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data, isLoading }) => {
  // Create a fallback empty data structure when data is not available
  const safeData = React.useMemo(() => {
    if (!data || !data.datasets) {
      return {
        labels: [],
        datasets: [{
          label: 'No data',
          data: [],
          backgroundColor: '#ccc',
        }]
      };
    }
    return data;
  }, [data]);
  
  // Calculate total orders safely
  const totalOrders = React.useMemo(() => {
    if (isLoading || !data || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      return 0;
    }
    return data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  }, [data, isLoading]);
  
  return (
    <ChartCard
      title="Empresas com mais ordens concluídas"
      value={isLoading ? '' : `Total: ${totalOrders}`}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar 
          data={safeData}
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
