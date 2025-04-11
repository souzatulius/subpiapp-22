
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { barChartColors } from '../utils/chartColors';

interface StatusDistributionChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Process SGZ data to get status distribution
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Quantidade de OS',
          data: [],
          backgroundColor: barChartColors,
          barPercentage: 0.7,
        }],
        totalOrders: 0
      };
    }
    
    // Count by status
    const statusCount: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const status = order.sgz_status || 'Não informado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Convert to array format and sort
    const statusItems = Object.entries(statusCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));
    
    const labels = statusItems.map(item => item.name);
    const values = statusItems.map(item => item.count);
    
    // Apply simulation effects if active
    let simulatedValues = values;
    if (isSimulationActive) {
      simulatedValues = values.map((value, index) => {
        const statusName = labels[index].toLowerCase();
        // Increase completed and decrease pending in simulation
        if (statusName.includes('conclu') || statusName.includes('encerr')) {
          return Math.round(value * 1.2);
        } else if (statusName.includes('pend') || statusName.includes('abert')) {
          return Math.round(value * 0.8);
        }
        return value;
      });
    }
    
    // Calculate total orders
    const totalOrders = values.reduce((sum, val) => sum + (val as number), 0);
    
    return {
      labels,
      datasets: [{
        label: 'Quantidade de OS',
        data: simulatedValues,
        backgroundColor: barChartColors,
        barPercentage: 0.7,
      }],
      totalOrders
    };
  }, [sgzData, isSimulationActive]);
  
  return (
    <EnhancedChartCard
      title="Distribuição por Status"
      subtitle="Barras verticais mostrando quantidade por status. Permite identificar gargalos operacionais"
      value={`Total: ${chartData.totalOrders}`}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique quais status estão acumulando mais ordens e sugira possíveis ações para reduzir os gargalos."
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
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.parsed.y;
                    const total = chartData.totalOrders;
                    const percentage = total > 0 ? Math.round((value * 100) / total) + '%' : '0%';
                    return `${value} OS (${percentage})`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Quantidade de OS'
                }
              },
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default StatusDistributionChart;
