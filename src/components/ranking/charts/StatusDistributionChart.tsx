
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface StatusDistributionChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  // Process SGZ data to get status distribution
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count occurrences of each status
    const statusCount = {};
    
    sgzData.forEach(order => {
      const status = order.sgz_status || 'Não informado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Format status labels for display
    const formattedStatusLabels = {
      'pendente': 'Pendente',
      'em-andamento': 'Em andamento',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    
    // Convert to array format for chart
    return Object.entries(statusCount).map(([key, value]) => ({
      name: formattedStatusLabels[key] || key,
      count: value
    }));
  }, [sgzData]);
  
  // Apply simulation effect if enabled
  const simulatedChartData = React.useMemo(() => {
    if (!chartData || !isSimulationActive) return chartData;
    
    // In simulation, show more completed and fewer pending
    return chartData.map(item => {
      if (item.name === 'Concluído') {
        return { ...item, count: Math.floor(item.count * 1.3) };
      } else if (item.name === 'Pendente') {
        return { ...item, count: Math.floor(item.count * 0.7) };
      }
      return item;
    });
  }, [chartData, isSimulationActive]);
  
  // Prepare doughnut chart data
  const doughnutData = React.useMemo(() => {
    if (!simulatedChartData) return null;
    
    return {
      labels: simulatedChartData.map(d => d.name),
      datasets: [
        {
          data: simulatedChartData.map(d => d.count),
          backgroundColor: [
            '#10B981', // emerald for completed
            '#F59E0B', // amber for in progress
            '#EF4444', // red for pending
            '#6B7280', // gray for canceled
          ],
          borderColor: 'white',
          borderWidth: 1
        }
      ]
    };
  }, [simulatedChartData]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
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
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Sem dados disponíveis para exibir
      </div>
    );
  }
  
  return (
    <div className="h-64">
      {doughnutData && <Doughnut data={doughnutData} options={options} />}
    </div>
  );
};

export default StatusDistributionChart;
