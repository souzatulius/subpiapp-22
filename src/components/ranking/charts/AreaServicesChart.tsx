
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface AreaServicesChartProps {
  data: any;
  isLoading: boolean;
}

const AreaServicesChart: React.FC<AreaServicesChartProps> = ({ data, isLoading }) => {
  // Calculate totals for STM and STLP
  const stmTotal = isLoading || !data || !data.datasets || !data.datasets[0]?.data ? 
    0 : 
    data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
  
  const stlpTotal = isLoading || !data || !data.datasets || !data.datasets[1]?.data ? 
    0 : 
    data.datasets[1].data.reduce((sum: number, val: number) => sum + val, 0);
  
  return (
    <ChartCard
      title="Serviços por Área Técnica"
      value={isLoading ? '' : `STM: ${stmTotal} / STLP: ${stlpTotal}`}
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

export default AreaServicesChart;
