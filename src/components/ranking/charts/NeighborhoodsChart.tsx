
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface NeighborhoodsChartProps {
  data: any;
  isLoading: boolean;
}

const NeighborhoodsChart: React.FC<NeighborhoodsChartProps> = ({ data, isLoading }) => {
  return (
    <ChartCard
      title="Ocorrências por bairro"
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
