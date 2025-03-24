
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResolutionTimeChartProps {
  data: any;
  isLoading: boolean;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({ data, isLoading }) => {
  // Check if data and data.datasets exist and have content before accessing them
  const isDataValid = !isLoading && data && data.datasets && data.datasets.length > 0;
  
  const averageTime = isDataValid && data.datasets[0]?.data?.length > 0 ? 
    `${Math.round(data.datasets[0].data[0] || 0)} dias` : 
    'N/A';
  
  return (
    <ChartCard
      title="Tempo médio de atendimento"
      value={averageTime}
      isLoading={isLoading}
    >
      {isDataValid ? (
        <Line 
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
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400">Dados insuficientes para exibir o gráfico</p>
        </div>
      )}
    </ChartCard>
  );
};

export default ResolutionTimeChart;
