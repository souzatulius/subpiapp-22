
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ClosureTimeChartProps {
  data: any;
  isLoading: boolean;
}

const ClosureTimeChart: React.FC<ClosureTimeChartProps> = ({ data, isLoading }) => {
  const avgTime = isLoading ? '' : 
    `Média: ${Math.round(data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / data.datasets[0].data.length)} dias`;
  
  return (
    <ChartCard
      title="Tempo médio até fechamento total"
      value={avgTime}
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
                    return `Tempo estimado: ${context.parsed.y} dias`;
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

export default ClosureTimeChart;
