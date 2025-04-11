
import React from 'react';
import { Bar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { barChartColors } from '../utils/chartColors';

interface ResolutionTimeChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Tempo Médio (dias)',
          data: [],
          backgroundColor: barChartColors[1],
          barPercentage: 0.7,
        }],
        statusWithMaxTime: 'N/A',
        maxTime: 0
      };
    }
    
    // Group by status and calculate average time
    const statusData: Record<string, { totalTime: number; count: number }> = {};
    
    sgzData.forEach(order => {
      const status = order.sgz_status || 'Não informado';
      const timeInStatus = order.sgz_dias_ate_status_atual || order.sgz_dias_no_status || 0;
      
      if (!statusData[status]) {
        statusData[status] = { totalTime: 0, count: 0 };
      }
      
      statusData[status].totalTime += timeInStatus;
      statusData[status].count += 1;
    });
    
    // Calculate average time per status
    const averageTimes = Object.entries(statusData).map(([status, { totalTime, count }]) => ({
      status,
      average: count > 0 ? Math.round(totalTime / count) : 0
    }));
    
    // Sort by average time, descending
    averageTimes.sort((a, b) => b.average - a.average);
    
    // Find status with max average time
    const statusWithMaxTime = averageTimes.length > 0 ? averageTimes[0].status : 'N/A';
    const maxTime = averageTimes.length > 0 ? averageTimes[0].average : 0;
    
    // Take top 7 for display
    const topStatuses = averageTimes.slice(0, 7);
    
    const labels = topStatuses.map(item => item.status);
    const values = topStatuses.map(item => item.average);
    
    // Apply simulation effect if active (show slightly better times)
    const simulatedValues = isSimulationActive
      ? values.map(v => Math.max(1, Math.round(v * 0.9)))
      : values;
    
    return {
      labels,
      datasets: [{
        label: 'Tempo Médio (dias)',
        data: simulatedValues,
        backgroundColor: barChartColors[1],
        barPercentage: 0.7,
      }],
      statusWithMaxTime,
      maxTime
    };
  }, [sgzData, isSimulationActive]);

  const displayValue = React.useMemo(() => {
    if (chartData.statusWithMaxTime === 'N/A') {
      return "Sem dados";
    }
    return `${chartData.statusWithMaxTime}: ${chartData.maxTime} dias`;
  }, [chartData]);

  return (
    <EnhancedChartCard
      title="Tempo Médio por Status"
      subtitle="Tempo médio em dias que cada OS permanece por status, destacando etapas críticas"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Avalie o status com maior permanência média e recomende intervenções específicas para reduzir atrasos."
    >
      {!isLoading && chartData.labels.length > 0 && (
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y' as const,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Tempo médio: ${context.parsed.x} dias`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Dias'
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default ResolutionTimeChart;
