
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { pieChartColors } from '../utils/chartColors';

interface TiposServicoChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const TiposServicoChart: React.FC<TiposServicoChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: pieChartColors
          }]
        },
        primaryMetric: {
          value: '0',
          label: 'tipos de serviço',
          trend: 'neutral'
        }
      };
    }

    // Count orders by service type
    const serviceCounts: Record<string, number> = {};
    
    data.forEach(order => {
      const service = order.sgz_tipo_servico || 'Não informado';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    
    // Sort service types by count (descending)
    const sortedServices = Object.entries(serviceCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    
    // Take top 7 service types, then group the rest as "Outros"
    const topServices = sortedServices.slice(0, 7);
    const otherServices = sortedServices.slice(7);
    
    let labels = topServices.map(([service]) => service);
    let values = topServices.map(([, count]) => count);
    
    // Add "Outros" category if there are more services
    if (otherServices.length > 0) {
      const otherCount = otherServices.reduce((sum, [, count]) => sum + count, 0);
      labels.push('Outros');
      values.push(otherCount);
    }
    
    // Find the most common service type for the primary metric
    const mostCommonService = sortedServices.length > 0 ? sortedServices[0][0] : '';
    const mostCommonCount = sortedServices.length > 0 ? sortedServices[0][1] : 0;
    const totalServices = Object.keys(serviceCounts).length;
    
    return {
      chartData: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: pieChartColors,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      primaryMetric: {
        value: mostCommonService.length > 20 
          ? mostCommonService.substring(0, 20) + '...' 
          : mostCommonService,
        label: `${mostCommonCount} ordens`,
        trend: 'neutral'
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((sum, val) => sum + (val as number), 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Tipos de Serviço"
      subtitle="Categorias mais recorrentes nas ordens"
      data={chartData.chartData}
      options={chartOptions}
      chartType="pie"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default TiposServicoChart;
