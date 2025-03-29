
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';
import { chartTheme, formatDays } from './ChartRegistration';

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
  const chartData = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Agrupar por distrito
    const districts: Record<string, { count: number, totalDays: number, fechados: number }> = {};
    
    sgzData.forEach(order => {
      const district = order.sgz_distrito || 'Não informado';
      if (!districts[district]) {
        districts[district] = { count: 0, totalDays: 0, fechados: 0 };
      }
      
      districts[district].count += 1;
      districts[district].totalDays += parseInt(order.sgz_dias_ate_status_atual) || 0;
      
      if (order.sgz_status && (order.sgz_status.toUpperCase().includes('CONC') || order.sgz_status.toUpperCase().includes('FECHAD'))) {
        districts[district].fechados += 1;
      }
    });
    
    // Calcular médias e ordenar por taxa de conclusão
    const sortedDistricts = Object.entries(districts)
      .filter(([_, stats]) => stats.count >= 5) // Apenas distritos com pelo menos 5 ordens
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgDays: stats.totalDays / stats.count,
        completionRate: (stats.fechados / stats.count) * 100
      }))
      .sort((a, b) => b.completionRate - a.completionRate);
    
    // Aplicar simulação se ativa
    if (isSimulationActive) {
      sortedDistricts.forEach(district => {
        district.avgDays = Math.max(district.avgDays * 0.7, 1); // Reduz tempo médio em 30%
        district.completionRate = Math.min(district.completionRate + 15, 100); // Aumenta taxa de conclusão
      });
    }
    
    // Limitar a 10 distritos para melhor visualização
    const topDistricts = sortedDistricts.slice(0, 10);
    
    return {
      labels: topDistricts.map(d => d.name),
      datasets: [
        {
          label: 'Taxa de Conclusão (%)',
          data: topDistricts.map(d => d.completionRate.toFixed(1)),
          backgroundColor: chartTheme.orange.backgroundColor,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1,
        }
      ]
    };
  }, [sgzData, isSimulationActive]);
  
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Taxa de Conclusão: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Taxa de Conclusão (%)'
        }
      },
    }
  };
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!sgzData || sgzData.length === 0) return '0 distritos';
    
    const uniqueDistricts = new Set<string>();
    sgzData.forEach(order => {
      if (order.sgz_distrito) {
        uniqueDistricts.add(order.sgz_distrito);
      }
    });
    
    return `${uniqueDistricts.size} distritos`;
  }, [sgzData]);

  return (
    <ChartCard
      title="Performance por Distrito"
      value={stats}
      isLoading={isLoading}
    >
      {chartData && (
        <Bar data={chartData} options={options} />
      )}
    </ChartCard>
  );
};

export default DistrictPerformanceChart;
