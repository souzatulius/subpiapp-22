
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface StatusCount {
  name: string;
  count: number;
}

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
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count by status
    const statusCount: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const status = order.sgz_status || 'Não informado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Convert to array format and sort
    const statusItems: StatusCount[] = Object.entries(statusCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));
    
    return statusItems;
  }, [sgzData]);
  
  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation effects if active
    const simulationFactor = isSimulationActive ? 1.2 : 1;
    
    // When simulating, increase completed percentage and decrease pending percentage
    const modifiedData = chartData.map(item => {
      let count = item.count as number;
      
      if (isSimulationActive) {
        if (item.name.toLowerCase().includes('conclu')) {
          count = Math.floor(count * simulationFactor);
        } else if (item.name.toLowerCase().includes('pend')) {
          count = Math.floor(count / simulationFactor);
        }
      }
      
      return {
        name: item.name,
        count
      };
    });
    
    return {
      labels: modifiedData.map(d => d.name),
      datasets: [
        {
          data: modifiedData.map(d => d.count),
          backgroundColor: chartColors.slice(0, modifiedData.length),
          borderColor: '#FFFFFF',
          borderWidth: 1,
        }
      ]
    };
  }, [chartData, isSimulationActive]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
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
      {pieChartData && <Pie data={pieChartData} options={options} />}
    </div>
  );
};

export default StatusDistributionChart;
