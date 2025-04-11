
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive
}) => {
  // Process SGZ data to get service types distribution
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count occurrences of each service type
    const serviceTypesCount = {};
    
    sgzData.forEach(order => {
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      serviceTypesCount[serviceType] = (serviceTypesCount[serviceType] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const serviceTypes = Object.entries(serviceTypesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // Take top 5 + group others
    const topServices = serviceTypes.slice(0, 5);
    const otherServices = serviceTypes.slice(5);
    
    const otherCount = otherServices.reduce((sum, service) => sum + service.count, 0);
    
    if (otherCount > 0) {
      topServices.push({
        name: 'Outros',
        count: otherCount
      });
    }
    
    return topServices;
  }, [sgzData]);
  
  // Prepare pie chart data
  const pieChartData = React.useMemo(() => {
    if (!chartData) return null;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          data: chartData.map(d => d.count),
          backgroundColor: chartColors.slice(0, chartData.length),
          borderColor: 'white',
          borderWidth: 1
        }
      ]
    };
  }, [chartData]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15
        }
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
      {pieChartData && <Pie data={pieChartData} options={options} />}
    </div>
  );
};

export default ServiceTypesChart;
