
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
    
    if (chartData && Array.isArray(chartData) && chartData.length > 0) {
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
          label: 'Quantidade de ordens',
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
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            const total = Array.isArray(chartData) ? chartData.length : 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value, index) {
            const label = this.getLabelForValue(index as number);
            // Truncate long labels
            return label.length > 25 ? label.substr(0, 22) + '...' : label;
          },
          font: {
            size: 11
          }
        }
      },
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };
  
  return (
    <ChartCard
      title="Tipos de Serviço"
      subtitle="Distribuição por categoria de atendimento"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={serviceTypeCounts.length > 0 
        ? `O tipo de serviço mais frequente é "${serviceTypeCounts[0].serviceType}" (${serviceTypeCounts[0].percentage.toFixed(1)}% do total).` 
        : 'Sem dados suficientes para análise.'}
    >
      <div className="h-72">
        <Bar data={prepareChartData()} options={chartOptions} />
      </div>
      
      {serviceTypeCounts.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-semibold text-blue-600">
            {serviceTypeCounts[0].percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            {serviceTypeCounts[0].serviceType.length > 30 
              ? serviceTypeCounts[0].serviceType.substr(0, 27) + '...' 
              : serviceTypeCounts[0].serviceType}
          </p>
        </div>
      )}
    </ChartCard>
  );
};

export default TiposServicoChart;
