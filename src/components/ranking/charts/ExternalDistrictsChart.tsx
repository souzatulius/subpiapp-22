
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ExternalDistrictsChartProps {
  data: any;
  isLoading: boolean;
}

const ExternalDistrictsChart: React.FC<ExternalDistrictsChartProps> = ({ data, isLoading }) => {
  // Calculate total external orders
  const totalExternal = isLoading || !data || !data.datasets || !data.datasets[0]?.data ? 
    0 : 
    data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
  
  return (
    <ChartCard
      title="Ordens de Distritos Externos"
      value={isLoading ? '' : `${totalExternal} ocorrências`}
      isLoading={isLoading}
      className="bg-gray-50"
    >
      {!isLoading && data && (
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
                  text: 'Quantidade'
                }
              }
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default ExternalDistrictsChart;
