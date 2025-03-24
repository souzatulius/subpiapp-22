
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface CriticalStatusChartProps {
  data: any;
  isLoading: boolean;
}

const CriticalStatusChart: React.FC<CriticalStatusChartProps> = ({ data, isLoading }) => {
  // Extract total critical orders
  const totalCritical = isLoading || !data || !data.datasets || !data.datasets[0]?.data ? 
    0 : 
    data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
  
  return (
    <ChartCard
      title="Status Críticos (PREPLAN/PRECANC)"
      value={isLoading ? '' : `${totalCritical} ocorrências`}
      isLoading={isLoading}
    >
      {!isLoading && data && (
        <Bar 
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
                type: 'linear',
                position: 'left',
                title: {
                  display: true,
                  text: 'Quantidade'
                }
              },
              y1: {
                beginAtZero: true,
                type: 'linear',
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
                title: {
                  display: true,
                  text: 'Dias parado'
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
