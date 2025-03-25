
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DailyDemandsChartProps {
  data: any;
  isLoading: boolean;
}

const DailyDemandsChart: React.FC<DailyDemandsChartProps> = ({ data, isLoading }) => {
  const totalDemands = isLoading ? '' : 
    `Total: ${data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}`;
  
  return (
    <ChartCard
      title="Volume diário de novas demandas"
      value={totalDemands}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Line 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Novas ordens: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              y: {
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

export default DailyDemandsChart;
