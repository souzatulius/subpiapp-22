
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResponsibleUsersChartProps {
  data: any;
  isLoading: boolean;
}

const ResponsibleUsersChart: React.FC<ResponsibleUsersChartProps> = ({ data, isLoading }) => {
  const totalResponses = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <ChartCard
      title="Responsáveis pelo Atendimento"
      value={isLoading ? 'Carregando...' : `${totalResponses} respostas`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default ResponsibleUsersChart;
