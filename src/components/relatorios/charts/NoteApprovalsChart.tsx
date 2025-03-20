
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface NoteApprovalsChartProps {
  data: any;
  isLoading: boolean;
}

const NoteApprovalsChart: React.FC<NoteApprovalsChartProps> = ({ data, isLoading }) => {
  const totalApprovals = !isLoading && data ? data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) : 0;
  
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
      title="Aprovações da Nota Oficial"
      value={isLoading ? 'Carregando...' : `${totalApprovals} notas`}
      isLoading={isLoading}
    >
      {data && <Pie data={data} options={options} />}
    </ChartCard>
  );
};

export default NoteApprovalsChart;
