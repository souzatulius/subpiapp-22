
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface NeighborhoodsChartProps {
  data: any;
  isLoading: boolean;
  title?: string;
}

const NeighborhoodsChart: React.FC<NeighborhoodsChartProps> = ({ 
  data, 
  isLoading,
  title = "Ocorrências por bairro"
}) => {
  return (
    <ChartCard
      title={title}
      value={isLoading ? '' : 'Distribuição'}
      isLoading={isLoading}
    >
      {!isLoading && (
        <Pie 
          data={data} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right' as const,
              },
            },
          }}
        />
      )}
    </ChartCard>
  );
};

export default NeighborhoodsChart;
