
import React from 'react';
import { Pie } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { pieChartColors } from '../utils/chartColors';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 1,
          borderColor: '#fff'
        }],
        mostFrequentService: 'N/A',
        mostFrequentCount: 0
      };
    }
    
    // Process service types data
    const serviceCounts: Record<string, number> = {};
    
    sgzData.forEach(order => {
      // Use the service classification or type field
      const service = order.sgz_tipo_servico || order.sgz_classificacao_servico || 'Não informado';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    
    // Sort by count and take top services
    const sortedServices = Object.entries(serviceCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 6); // Top 6 services
    
    // Find most frequent service for display value
    const mostFrequentService = sortedServices.length > 0 ? sortedServices[0][0] : 'N/A';
    const mostFrequentCount = sortedServices.length > 0 ? sortedServices[0][1] as number : 0;
    
    const labels = sortedServices.map(([service]) => service);
    const values = sortedServices.map(([, count]) => count);
    
    // Apply simulation effect if active
    const simulatedValues = isSimulationActive 
      ? values.map(v => Math.round(v * (1 + (Math.random() - 0.5) * 0.2))) 
      : values;
    
    return {
      labels,
      datasets: [{
        data: simulatedValues,
        backgroundColor: pieChartColors.slice(0, sortedServices.length),
        borderWidth: 1,
        borderColor: '#fff'
      }],
      mostFrequentService,
      mostFrequentCount
    };
  }, [sgzData, isSimulationActive]);

  const displayValue = React.useMemo(() => {
    if (chartData.mostFrequentService === 'N/A') {
      return "Sem dados";
    }
    
    // Truncate long service names
    const serviceName = chartData.mostFrequentService.length > 20 
      ? chartData.mostFrequentService.substring(0, 20) + '...'
      : chartData.mostFrequentService;
      
    return `${serviceName}: ${chartData.mostFrequentCount}`;
  }, [chartData]);

  return (
    <EnhancedChartCard
      title="Tipos de Serviço Mais Frequentes"
      subtitle="Gráfico pizza com agrupamento de serviços semelhantes, destacando a demanda real"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Avalie o serviço mais solicitado e recomende ações para otimizar equipes e contratos relacionados."
    >
      {!isLoading && chartData.labels.length > 0 && (
        <Pie
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 12,
                  font: {
                    size: 11
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value * 100) / total) + '%';
                    return `${label}: ${value} (${percentage})`;
                  }
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default ServiceTypesChart;
