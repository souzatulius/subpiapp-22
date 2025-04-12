
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { barChartColors } from '@/components/ranking/utils/chartColors';
import { getServiceGroup } from '@/components/ranking/utils/chartColors';

interface ServiceTypeCount {
  serviceType: string;
  count: number;
  percentage: number;
}

interface TiposServicoChartProps {
  data?: any[];
  isLoading?: boolean;
}

const TiposServicoChart: React.FC<TiposServicoChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [serviceTypeCounts, setServiceTypeCounts] = useState<ServiceTypeCount[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Count occurrences of each service type
        const serviceMap = new Map<string, number>();
        
        chartData.forEach(item => {
          // Try to use the mapped group if available
          const serviceType = item.sgz_classificacao_de_servico || 'Não informado';
          const mappedGroup = getServiceGroup(serviceType);
          const finalType = mappedGroup !== 'Outros' ? mappedGroup : serviceType;
          
          serviceMap.set(finalType, (serviceMap.get(finalType) || 0) + 1);
        });
        
        // Convert to array and calculate percentages
        const totalItems = chartData.length;
        const serviceArray: ServiceTypeCount[] = Array.from(serviceMap.entries())
          .map(([serviceType, count]) => ({
            serviceType,
            count,
            percentage: (count / totalItems) * 100
          }))
          .sort((a, b) => b.count - a.count);
        
        setServiceTypeCounts(serviceArray);
      } catch (error) {
        console.error('Error processing service type data:', error);
      }
    } else {
      setServiceTypeCounts([]);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'bar'> => {
    if (serviceTypeCounts.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    // Take top services for better visibility
    const topServices = serviceTypeCounts.slice(0, 8);
    
    return {
      labels: topServices.map(item => item.serviceType),
      datasets: [
        {
          label: 'Quantidade de ordens',
          data: topServices.map(item => item.count),
          backgroundColor: barChartColors,
          borderWidth: 0,
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const serviceIndex = context.dataIndex;
            const service = serviceTypeCounts[serviceIndex];
            return [
              `Total: ${value} ordens`,
              `${service?.percentage.toFixed(1)}% do total`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (serviceTypeCounts.length === 0) {
      return { value: '0', label: 'tipos de serviço', trend: 'neutral' as const };
    }
    
    // Find the most common service type
    const topService = serviceTypeCounts[0];
    
    return {
      value: `${topService.percentage.toFixed(1)}%`,
      label: `das ordens são ${topService.serviceType}`,
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Tipos de Serviço"
      subtitle="Categorias mais recorrentes nas ordens"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise dos tipos de serviço: ${serviceTypeCounts.length > 0 
        ? `O tipo de serviço "${serviceTypeCounts[0].serviceType}" representa ${serviceTypeCounts[0].percentage.toFixed(1)}% do total.` 
        : 'Sem dados suficientes para análise.'}`}
    >
      <div className="h-72">
        <Bar data={prepareChartData()} options={chartOptions} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-2xl font-semibold text-orange-600">{insight.value}</p>
        <p className="text-sm text-gray-600">{insight.label}</p>
      </div>
    </ChartCard>
  );
};

export default TiposServicoChart;
