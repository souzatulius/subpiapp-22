import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';
import InsufficientDataMessage from './InsufficientDataMessage';
import EnhancedChartCard from './EnhancedChartCard';

interface DepartmentComparisonChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const DepartmentComparisonChart: React.FC<DepartmentComparisonChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    const deptMap: Record<string, {
      total: number,
      completed: number,
      pending: number,
      avgResolutionTime: number,
      resolutionTimes: number[]
    }> = {};
    
    sgzData.forEach(order => {
      const dept = order.sgz_area_tecnica || 'Não especificado';
      const status = order.sgz_status?.toLowerCase() || '';
      const isCompleted = status.includes('conclu') || status.includes('finaliz');
      
      if (!deptMap[dept]) {
        deptMap[dept] = { 
          total: 0, 
          completed: 0, 
          pending: 0, 
          avgResolutionTime: 0,
          resolutionTimes: []
        };
      }
      
      deptMap[dept].total += 1;
      
      if (isCompleted) {
        deptMap[dept].completed += 1;
        
        if (order.sgz_criado_em && order.sgz_modificado_em) {
          const createdDate = new Date(order.sgz_criado_em);
          const modifiedDate = new Date(order.sgz_modificado_em);
          const timeDiff = modifiedDate.getTime() - createdDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (daysDiff >= 0) {
            deptMap[dept].resolutionTimes.push(daysDiff);
          }
        }
      } else {
        deptMap[dept].pending += 1;
      }
    });
    
    Object.keys(deptMap).forEach(dept => {
      const times = deptMap[dept].resolutionTimes;
      if (times.length > 0) {
        deptMap[dept].avgResolutionTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    });
    
    return Object.entries(deptMap)
      .map(([name, stats]) => ({
        name,
        ...stats,
        completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      }))
      .filter(dept => dept.total >= 5)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 6);
  }, [sgzData]);
  
  const simulatedData = React.useMemo(() => {
    if (!chartData) return null;
    
    if (isSimulationActive) {
      return chartData.map(dept => ({
        ...dept,
        completionRate: Math.min(dept.completionRate * 1.2, 100),
        avgResolutionTime: dept.avgResolutionTime * 0.75
      }));
    }
    
    return chartData;
  }, [chartData, isSimulationActive]);
  
  const barData = React.useMemo(() => {
    if (!simulatedData) return null;
    
    return {
      labels: simulatedData.map(d => d.name),
      datasets: [
        {
          label: 'Taxa de Conclusão (%)',
          data: simulatedData.map(d => d.completionRate.toFixed(1)),
          backgroundColor: chartColors[0],
          yAxisID: 'y'
        },
        {
          label: 'Tempo Médio (dias)',
          data: simulatedData.map(d => d.avgResolutionTime.toFixed(1)),
          backgroundColor: chartColors[4],
          yAxisID: 'y1'
        }
      ]
    };
  }, [simulatedData]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            if (datasetLabel.includes('Taxa')) {
              return `${datasetLabel}: ${context.raw}%`;
            } else {
              return `${datasetLabel}: ${context.raw} dias`;
            }
          },
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const dept = simulatedData![index];
            return [
              `Total: ${dept.total} ordens`,
              `Concluídas: ${dept.completed} ordens`,
              `Pendentes: ${dept.pending} ordens`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Taxa de Conclusão (%)'
        },
        max: 100
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Tempo Médio (dias)'
        }
      }
    }
  };

  return (
    <EnhancedChartCard
      title="Comparativo entre Departamentos"
      subtitle="Taxa de conclusão vs. Tempo médio"
      value={simulatedData ? `${simulatedData.length} departamentos` : '-'}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
      ) : !chartData || !barData ? (
        <div className="h-full flex items-center">
          <InsufficientDataMessage message="Dados insuficientes para comparação entre departamentos" />
        </div>
      ) : (
        <Bar data={barData} options={options} />
      )}
    </EnhancedChartCard>
  );
};

export default DepartmentComparisonChart;
