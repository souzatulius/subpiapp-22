
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { barChartColors } from '@/components/ranking/utils/chartColors';

interface AgeGroup {
  label: string;
  days: [number, number];
  count: number;
  percentage: number;
}

interface TempoAberturaChartProps {
  data?: any[];
  isLoading?: boolean;
}

const TempoAberturaChart: React.FC<TempoAberturaChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  const [oldOrdersCount, setOldOrdersCount] = useState<number>(0);
  
  // Define age groups
  const predefinedGroups: AgeGroup[] = [
    { label: '0-10 dias', days: [0, 10], count: 0, percentage: 0 },
    { label: '11-30 dias', days: [11, 30], count: 0, percentage: 0 },
    { label: '31-60 dias', days: [31, 60], count: 0, percentage: 0 },
    { label: '61-90 dias', days: [61, 90], count: 0, percentage: 0 },
    { label: 'Mais de 90 dias', days: [91, Infinity], count: 0, percentage: 0 }
  ];
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Initialize groups with zeros
        const groups = [...predefinedGroups];
        const now = new Date();
        let oldOrders = 0;
        
        chartData.forEach(item => {
          // Skip if already completed
          const status = (item.sgz_status || '').toLowerCase();
          const isCompleted = status.includes('conclu') || status.includes('atendid');
          if (isCompleted) return;
          
          const createdDate = item.sgz_criado_em ? new Date(item.sgz_criado_em) : null;
          
          if (createdDate) {
            // Calculate days difference
            const diffTime = now.getTime() - createdDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Find appropriate group
            for (const group of groups) {
              if (diffDays >= group.days[0] && diffDays <= group.days[1]) {
                group.count += 1;
                break;
              }
            }
            
            // Count orders older than 60 days
            if (diffDays > 60) {
              oldOrders += 1;
            }
          }
        });
        
        // Calculate percentages
        const totalCount = groups.reduce((sum, group) => sum + group.count, 0);
        groups.forEach(group => {
          group.percentage = totalCount > 0 ? (group.count / totalCount) * 100 : 0;
        });
        
        setAgeGroups(groups);
        setOldOrdersCount(oldOrders);
      } catch (error) {
        console.error('Error processing age group data:', error);
      }
    } else {
      setAgeGroups([...predefinedGroups]);
      setOldOrdersCount(0);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'bar'> => {
    if (ageGroups.every(group => group.count === 0)) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    return {
      labels: ageGroups.map(group => group.label),
      datasets: [
        {
          label: 'Quantidade de ordens',
          data: ageGroups.map(group => group.count),
          backgroundColor: ageGroups.map((group, index) => {
            // Color coding based on age - older is more "red"
            if (index >= 3) return '#ef4444'; // Red for oldest
            if (index >= 2) return '#f97316'; // Orange for middle
            return barChartColors[0]; // Blue for newest
          }),
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
            const groupIndex = context.dataIndex;
            const group = ageGroups[groupIndex];
            return [
              `Total: ${value} ordens`,
              `${group?.percentage.toFixed(1)}% do total`
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
          text: 'Quantidade'
        }
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (ageGroups.every(group => group.count === 0)) {
      return { value: '0', label: 'ordens com mais de 60 dias', trend: 'neutral' as const };
    }
    
    return {
      value: oldOrdersCount,
      label: `ordens com mais de 60 dias`,
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Tempo de Abertura"
      subtitle="Tempo desde a criação da ordem"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise do tempo de abertura: ${ageGroups.some(group => group.count > 0) 
        ? `${oldOrdersCount} ordens estão abertas há mais de 60 dias.` 
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

export default TempoAberturaChart;
