
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';
import InsufficientDataMessage from './InsufficientDataMessage';

interface DistrictPerformanceChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({ 
  data,
  sgzData,
  isLoading,
  isSimulationActive 
}) => {
  // Process data to get district performance metrics
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count orders by district and by status
    const districtData: Record<string, { total: number, completed: number, pending: number }> = {};
    
    sgzData.forEach(order => {
      const district = order.sgz_distrito || 'Não informado';
      const status = order.sgz_status?.toLowerCase() || '';
      
      if (!districtData[district]) {
        districtData[district] = { total: 0, completed: 0, pending: 0 };
      }
      
      districtData[district].total += 1;
      
      if (status.includes('conclu') || status.includes('finaliz')) {
        districtData[district].completed += 1;
      } else {
        districtData[district].pending += 1;
      }
    });
    
    // Convert to array and sort by completion rate
    return Object.entries(districtData)
      .map(([name, stats]) => ({
        name,
        ...stats,
        completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5); // Top 5 districts
  }, [sgzData]);

  // Apply simulation effects if active
  const simulatedData = React.useMemo(() => {
    if (!chartData) return null;
    
    if (isSimulationActive) {
      return chartData.map(district => ({
        ...district,
        completionRate: Math.min(district.completionRate * 1.15, 100) // Improve by 15%, max 100%
      }));
    }
    
    return chartData;
  }, [chartData, isSimulationActive]);
  
  // Prepare bar chart data
  const barData = React.useMemo(() => {
    if (!simulatedData) return null;
    
    return {
      labels: simulatedData.map(d => d.name),
      datasets: [
        {
          label: 'Taxa de Conclusão (%)',
          data: simulatedData.map(d => d.completionRate.toFixed(1)),
          backgroundColor: chartColors[1],
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
            return `Conclusão: ${context.raw}%`;
          },
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const district = simulatedData![index];
            return [
              `Total: ${district.total} ordens`,
              `Concluídas: ${district.completed} ordens`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Taxa de Conclusão (%)'
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
      <div className="h-64">
        <InsufficientDataMessage message="Dados insuficientes para mostrar desempenho por distrito" />
      </div>
    );
  }
  
  return (
    <div className="h-64">
      {barData && <Bar data={barData} options={options} />}
    </div>
  );
};

export default DistrictPerformanceChart;
