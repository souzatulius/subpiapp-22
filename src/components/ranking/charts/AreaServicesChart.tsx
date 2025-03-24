
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface AreaServicesChartProps {
  data: any;
  isLoading: boolean;
}

const AreaServicesChart: React.FC<AreaServicesChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Serviços por Área Técnica"
      value={isLoading ? '' : 'STM vs STLP'}
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
                title: {
                  display: true,
                  text: 'Quantidade'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Tipo de Serviço'
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default AreaServicesChart;
