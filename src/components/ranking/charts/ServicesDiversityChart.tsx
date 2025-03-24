
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServicesDiversityChartProps {
  data: any;
  isLoading: boolean;
}

const ServicesDiversityChart: React.FC<ServicesDiversityChartProps> = ({ data, isLoading }) => {
  // Calculate average diversity
  const avgDiversity = isLoading || !data || !data.datasets || !data.datasets[1]?.data ? 
    0 : 
    Math.round(data.datasets[1].data.reduce((sum: number, val: number) => sum + val, 0) / data.datasets[1].data.length);
  
  return (
    <ChartCard
      title="Diversidade de Serviços por Distrito"
      value={isLoading ? '' : `${avgDiversity} tipos`}
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
                  text: 'Tipos distintos'
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ServicesDiversityChart;
