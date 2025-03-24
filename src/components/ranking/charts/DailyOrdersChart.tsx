
import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DailyOrdersChartProps {
  data: any;
  isLoading: boolean;
}

const DailyOrdersChart: React.FC<DailyOrdersChartProps> = ({ data, isLoading }) => {
  // Check if data and data.datasets exist with proper structure
  const isDataValid = !isLoading && data && data.datasets && data.datasets.length > 0;
  
  // Calculate the total or average if appropriate
  const chartValue = isDataValid && data.datasets[0]?.data?.length > 0 
    ? `${data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)} ordens`
    : 'N/A';
  
  return (
    <ChartCard
      title="Volume Diário de Novas Ordens"
      value={chartValue}
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
                title: {
                  display: true,
                  text: 'Quantidade'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Data'
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

export default DailyOrdersChart;
