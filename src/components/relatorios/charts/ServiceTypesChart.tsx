
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceTypesChartProps {
  data: any;
  isLoading: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ data, isLoading }) => {
  const totalServices = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
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
      title="Principais Serviços Solicitados"
      value={isLoading ? 'Carregando...' : `${totalServices} solicitações`}
      isLoading={isLoading}
    >
      {data && <Bar data={data} options={options} />}
    </ChartCard>
  );
};

export default ServiceTypesChart;
