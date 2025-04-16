
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Bar } from 'react-chartjs-2';
import { barChartColors, getColorWithOpacity } from '../utils/chartColors';

interface ResolutionTimeChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    // Make sure sgzData is an array before proceeding
    if (!sgzData || !Array.isArray(sgzData) || sgzData.length === 0) return null;

    // Process the data to calculate resolution time by service type
    const serviceResolutionTimes: Record<string, { total: number, count: number }> = {};
    
    // Safely process the array
    if (Array.isArray(sgzData)) {
      sgzData.forEach(item => {
        const serviceType = item.sgz_tipo_servico || item.classificacao_servico || 'Desconhecido';
        const daysToResolve = item.sgz_dias_ate_status_atual || 0;
        
        if (!serviceResolutionTimes[serviceType]) {
          serviceResolutionTimes[serviceType] = { total: 0, count: 0 };
        }
        
        // Only count resolution times for items that have begun processing
        if (daysToResolve > 0) {
          serviceResolutionTimes[serviceType].total += daysToResolve;
          serviceResolutionTimes[serviceType].count++;
        }
      });
    }
    
    // Calculate average resolution time for each service type
    const averageResolutionTimes: Record<string, number> = {};
    Object.keys(serviceResolutionTimes).forEach(serviceType => {
      const { total, count } = serviceResolutionTimes[serviceType];
      if (count > 0) {
        averageResolutionTimes[serviceType] = total / count;
      }
    });
    
    // Sort services by average resolution time (descending)
    const sortedServices = Object.keys(averageResolutionTimes)
      .sort((a, b) => averageResolutionTimes[b] - averageResolutionTimes[a])
      .slice(0, 8); // Show top 8 service types
    
    if (sortedServices.length === 0) {
      return null;
    }
    
    // Create chart data
    const labels = sortedServices;
    const resolutionTimes = sortedServices.map(service => averageResolutionTimes[service]);
    
    // For simulation, replace with ideal data
    if (isSimulationActive) {
      return {
        labels: [
          'Tapa Buraco', 'Poda de Árvore', 'Limpeza', 'Sinalização', 
          'Iluminação', 'Calçada', 'Bueiro', 'Manutenção'
        ],
        datasets: [
          {
            label: 'Dias para Resolução (Atual)',
            data: [15, 12, 10, 8.5, 6, 9, 7, 5],
            backgroundColor: barChartColors[2],
            borderColor: getColorWithOpacity(barChartColors[2], 0.8),
            borderWidth: 1
          },
          {
            label: 'Meta (Dias)',
            data: [7, 5, 3, 4, 2, 3, 3, 2],
            backgroundColor: barChartColors[3],
            borderColor: getColorWithOpacity(barChartColors[3], 0.8),
            borderWidth: 1
          }
        ]
      };
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Tempo Médio (Dias)',
          data: resolutionTimes,
          backgroundColor: barChartColors[0],
          borderColor: getColorWithOpacity(barChartColors[0], 0.8),
          borderWidth: 1
        }
      ]
    };
  }, [sgzData, isSimulationActive]);
  
  const displayValue = React.useMemo(() => {
    if (!sgzData || !Array.isArray(sgzData) || sgzData.length === 0) {
      return "Sem dados";
    }
    
    // Calculate overall average resolution time
    let totalDays = 0;
    let countOrders = 0;
    
    if (Array.isArray(sgzData)) {
      sgzData.forEach(item => {
        const days = item.sgz_dias_ate_status_atual || 0;
        if (days > 0) {
          totalDays += days;
          countOrders++;
        }
      });
    }
    
    const averageDays = countOrders > 0 ? (totalDays / countOrders).toFixed(1) : "N/A";
    return `${averageDays} dias`;
  }, [sgzData]);

  return (
    <EnhancedChartCard
      title="Tempo Médio de Resolução"
      subtitle="Tempo médio para resolução de demandas por tipo de serviço"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique os tipos de serviço com maior tempo de resolução e estude quais fatores podem estar causando os atrasos. Recomende estratégias para reduzir o tempo médio de resolução para cada categoria."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full flex-col">
          <div className="text-sm text-gray-600 text-center mb-4">
            Dados insuficientes para análise de tempo de resolução
          </div>
          <div className="text-xs text-gray-500">
            É necessário ter dados de prazos ou datas de resolução para gerar este gráfico
          </div>
        </div>
      ) : (
        <Bar
          data={chartData}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Dias para Resolução'
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return `${context.dataset.label}: ${value.toFixed(1)} dias`;
                  }
                }
              }
            }
          }}
        />
      ))}
    </EnhancedChartCard>
  );
};

export default ResolutionTimeChart;
