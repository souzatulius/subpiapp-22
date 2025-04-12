
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { barChartColors } from '@/components/ranking/utils/chartColors';

interface StatusTimeData {
  status: string;
  averageDays: number;
  count: number;
}

interface TempoMedioStatusChartProps {
  data?: any[];
  isLoading?: boolean;
}

const TempoMedioStatusChart: React.FC<TempoMedioStatusChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [statusTimes, setStatusTimes] = useState<StatusTimeData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Create a map to track total days and counts by status
        const statusMap = new Map<string, { totalDays: number; count: number }>();
        
        chartData.forEach(item => {
          const status = item.sgz_status || 'Não informado';
          const createdDate = item.sgz_criado_em ? new Date(item.sgz_criado_em) : null;
          const statusDate = item.sgz_data_status ? new Date(item.sgz_data_status) : new Date();
          
          if (createdDate) {
            const daysDiff = Math.ceil((statusDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
            
            if (!statusMap.has(status)) {
              statusMap.set(status, { totalDays: 0, count: 0 });
            }
            
            const current = statusMap.get(status)!;
            current.totalDays += daysDiff;
            current.count += 1;
          }
        });
        
        // Convert to array and calculate averages
        const timesArray: StatusTimeData[] = Array.from(statusMap.entries())
          .map(([status, data]) => ({
            status,
            averageDays: data.count > 0 ? data.totalDays / data.count : 0,
            count: data.count
          }))
          .filter(item => item.count >= 5) // Only include statuses with a meaningful number of occurrences
          .sort((a, b) => b.averageDays - a.averageDays);
        
        setStatusTimes(timesArray);
      } catch (error) {
        console.error('Error processing status time data:', error);
      }
    } else {
      setStatusTimes([]);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'bar'> => {
    if (statusTimes.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    return {
      labels: statusTimes.map(item => item.status),
      datasets: [
        {
          label: 'Tempo médio (dias)',
          data: statusTimes.map(item => Math.round(item.averageDays * 10) / 10), // Round to 1 decimal place
          backgroundColor: barChartColors.slice(0, statusTimes.length),
          borderWidth: 0,
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const statusIndex = context.dataIndex;
            const status = statusTimes[statusIndex];
            return [
              `Tempo médio: ${value.toFixed(1)} dias`,
              `Quantidade: ${status?.count} ordens`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Dias'
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (statusTimes.length === 0) {
      return { value: '0', label: 'dias em média', trend: 'neutral' as const };
    }
    
    // Find the overall average
    let totalDays = 0;
    let totalCount = 0;
    
    statusTimes.forEach(item => {
      totalDays += item.averageDays * item.count;
      totalCount += item.count;
    });
    
    const overallAverage = totalCount > 0 ? totalDays / totalCount : 0;
    
    return {
      value: `${overallAverage.toFixed(1)}`,
      label: 'dias em média por OS',
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Tempo Médio por Status"
      subtitle="Dias entre abertura e atualização da OS"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise de tempo por status: ${statusTimes.length > 0 
        ? `O status "${statusTimes[0].status}" tem o maior tempo médio (${statusTimes[0].averageDays.toFixed(1)} dias).` 
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

export default TempoMedioStatusChart;
