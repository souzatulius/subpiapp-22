
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Loader2 } from 'lucide-react';
import { chartColors } from './ChartRegistration';
import InsufficientDataMessage from './InsufficientDataMessage';

interface ServiceTypeCount {
  name: string;
  count: number;
}

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
  // Process SGZ data to get service type distribution
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count by service type
    const serviceTypeCount: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      serviceTypeCount[serviceType] = (serviceTypeCount[serviceType] || 0) + 1;
    });
    
    // Convert to array format and sort
    let serviceTypes: ServiceTypeCount[] = Object.entries(serviceTypeCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));
    
    // Get top N service types and group the rest as "Others"
    const topN = 5;
    const topServiceTypes = serviceTypes.slice(0, topN);
    
    if (serviceTypes.length > topN) {
      const othersCount = serviceTypes
        .slice(topN)
        .reduce((sum, item) => sum + (item.count as number), 0);
      
      topServiceTypes.push({ name: 'Outros', count: othersCount });
    }
    
    return topServiceTypes;
  }, [sgzData]);
  
  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (!chartData) return null;
    
    return {
      labels: chartData.map(d => d.name),
      datasets: [
        {
          data: chartData.map(d => d.count),
          backgroundColor: chartColors.slice(0, chartData.length),
          borderColor: '#FFFFFF',
          borderWidth: 1,
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
          boxWidth: 12,
          font: {
            size: 10
          }
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
      <div className="h-64">
        <InsufficientDataMessage message="Dados insuficientes para mostrar tipos de serviço" />
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
