
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { barChartColors } from '../utils/chartColors';

interface TempoAberturaChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const TempoAberturaChart: React.FC<TempoAberturaChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: ['0-10 dias', '11-30 dias', '31-60 dias', '+60 dias'],
          datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: barChartColors.slice(0, 4)
          }]
        },
        primaryMetric: {
          value: '0',
          label: 'dias em média',
          trend: 'neutral'
        }
      };
    }

    // Define time ranges
    const ranges = [
      { label: '0-10 dias', min: 0, max: 10 },
      { label: '11-30 dias', min: 11, max: 30 },
      { label: '31-60 dias', min: 31, max: 60 },
      { label: '+60 dias', min: 61, max: Infinity }
    ];
    
    // Count orders in each time range
    const rangeCounts = ranges.map(range => {
      return {
        ...range,
        count: 0
      };
    });
    
    // Calculate days since creation for each order
    let totalDays = 0;
    let countValid = 0;
    
    data.forEach(order => {
      const creationDate = new Date(order.sgz_criado_em);
      const today = new Date();
      
      if (isNaN(creationDate.getTime())) {
        return;
      }
      
      const diffDays = Math.ceil(
        (today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      totalDays += diffDays;
      countValid++;
      
      // Increment the appropriate range counter
      for (const range of rangeCounts) {
        if (diffDays >= range.min && diffDays <= range.max) {
          range.count++;
          break;
        }
      }
    });
    
    // Apply simulation effect - in ideal scenario, orders would be processed faster
    if (isSimulationActive) {
      // Move 30% of orders from higher ranges to lower ranges
      for (let i = rangeCounts.length - 1; i > 0; i--) {
        const moveCount = Math.round(rangeCounts[i].count * 0.3);
        rangeCounts[i].count -= moveCount;
        rangeCounts[i-1].count += moveCount;
      }
    }
    
    // Calculate average days
    const averageDays = countValid > 0 ? Math.round(totalDays / countValid) : 0;
    
    // Apply simulation effect to average days
    const simulatedAverageDays = isSimulationActive 
      ? Math.round(averageDays * 0.7)  // 30% reduction
      : averageDays;
    
    return {
      chartData: {
        labels: rangeCounts.map(range => range.label),
        datasets: [{
          label: 'Quantidade de ordens',
          data: rangeCounts.map(range => range.count),
          backgroundColor: barChartColors.slice(0, rangeCounts.length),
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)'
        }]
      },
      primaryMetric: {
        value: simulatedAverageDays,
        label: 'dias em média',
        trend: simulatedAverageDays > 30 ? 'down' : 'neutral'  // High average times are bad
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return `${value} ordens de serviço`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Tempo de Abertura"
      subtitle="Tempo desde a criação da ordem"
      data={chartData.chartData}
      options={chartOptions}
      chartType="bar"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default TempoAberturaChart;
