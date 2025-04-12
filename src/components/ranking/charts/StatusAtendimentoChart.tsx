
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { pieChartColors } from '../utils/chartColors';

interface StatusAtendimentoChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const StatusAtendimentoChart: React.FC<StatusAtendimentoChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: pieChartColors
        }]
      };
    }

    // Count orders by status
    const statusCounts: Record<string, number> = {};
    
    data.forEach(order => {
      const status = order.sgz_status || 'Não informado';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Sort by count (descending)
    const sortedStatuses = Object.entries(statusCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    
    const labels = sortedStatuses.map(([status]) => status);
    let values = sortedStatuses.map(([, count]) => count);
    
    // If simulation active, adjust the numbers
    if (isSimulationActive) {
      // Find the index of "Concluída" and increase it by 20%
      const concluidaIndex = labels.findIndex(label => 
        label.toLowerCase().includes('conclu'));
      
      if (concluidaIndex >= 0) {
        values = values.map((value, index) => {
          if (index === concluidaIndex) {
            return Math.round(value * 1.2); // Increase completed by 20%
          } else if (
            labels[index].toLowerCase().includes('andamento') || 
            labels[index].toLowerCase().includes('pendente')
          ) {
            return Math.round(value * 0.8); // Decrease pending/in-progress by 20%
          }
          return value;
        });
      }
    }
    
    // Find the most common status for the primary metric
    const mostCommonStatus = sortedStatuses.length > 0 ? sortedStatuses[0][0] : '';
    const mostCommonCount = sortedStatuses.length > 0 ? sortedStatuses[0][1] : 0;
    const totalOrders = values.reduce((sum, count) => sum + count, 0);
    const mostCommonPercentage = totalOrders > 0 
      ? ((mostCommonCount / totalOrders) * 100).toFixed(1) + '%'
      : '0%';
    
    return {
      chartData: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: pieChartColors,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      primaryMetric: {
        value: mostCommonStatus,
        label: mostCommonPercentage,
        trend: mostCommonStatus.toLowerCase().includes('conclu') ? 'up' : 'down'
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((sum, val) => sum + (val as number), 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Status de Atendimento"
      subtitle="Volume de ordens por status atual"
      data={chartData?.chartData || { labels: [], datasets: [{ data: [], backgroundColor: [] }] }}
      options={chartOptions}
      chartType="pie"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData?.primaryMetric}
      height={280}
    />
  );
};

export default StatusAtendimentoChart;
