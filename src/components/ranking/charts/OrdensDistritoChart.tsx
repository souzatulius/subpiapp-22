
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { barChartColors } from '@/components/ranking/utils/chartColors';

interface DistrictCount {
  district: string;
  count: number;
  percentage: number;
}

interface OrdensDistritoChartProps {
  data?: any[];
  isLoading?: boolean;
}

const OrdensDistritoChart: React.FC<OrdensDistritoChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [districtCounts, setDistrictCounts] = useState<DistrictCount[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Count occurrences of each district
        const districtMap = new Map<string, number>();
        
        chartData.forEach(item => {
          const district = item.sgz_distrito_id || 'Não informado';
          districtMap.set(district, (districtMap.get(district) || 0) + 1);
        });
        
        // Convert to array and calculate percentages
        const totalItems = chartData.length;
        const districtArray: DistrictCount[] = Array.from(districtMap.entries())
          .map(([district, count]) => ({
            district,
            count,
            percentage: (count / totalItems) * 100
          }))
          .sort((a, b) => b.count - a.count);
        
        setDistrictCounts(districtArray);
      } catch (error) {
        console.error('Error processing district data:', error);
      }
    } else {
      setDistrictCounts([]);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'bar'> => {
    if (districtCounts.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
    }
    
    // Take top 10 districts for better visibility
    const topDistricts = districtCounts.slice(0, 10);
    
    return {
      labels: topDistricts.map(item => item.district),
      datasets: [
        {
          label: 'Quantidade de ordens',
          data: topDistricts.map(item => item.count),
          backgroundColor: barChartColors[0],
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
            const distIndex = context.dataIndex;
            const district = districtCounts[distIndex];
            return [
              `Total: ${value} ordens`,
              `${district?.percentage.toFixed(1)}% do total`
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
    if (districtCounts.length === 0) {
      return { value: '0', label: 'ordens de serviço', trend: 'neutral' as const };
    }
    
    // Find the district with most orders
    const topDistrict = districtCounts[0];
    
    return {
      value: topDistrict.count,
      label: `ordens em ${topDistrict.district}`,
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Ordens por Distrito"
      subtitle="Distribuição territorial das solicitações"
      isLoading={isDataLoading}
      dataSource="SGZ"
      analysis={`Análise da distribuição por distrito: ${districtCounts.length > 0 
        ? `O distrito "${districtCounts[0].district}" concentra ${districtCounts[0].percentage.toFixed(1)}% das ordens de serviço.` 
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

export default OrdensDistritoChart;
