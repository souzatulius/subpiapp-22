
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusTimelineChartProps {
  data: any;
  isLoading: boolean;
  className?: string;
}

const StatusTimelineChart: React.FC<StatusTimelineChartProps> = ({ data, isLoading, className }) => {
  // Check if data exists before accessing it
  const totalOrders = isLoading || !data || !data.datasets ? 
    '' : 
    data.datasets.reduce((sum: number, dataset: any) => sum + (dataset.data?.[0] || 0), 0);
  
  return (
    <ChartCard
      title="Evolução Temporal por Status"
      value={totalOrders ? `${totalOrders} ocorrências` : ''}
      isLoading={isLoading}
      className={className}
    >
      {!isLoading && data && (
        <Line 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: true
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

export default StatusTimelineChart;
