
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme, formatDays } from './ChartRegistration';

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
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Agrupar por tipo de serviço
    const serviceTypes: Record<string, { count: number, totalDays: number, completedCount: number }> = {};
    
    sgzData.forEach(order => {
      const serviceType = order.sgz_tipo_servico || 'Não informado';
      if (!serviceTypes[serviceType]) {
        serviceTypes[serviceType] = { count: 0, totalDays: 0, completedCount: 0 };
      }
      
      serviceTypes[serviceType].count += 1;
      const days = parseInt(order.sgz_dias_ate_status_atual) || 0;
      serviceTypes[serviceType].totalDays += days;
      
      // Contar apenas OS concluídas para tempo médio
      if (order.sgz_status && order.sgz_status.toUpperCase().includes('CONC')) {
        serviceTypes[serviceType].completedCount += 1;
      }
    });
    
    // Calcular médias e ordenar por tempo de resolução
    const sortedServices = Object.entries(serviceTypes)
      .filter(([_, stats]) => stats.completedCount >= 5) // Apenas tipos com pelo menos 5 ordens concluídas
      .map(([name, stats]) => ({
        name,
        avgDays: stats.totalDays / stats.count,
        completedCount: stats.completedCount
      }))
      .sort((a, b) => b.avgDays - a.avgDays);
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      sortedServices.forEach(service => {
        service.avgDays = Math.max(service.avgDays * 0.75, 1); // Reduz tempo médio em 25%
      });
    }
    
    // Limitar a 8 tipos para melhor visualização
    const topServices = sortedServices.slice(0, 8);
    
    return {
      labels: topServices.map(s => s.name.length > 25 ? s.name.substring(0, 22) + '...' : s.name),
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: topServices.map(s => s.avgDays.toFixed(1)),
          backgroundColor: chartTheme.orange.backgroundColor,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1,
        }
      ]
    };
  }, [sgzData, isSimulationActive]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          text: 'Tempo Médio (dias)'
        }
      },
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0 dias';
    
    let totalDays = 0;
    let count = 0;
    
    sgzData.forEach(order => {
      const days = parseInt(order.sgz_dias_ate_status_atual) || 0;
      if (days > 0) {
        totalDays += days;
        count += 1;
      }
    });
    
    if (isSimulationActive) {
      totalDays = Math.floor(totalDays * 0.75); // Reduz tempo médio em 25% na simulação
    }
    
    const avgDays = count > 0 ? totalDays / count : 0;
    return `${avgDays.toFixed(1)} dias`;
  }, [sgzData, isSimulationActive]);

  return (
    <ChartCard
      title="Tempo Médio de Execução"
      value={stats}
      isLoading={isLoading}
    >
      {chartData && (
        <Bar data={chartData} options={options} />
      )}
    </ChartCard>
  );
};

export default ResolutionTimeChart;
