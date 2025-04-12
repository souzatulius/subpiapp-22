
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { barChartColors } from '@/components/ranking/utils/chartColors';

interface DepartmentComparisonChartProps {
  isLoading?: boolean;
}

const DepartmentComparisonChart: React.FC<DepartmentComparisonChartProps> = ({
  isLoading = false
}) => {
  // Sample data for demonstration
  const data: ChartData<'bar'> = {
    labels: ['Central de Atendimento', 'Departamento A', 'Departamento B', 'Departamento C', 'Departamento D'],
    datasets: [
      {
        label: 'Tempo Médio de Resposta (horas)',
        data: [24, 48, 36, 72, 18],
        backgroundColor: barChartColors[0],
      },
      {
        label: 'Tempo Limite (horas)',
        data: [48, 72, 48, 48, 24],
        backgroundColor: barChartColors[1],
      }
    ]
  };
  
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Horas'
        }
      }
    }
  };
  
  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DepartmentComparisonChart;
