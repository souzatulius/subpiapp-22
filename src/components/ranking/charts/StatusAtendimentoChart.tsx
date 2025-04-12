
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { pieChartColors } from '@/components/ranking/utils/chartColors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

interface StatusAtendimentoChartProps {
  data?: any[];
  isLoading?: boolean;
}

const StatusAtendimentoChart: React.FC<StatusAtendimentoChartProps> = ({ 
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [displayMode, setDisplayMode] = useState<'pie' | 'bar'>('pie');
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Count occurrences of each status
        const statusMap = new Map<string, number>();
        
        chartData.forEach(item => {
          const status = item.sgz_status || 'Não informado';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });
        
        // Convert to array and calculate percentages
        const totalItems = chartData.length;
        const statusArray: StatusCount[] = Array.from(statusMap.entries())
          .map(([status, count]) => ({
            status,
            count,
            percentage: (count / totalItems) * 100
          }))
          .sort((a, b) => b.count - a.count);
        
        setStatusCounts(statusArray);
      } catch (error) {
        console.error('Error processing status data:', error);
      }
    } else {
      setStatusCounts([]);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'pie' | 'bar'> => {
    if (statusCounts.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    return {
      labels: statusCounts.map(item => item.status),
      datasets: [
        {
          data: statusCounts.map(item => item.count),
          backgroundColor: pieChartColors.slice(0, statusCounts.length),
          borderWidth: 1,
          borderColor: '#fff',
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions: ChartOptions<'pie' | 'bar'> = {
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
            const percentage = ((value / chartData?.length) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (statusCounts.length === 0) {
      return { value: '0', label: 'ordens de serviço', trend: 'neutral' as const };
    }
    
    // Find the most common status
    const mostCommon = statusCounts[0];
    const percentage = mostCommon.percentage.toFixed(1);
    
    return {
      value: `${percentage}%`,
      label: `das ordens estão com status "${mostCommon.status}"`,
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Status de Atendimento"
      subtitle="Volume de ordens por status atual"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise da distribuição de status: ${statusCounts.length > 0 
        ? `O status mais frequente é "${statusCounts[0].status}" (${statusCounts[0].percentage.toFixed(1)}% do total).` 
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

export default StatusAtendimentoChart;
