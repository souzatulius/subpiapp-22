
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

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
  // Process SGZ data to get district performance metrics
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Group by district and calculate performance metrics
    const districtMap = new Map();
    
    sgzData.forEach(order => {
      const district = order.sgz_distrito || 'Não informado';
      
      if (!districtMap.has(district)) {
        districtMap.set(district, {
          name: district,
          totalOrders: 0,
          completedOrders: 0,
          avgResolutionTime: 0,
          totalResolutionTime: 0
        });
      }
      
      const districtData = districtMap.get(district);
      districtData.totalOrders += 1;
      
      if (order.sgz_status === 'concluido') {
        districtData.completedOrders += 1;
        districtData.totalResolutionTime += order.sgz_dias_ate_status_atual || 0;
      }
    });
    
    // Calculate averages and efficiency
    const districts = Array.from(districtMap.values()).map(district => {
      const { totalOrders, completedOrders, totalResolutionTime } = district;
      const efficiency = completedOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
      const avgTime = completedOrders > 0 ? totalResolutionTime / completedOrders : 0;
      
      return {
        ...district,
        efficiency: parseFloat(efficiency.toFixed(1)),
        avgResolutionTime: parseFloat(avgTime.toFixed(1))
      };
    });
    
    // Sort by efficiency (descending)
    return districts.sort((a, b) => b.efficiency - a.efficiency).slice(0, 10);
  }, [sgzData, isSimulationActive]);
  
  // Prepare chart configuration
  const barChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation factor if active
    const simulationFactor = isSimulationActive ? 1.2 : 1;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          label: 'Eficiência (%)',
          data: chartData.map(d => isSimulationActive 
            ? Math.min(100, d.efficiency * simulationFactor) 
            : d.efficiency
          ),
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          borderWidth: 1
        },
        {
          label: 'Tempo Médio (dias)',
          data: chartData.map(d => isSimulationActive 
            ? d.avgResolutionTime / simulationFactor
            : d.avgResolutionTime
          ),
          backgroundColor: chartColors[1],
          borderColor: chartColors[1],
          borderWidth: 1
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
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}${context.datasetIndex === 0 ? '%' : ' dias'}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor'
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
      {barChartData && <Bar data={barChartData} options={options} />}
    </div>
  );
};

export default DistrictPerformanceChart;
