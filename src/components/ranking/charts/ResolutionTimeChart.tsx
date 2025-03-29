
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

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
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: []
  });
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      // Calculate average resolution time per service type
      const serviceTypeData: Record<string, { total: number, count: number }> = {};
      
      sgzData.forEach((order: any) => {
        // Only consider closed orders for resolution time
        const status = order.sgz_status?.toLowerCase();
        if (!(status?.includes('fecha') || status?.includes('conclu'))) {
          return;
        }
        
        const serviceType = order.sgz_tipo_servico || 'Não informado';
        const days = order.sgz_dias_ate_status_atual || 0;
        
        if (!serviceTypeData[serviceType]) {
          serviceTypeData[serviceType] = { total: 0, count: 0 };
        }
        serviceTypeData[serviceType].total += days;
        serviceTypeData[serviceType].count += 1;
      });
      
      // Calculate averages and sort
      const averageTimes = Object.entries(serviceTypeData)
        .map(([type, { total, count }]) => ({
          type,
          average: count > 0 ? (total / count) : 0
        }))
        .filter(item => item.average > 0)
        .sort((a, b) => b.average - a.average)
        .slice(0, 8); // Take top 8 for readability
      
      // Apply simulation changes if active
      const simulatedData = isSimulationActive
        ? averageTimes.map(item => ({
            ...item,
            average: item.average * 0.7 // Reduce resolution time by 30% in simulation
          }))
        : averageTimes;
      
      setChartData({
        labels: simulatedData.map(item => item.type.length > 20 ? item.type.substring(0, 17) + '...' : item.type),
        datasets: [
          {
            label: 'Tempo médio (dias)',
            data: simulatedData.map(item => item.average.toFixed(1)),
            backgroundColor: 'rgba(249, 115, 22, 0.8)', // orange-500
            borderColor: 'rgba(249, 115, 22, 1)',
            borderWidth: 1
          }
        ]
      });
    }
  }, [sgzData, isSimulationActive]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            return `Tempo médio: ${context.parsed.x} dias`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 10 }
        },
        beginAtZero: true
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };
  
  const averageAllServices = sgzData && sgzData.length > 0
    ? sgzData
        .filter(order => {
          const status = order.sgz_status?.toLowerCase();
          return status?.includes('fecha') || status?.includes('conclu');
        })
        .reduce((sum, order) => sum + (order.sgz_dias_ate_status_atual || 0), 0) / 
        sgzData.filter(order => {
          const status = order.sgz_status?.toLowerCase();
          return status?.includes('fecha') || status?.includes('conclu');
        }).length
    : 0;
  
  // Apply simulation to the average if active
  const displayedAverage = isSimulationActive ? averageAllServices * 0.7 : averageAllServices;
  
  const cardValue = sgzData 
    ? `${isSimulationActive ? 'Simulação: ' : ''}Média Geral: ${displayedAverage.toFixed(1)} dias`
    : '';
  
  return (
    <ChartCard
      title="Tempo Médio de Execução"
      value={cardValue}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default ResolutionTimeChart;
