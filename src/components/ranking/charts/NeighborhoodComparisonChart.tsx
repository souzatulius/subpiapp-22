
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface NeighborhoodComparisonChartProps {
  data: any;
  isLoading: boolean;
}

const NeighborhoodComparisonChart: React.FC<NeighborhoodComparisonChartProps> = ({ data, isLoading }) => {
  const totalOrders = isLoading ? '' : 
    `Total: ${data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}`;
  
  return (
    <ChartCard
      title="Comparativo por bairros"
      value={totalOrders}
      isLoading={isLoading}
    >
      {!isLoading && (
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
                    return `Ordens: ${context.parsed.x}`;
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

export default NeighborhoodComparisonChart;
