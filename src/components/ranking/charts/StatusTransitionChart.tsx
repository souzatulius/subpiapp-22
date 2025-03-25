
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusTransitionChartProps {
  data: any;
  isLoading: boolean;
}

const StatusTransitionChart: React.FC<StatusTransitionChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Transição de status ao longo dos dias"
      value={isLoading ? '' : 'Evolução temporal'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Line
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: false,
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

export default StatusTransitionChart;
