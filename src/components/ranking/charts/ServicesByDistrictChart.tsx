
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServicesByDistrictChartProps {
  data: any;
  isLoading: boolean;
}

const ServicesByDistrictChart: React.FC<ServicesByDistrictChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Serviços por distrito"
      value={isLoading ? '' : 'Diversidade'}
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

export default ServicesByDistrictChart;
