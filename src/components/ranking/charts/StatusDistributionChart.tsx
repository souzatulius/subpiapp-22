
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface StatusDistributionChartProps {
  data: any;
  isLoading: boolean;
  title?: string;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ 
  data, 
  isLoading,
  title = "Status das ordens de serviço"
}) => {
  // Check if data and datasets exist
  const isDataValid = !isLoading && data && data.datasets && data.datasets.length > 0;
  
  return (
    <ChartCard
      title={title}
      value={isLoading ? '' : 'Comparação'}
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

export default StatusDistributionChart;
