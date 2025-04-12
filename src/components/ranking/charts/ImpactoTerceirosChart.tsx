
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { pieChartColors } from '@/components/ranking/utils/chartColors';
import { getServiceResponsibility } from '@/components/ranking/utils/chartColors';

interface ResponsibilityCount {
  responsibility: string;
  count: number;
  percentage: number;
}

interface ImpactoTerceirosChartProps {
  data?: any[];
  isLoading?: boolean;
}

const ImpactoTerceirosChart: React.FC<ImpactoTerceirosChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [responsibilityCounts, setResponsibilityCounts] = useState<ResponsibilityCount[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  const [externalCount, setExternalCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Count occurrences of each responsibility
        const responsibilityMap = new Map<string, number>();
        let external = 0;
        
        chartData.forEach(item => {
          const serviceType = item.sgz_classificacao_de_servico || '';
          const responsibility = getServiceResponsibility(serviceType);
          
          responsibilityMap.set(responsibility, (responsibilityMap.get(responsibility) || 0) + 1);
          
          if (responsibility !== 'subprefeitura') {
            external += 1;
          }
        });
        
        // Convert to array and calculate percentages
        const total = chartData.length;
        const responsibilityArray: ResponsibilityCount[] = Array.from(responsibilityMap.entries())
          .map(([responsibility, count]) => ({
            responsibility,
            count,
            percentage: (count / total) * 100
          }))
          .sort((a, b) => b.count - a.count);
        
        setResponsibilityCounts(responsibilityArray);
        setExternalCount(external);
        setTotalCount(total);
      } catch (error) {
        console.error('Error processing responsibility data:', error);
      }
    } else {
      setResponsibilityCounts([]);
      setExternalCount(0);
      setTotalCount(0);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'pie'> => {
    if (responsibilityCounts.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    return {
      labels: responsibilityCounts.map(item => formatResponsibilityLabel(item.responsibility)),
      datasets: [
        {
          data: responsibilityCounts.map(item => item.count),
          backgroundColor: pieChartColors.slice(0, responsibilityCounts.length),
          borderWidth: 1,
          borderColor: '#fff',
        }
      ]
    };
  };
  
  // Format responsibility labels for display
  const formatResponsibilityLabel = (responsibility: string): string => {
    switch (responsibility.toLowerCase()) {
      case 'subprefeitura':
        return 'Subprefeitura';
      case 'enel':
        return 'ENEL';
      case 'sabesp':
        return 'SABESP';
      case 'selimp':
        return 'SELIMP';
      case 'dzu':
        return 'DZU';
      default:
        return responsibility.charAt(0).toUpperCase() + responsibility.slice(1);
    }
  };
  
  // Chart options
  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const percentage = ((value / totalCount) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (totalCount === 0) {
      return { value: '0%', label: 'ordens com responsabilidade externa', trend: 'neutral' as const };
    }
    
    const externalPercentage = (externalCount / totalCount) * 100;
    
    if (externalPercentage > 0) {
      return {
        value: `${externalPercentage.toFixed(1)}%`,
        label: 'ordens com responsabilidade externa',
        trend: 'neutral' as const
      };
    } else {
      return {
        value: '0%',
        label: 'ordens com responsabilidade externa',
        trend: 'neutral' as const
      };
    }
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Impacto de Terceiros"
      subtitle="Responsáveis por execução fora da Subprefeitura"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise de responsabilidades: ${responsibilityCounts.length > 0 
        ? `${insight.value} das ordens dependem de entidades externas como ${responsibilityCounts.filter(r => r.responsibility !== 'subprefeitura').map(r => formatResponsibilityLabel(r.responsibility)).join(', ')}.` 
        : 'Sem dados suficientes para análise.'}`}
    >
      <div className="h-72">
        <Pie data={prepareChartData()} options={chartOptions} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-2xl font-semibold text-orange-600">{insight.value}</p>
        <p className="text-sm text-gray-600">{insight.label}</p>
      </div>
    </ChartCard>
  );
};

export default ImpactoTerceirosChart;
