
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceDiversityChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceDiversityChart: React.FC<ServiceDiversityChartProps> = ({ data, isLoading }) => {
  // Add null checks to avoid "Cannot read properties of undefined" error
  const totalServices = isLoading || !data || !data.datasets || !data.datasets[0] || !data.datasets[0].data
    ? 0 
    : data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  
  return (
    <ChartCard
      title="Diversidade de Serviços por Região"
      value={isLoading ? '' : `Índice médio: ${(totalServices / (data.labels?.length || 1)).toFixed(1)}`}
      isLoading={isLoading}
    >
      {!isLoading && data && data.datasets && data.datasets[0] && (
        <Bar 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    return `${label}: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 1
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ServiceDiversityChart;
