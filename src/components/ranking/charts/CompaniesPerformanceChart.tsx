
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
  return (
    <ChartCard
      title={title}
      value={isLoading ? '' : 'Top Empresas'}
      isLoading={isLoading}
    >
      {!isLoading && data && (
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
      )}
    </ChartCard>
  );
};

export default CompaniesPerformanceChart;
