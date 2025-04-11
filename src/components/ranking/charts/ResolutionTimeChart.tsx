
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

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
  // Process SGZ data to get resolution time by service type
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Group by service type and calculate average resolution time
    const serviceTypeMap = new Map();
    
    sgzData.forEach(order => {
      if (order.sgz_status !== 'concluido') return;
      
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      const resolutionTime = order.sgz_dias_ate_status_atual || 0;
      
      if (!serviceTypeMap.has(serviceType)) {
        serviceTypeMap.set(serviceType, {
          name: serviceType,
          totalTime: 0,
          count: 0
        });
      }
      
      const serviceData = serviceTypeMap.get(serviceType);
      serviceData.totalTime += resolutionTime;
      serviceData.count += 1;
    });
    
    // Calculate average times
    const serviceTypes = Array.from(serviceTypeMap.values())
      .filter(service => service.count > 0)
      .map(service => ({
        name: service.name,
        avgTime: service.totalTime / service.count
      }))
      .sort((a, b) => b.avgTime - a.avgTime);
    
    // Take top 10 service types
    return serviceTypes.slice(0, 10);
  }, [sgzData]);
  
  // Prepare bar chart data
  const barChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    // Apply simulation factor if active
    const simulationFactor = isSimulationActive ? 0.7 : 1;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: chartData.map(d => isSimulationActive 
            ? d.avgTime * simulationFactor 
            : d.avgTime
          ),
          backgroundColor: chartColors[2],
          borderColor: chartColors[2],
          borderWidth: 1
        }
      ]
    };
  }, [chartData, isSimulationActive]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw.toFixed(1) || 0;
            return `${label}: ${value} dias`;
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

export default ResolutionTimeChart;
