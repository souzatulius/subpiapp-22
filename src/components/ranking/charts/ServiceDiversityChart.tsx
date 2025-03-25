
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceDiversityChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceDiversityChart: React.FC<ServiceDiversityChartProps> = ({ data, isLoading }) => {
  const totalServices = isLoading ? '' : 
    `Total: ${data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)}`;
  
  return (
    <ChartCard
      title="Diversidade de serviços por departamento"
      value={totalServices}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
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
                    return `Tipos de serviço: ${context.parsed.y}`;
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

export default ServiceDiversityChart;
