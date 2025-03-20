
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface CoordinationAreasChartProps {
  data: any;
  isLoading: boolean;
}

const CoordinationAreasChart: React.FC<CoordinationAreasChartProps> = ({ data, isLoading }) => {
  const totalAreas = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <ChartCard
      title="Áreas de Coordenação Mais Acionadas"
      value={isLoading ? 'Carregando...' : `${totalAreas} solicitações`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default CoordinationAreasChart;
