
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface TimeToCloseChartProps {
  data: any;
  isLoading: boolean;
}

const TimeToCloseChart: React.FC<TimeToCloseChartProps> = ({ data, isLoading }) => {
  // Check if data exists before accessing it
  const isDataValid = !isLoading && data && data.datasets && data.datasets.length > 0;
  
  const averageTime = isDataValid && data.datasets[0]?.data ? 
    `${Math.round(data.datasets[0].data[1] || 0)} dias` : 
    'N/A';
  
  return (
    <ChartCard
      title="Tempo até Fechamento"
      value={averageTime}
      isLoading={isLoading}
    >
      {isDataValid ? (
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
                  text: 'Dias'
                }
              }
            },
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">Dados insuficientes para exibir o gráfico</p>
        </div>
      )}
    </ChartCard>
  );
};

export default TimeToCloseChart;
