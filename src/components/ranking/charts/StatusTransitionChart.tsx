
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
          data={{
            ...data,
            datasets: data.datasets.map((dataset, index) => ({
              ...dataset,
              borderColor: index === 0 ? '#f97316' : // orange-500
                           index === 1 ? '#fb923c' : // orange-400
                           index === 2 ? '#fdba74' : // orange-300
                           index === 3 ? '#fed7aa' : // orange-200
                           index === 4 ? '#ffedd5' : // orange-100
                           '#71717a', // gray-500 for any additional datasets
              backgroundColor: index === 0 ? 'rgba(249, 115, 22, 0.2)' : // orange-500
                              index === 1 ? 'rgba(251, 146, 60, 0.2)' : // orange-400
                              index === 2 ? 'rgba(253, 186, 116, 0.2)' : // orange-300
                              index === 3 ? 'rgba(254, 215, 170, 0.2)' : // orange-200
                              index === 4 ? 'rgba(255, 237, 213, 0.2)' : // orange-100
                              'rgba(113, 113, 122, 0.2)', // gray-500 for any additional datasets
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: index === 0 ? '#f97316' : // orange-500
                                   index === 1 ? '#fb923c' : // orange-400
                                   index === 2 ? '#fdba74' : // orange-300
                                   index === 3 ? '#fed7aa' : // orange-200
                                   index === 4 ? '#ffedd5' : // orange-100
                                   '#71717a', // gray-500 for any additional datasets
            }))
          }}
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
            animation: {
              duration: 1000,
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default StatusTransitionChart;
