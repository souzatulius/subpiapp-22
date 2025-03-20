
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface OccurrencesChartProps {
  data: any;
  isLoading: boolean;
}

const OccurrencesChart: React.FC<OccurrencesChartProps> = ({ data, isLoading }) => {
  const totalOccurrences = isLoading ? '' : data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  
  return (
    <ChartCard
      title="Total de Ocorrências"
      value={totalOccurrences}
      isLoading={isLoading}
    >
      {!isLoading && (
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
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default OccurrencesChart;
