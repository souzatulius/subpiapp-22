
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({
  data,
  sgzData,
  painelData,
  isLoading,
  isSimulationActive
}) => {
  // Process data to get responsibility distribution
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count by department/coordenação
    const deptCount = {};
    
    sgzData.forEach(order => {
      const department = order.sgz_coordenacao || order.sgz_area_tecnica || 'Não informado';
      deptCount[department] = (deptCount[department] || 0) + 1;
    });
    
    // Convert to array format
    return Object.entries(deptCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 departments
  }, [sgzData]);
  
  // Prepare radar chart data
  const radarChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation factor if active
    const simulationFactor = isSimulationActive ? 1.2 : 1;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          label: 'Demandas Atribuídas',
          data: chartData.map(d => isSimulationActive 
            ? Math.floor(d.count * simulationFactor * Math.random() * 0.4 + 0.8)
            : d.count
          ),
          backgroundColor: `${chartColors[3]}60`,
          borderColor: chartColors[3],
          borderWidth: 2,
          pointBackgroundColor: chartColors[3],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors[3]
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
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0
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
      {radarChartData && <Radar data={radarChartData} options={options} />}
    </div>
  );
};

export default ResponsibilityChart;
