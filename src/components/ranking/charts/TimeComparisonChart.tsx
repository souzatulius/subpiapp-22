
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { lineChartColors } from '@/components/ranking/utils/chartColors';
import { getColorWithOpacity } from '@/components/ranking/utils/chartColors';

interface TimeComparisonChartProps {
  isLoading?: boolean;
}

const TimeComparisonChart: React.FC<TimeComparisonChartProps> = ({
  isLoading = false
}) => {
  // Sample data for demonstration
  const data: ChartData<'line'> = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: '2023',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: lineChartColors[0],
        backgroundColor: getColorWithOpacity(lineChartColors[0], 0.1),
        tension: 0.4,
        fill: true,
      },
      {
        label: '2024',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: lineChartColors[1],
        backgroundColor: getColorWithOpacity(lineChartColors[1], 0.1),
        tension: 0.4,
        fill: true,
      }
    ]
  };
  
  const options: ChartOptions<'line'> = {
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
          text: 'Quantidade'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  };
  
  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default TimeComparisonChart;
