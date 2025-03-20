
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DemandOriginChartProps {
  data: any;
  isLoading: boolean;
}

const DemandOriginChart: React.FC<DemandOriginChartProps> = ({ data, isLoading }) => {
  const totalOrigins = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <ChartCard
      title="Origem da Demanda"
      value={isLoading ? 'Carregando...' : `${totalOrigins} origens`}
      isLoading={isLoading}
    >
      {data && <Pie data={data} options={options} />}
    </ChartCard>
  );
};

export default DemandOriginChart;
