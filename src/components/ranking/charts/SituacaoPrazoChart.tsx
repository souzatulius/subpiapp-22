
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { barChartColors } from '../utils/chartColors';

interface SituacaoPrazoChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const SituacaoPrazoChart: React.FC<SituacaoPrazoChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: ['Dentro do prazo', 'Fora do prazo'],
          datasets: [{
            data: [0, 0],
            backgroundColor: [barChartColors[2], barChartColors[0]]
          }]
        },
        primaryMetric: {
          value: '0',
          label: 'fora do prazo',
          trend: 'neutral'
        }
      };
    }

    // Filter only closed orders with deadline information
    const closedOrders = data.filter(item => {
      const status = (item.status || '').toLowerCase();
      return status.includes('conclu') || status.includes('fechad') || status.includes('executad');
    });
    
    // Count orders within/outside deadline
    let withinDeadline = 0;
    let outsideDeadline = 0;
    
    closedOrders.forEach(order => {
      const dataCriacao = new Date(order.data_abertura || order.created_at);
      const dataFechamento = new Date(order.data_fechamento);
      
      if (isNaN(dataCriacao.getTime()) || isNaN(dataFechamento.getTime())) {
        return;
      }
      
      const diffDays = Math.ceil(
        (dataFechamento.getTime() - dataCriacao.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Assume deadline is 30 days (could be adjusted based on real business rules)
      const isOutsideDeadline = diffDays > 30;
      
      if (isOutsideDeadline) {
        outsideDeadline++;
      } else {
        withinDeadline++;
      }
    });
    
    // Apply simulation effect - in ideal scenario, more orders would be within deadline
    if (isSimulationActive) {
      const totalClosed = withinDeadline + outsideDeadline;
      const transferAmount = Math.round(outsideDeadline * 0.4); // Move 40% from outside to within
      
      outsideDeadline -= transferAmount;
      withinDeadline += transferAmount;
      
      // Ensure non-negative values
      outsideDeadline = Math.max(0, outsideDeadline);
      withinDeadline = Math.max(0, withinDeadline);
    }
    
    const totalClosed = withinDeadline + outsideDeadline;
    const outsideDeadlinePercentage = totalClosed > 0 
      ? ((outsideDeadline / totalClosed) * 100).toFixed(1)
      : '0';
      
    return {
      chartData: {
        labels: ['Dentro do prazo', 'Fora do prazo'],
        datasets: [{
          data: [withinDeadline, outsideDeadline],
          backgroundColor: [barChartColors[2], barChartColors[0]],
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      primaryMetric: {
        value: outsideDeadline,
        label: `${outsideDeadlinePercentage}% do total`,
        trend: 'down' // Lower is better for outside deadline
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
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
      title="Situação do Prazo"
      subtitle="Ordens encerradas dentro ou fora do prazo"
      data={chartData.chartData}
      options={chartOptions}
      chartType="bar"
      isLoading={isLoading}
      sourceLabel="Painel"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default SituacaoPrazoChart;
