
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface EfficiencyImpactChartProps {
  data: any;
  isLoading: boolean;
}

const EfficiencyImpactChart: React.FC<EfficiencyImpactChartProps> = ({ data, isLoading }) => {
  const difference = isLoading ? '' : 
    `Impacto: ${Math.abs(data.datasets[0].data[0] - data.datasets[0].data[1])} dias`;
  
  return (
    <ChartCard
      title="Impacto na eficiência (excluindo terceiros)"
      value={difference}
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
                    return `Tempo médio: ${context.parsed.y} dias`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Dias'
                }
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default EfficiencyImpactChart;
