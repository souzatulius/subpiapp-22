
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface CompaniesPerformanceChartProps {
  data: any;
  isLoading: boolean;
  title?: string;
}

const CompaniesPerformanceChart: React.FC<CompaniesPerformanceChartProps> = ({ 
  data, 
  isLoading,
  title = "Empresas com Obras Concluídas" 
}) => {
  // Check if data exists with proper structure
  const isDataValid = !isLoading && data && data.datasets && data.datasets.length > 0;
  
  return (
    <ChartCard
      title={title}
      value={isLoading ? '' : 'Top Empresas'}
      isLoading={isLoading}
    >
      {isDataValid ? (
        <Bar 
          data={data}
          options={{
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Obras Concluídas'
                }
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

export default CompaniesPerformanceChart;
