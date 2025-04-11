
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';
import InsufficientDataMessage from './InsufficientDataMessage';

interface ResolutionTimeChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  // Process data to get resolution time by service type
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Filter for completed orders with valid dates
    const completedOrders = sgzData.filter(order => {
      const status = order.sgz_status?.toLowerCase() || '';
      const isCompleted = status.includes('conclu') || status.includes('finaliz');
      
      return isCompleted && order.sgz_criado_em && order.sgz_modificado_em;
    });
    
    if (completedOrders.length < 3) return null; // Not enough data
    
    // Calculate resolution time by service type
    const serviceTimeMap: Record<string, number[]> = {};
    
    completedOrders.forEach(order => {
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      const createdDate = new Date(order.sgz_criado_em);
      const modifiedDate = new Date(order.sgz_modificado_em);
      
      // Calculate days difference
      const timeDiff = modifiedDate.getTime() - createdDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (!serviceTimeMap[serviceType]) {
        serviceTimeMap[serviceType] = [];
      }
      
      serviceTimeMap[serviceType].push(daysDiff);
    });
    
    // Calculate average resolution time for each service type
    const serviceTimeAvg = Object.entries(serviceTimeMap)
      .map(([type, times]) => ({
        type,
        avgTime: times.reduce((sum, time) => sum + time, 0) / times.length
      }))
      .filter(item => !isNaN(item.avgTime))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 7); // Top 7 service types by average time
    
    if (serviceTimeAvg.length === 0) return null;
    
    return serviceTimeAvg;
  }, [sgzData]);
  
  // Apply simulation effects if active
  const simulatedData = React.useMemo(() => {
    if (!chartData) return null;
    
    if (isSimulationActive) {
      // In simulation mode, we want to show improved metrics (reduced resolution times)
      return chartData.map(item => ({
        ...item,
        avgTime: item.avgTime * 0.7 // 30% improvement
      }));
    }
    
    return chartData;
  }, [chartData, isSimulationActive]);
  
  // Prepare bar chart data
  const barData = React.useMemo(() => {
    if (!simulatedData) return null;
    
    return {
      labels: simulatedData.map(d => d.type),
      datasets: [
        {
          label: 'Dias até resolução (média)',
          data: simulatedData.map(d => d.avgTime.toFixed(1)),
          backgroundColor: chartColors[3],
          borderWidth: 0
        }
      ]
    };
  }, [simulatedData]);
  
  // Chart options
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
            return `Média: ${context.raw} dias`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Dias (média)'
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }
  
  if (!chartData || !barData) {
    return (
      <div className="h-64">
        <InsufficientDataMessage message="Dados insuficientes para calcular tempos de resolução" />
      </div>
    );
  }
  
  return (
    <div className="h-64">
      {barData && <Bar data={barData} options={options} />}
    </div>
  );
};

export default ResolutionTimeChart;
