
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { pieChartColors } from '@/components/ranking/utils/chartColors';

interface DeadlineStatus {
  status: string;
  count: number;
  percentage: number;
}

interface SituacaoPrazoChartProps {
  data?: any[];
  isLoading?: boolean;
}

const SituacaoPrazoChart: React.FC<SituacaoPrazoChartProps> = ({
  data,
  isLoading = false
}) => {
  const { painelData } = useRankingCharts();
  const chartData = data || painelData;
  
  const [deadlineStatus, setDeadlineStatus] = useState<DeadlineStatus[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Count occurrences of each deadline status
        const statusMap = new Map<string, number>();
        let overdue = 0;
        
        chartData.forEach(item => {
          const status = item.situacao_do_prazo || 'Não informado';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
          
          if (status.toLowerCase().includes('fora')) {
            overdue += 1;
          }
        });
        
        // Convert to array and calculate percentages
        const totalItems = chartData.length;
        const statusArray: DeadlineStatus[] = Array.from(statusMap.entries())
          .map(([status, count]) => ({
            status,
            count,
            percentage: (count / totalItems) * 100
          }))
          .sort((a, b) => b.count - a.count);
        
        setDeadlineStatus(statusArray);
        setOverdueCount(overdue);
      } catch (error) {
        console.error('Error processing deadline status data:', error);
      }
    } else {
      setDeadlineStatus([]);
      setOverdueCount(0);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'pie'> => {
    if (deadlineStatus.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    return {
      labels: deadlineStatus.map(item => item.status),
      datasets: [
        {
          data: deadlineStatus.map(item => item.count),
          backgroundColor: deadlineStatus.map((_, index) => 
            index === 0 && deadlineStatus[0].status.toLowerCase().includes('dentro')
              ? '#10b981' // Green for "Dentro do Prazo" if it's first
              : pieChartColors[index % pieChartColors.length]
          ),
          borderWidth: 1,
          borderColor: '#fff',
        }
      ]
    };
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
            const percentage = ((value / (chartData?.length || 1)) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (deadlineStatus.length === 0 || !chartData || chartData.length === 0) {
      return { value: '0', label: 'ordens fora do prazo', trend: 'neutral' as const };
    }
    
    if (overdueCount > 0) {
      const overduePercentage = (overdueCount / chartData.length) * 100;
      
      return {
        value: overdueCount,
        label: `ordens fora do prazo (${overduePercentage.toFixed(1)}%)`,
        trend: 'neutral' as const
      };
    } else {
      return {
        value: '0',
        label: 'ordens fora do prazo',
        trend: 'neutral' as const
      };
    }
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Situação do Prazo"
      subtitle="Ordens encerradas dentro ou fora do prazo"
      isLoading={isDataLoading}
      dataSource="Painel da Zeladoria"
      analysis={`Análise de cumprimento de prazos: ${deadlineStatus.length > 0 
        ? `${insight.value} ordens estão fora do prazo previsto.` 
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

export default SituacaoPrazoChart;
