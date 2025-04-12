
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { barChartColors } from '../utils/chartColors';

interface TempoMedioStatusChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const TempoMedioStatusChart: React.FC<TempoMedioStatusChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: barChartColors[0]
          }]
        },
        primaryMetric: {
          value: '0',
          label: 'dias em média',
          trend: 'neutral'
        }
      };
    }

    // Group by status and calculate average time
    const statusTimes: Record<string, number[]> = {};
    
    data.forEach(item => {
      const status = item.sgz_status || 'Não informado';
      const daysInStatus = item.sgz_dias_ate_status_atual || 0;
      
      if (!statusTimes[status]) {
        statusTimes[status] = [];
      }
      
      statusTimes[status].push(daysInStatus);
    });
    
    // Calculate average time for each status
    const averages = Object.entries(statusTimes).map(([status, times]) => {
      const sum = times.reduce((acc, time) => acc + time, 0);
      const average = times.length > 0 ? sum / times.length : 0;
      
      // Apply simulation effect for better times
      const simulatedAverage = isSimulationActive 
        ? Math.max(average * 0.75, 1)  // 25% reduction, minimum 1 day
        : average;
        
      return {
        status,
        average: simulatedAverage,
        count: times.length
      };
    });
    
    // Sort by count (descending) to show the most frequent statuses
    const sortedAverages = averages
      .filter(item => item.count >= 5) // Only include statuses with at least 5 orders
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Take top 6 statuses
    
    // Calculate overall average
    const allTimes = Object.values(statusTimes).flat();
    const overallAverage = allTimes.length > 0 
      ? allTimes.reduce((acc, time) => acc + time, 0) / allTimes.length 
      : 0;
      
    // Apply simulation effect to overall average
    const simulatedOverallAverage = isSimulationActive 
      ? Math.max(overallAverage * 0.75, 1)
      : overallAverage;
    
    return {
      chartData: {
        labels: sortedAverages.map(item => item.status),
        datasets: [{
          label: 'Dias em média',
          data: sortedAverages.map(item => item.average.toFixed(1)),
          backgroundColor: barChartColors,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)'
        }]
      },
      primaryMetric: {
        value: simulatedOverallAverage.toFixed(1),
        label: 'dias em média',
        trend: 'down' // Lower is better for time metrics
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
          text: 'Dias'
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
            const value = parseFloat(context.raw as string);
            return `${value} dias em média`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Tempo Médio por Status"
      subtitle="Dias entre abertura e atualização da OS"
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

export default TempoMedioStatusChart;
