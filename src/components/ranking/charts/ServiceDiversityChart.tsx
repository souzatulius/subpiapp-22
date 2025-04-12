
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { pieChartColors } from '@/components/ranking/utils/chartColors';

interface ServiceDiversityChartProps {
  isLoading?: boolean;
}

const ServiceDiversityChart: React.FC<ServiceDiversityChartProps> = ({
  isLoading = false
}) => {
  // Sample data for demonstration
  const data: ChartData<'doughnut'> = {
    labels: ['Iluminação', 'Pavimentação', 'Limpeza', 'Árvores', 'Outros'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: pieChartColors,
        borderWidth: 1,
        borderColor: '#fff',
      }
    ]
  };
  
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%'
  };
  
  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ServiceDiversityChart;
