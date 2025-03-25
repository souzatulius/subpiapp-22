
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TimeComparisonChartProps {
  data: any;
  isLoading: boolean;
}

const TimeComparisonChart: React.FC<TimeComparisonChartProps> = ({ data, isLoading }) => {
  const concluido = isLoading ? '' : `${data.datasets[0].data[0]} dias`;
  
  return (
    <ChartCard
      title="Comparativo de tempo médio"
      value={concluido}
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

export default TimeComparisonChart;
