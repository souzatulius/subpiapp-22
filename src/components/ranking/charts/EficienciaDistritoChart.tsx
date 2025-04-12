
import React, { useEffect, useState, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { lineChartColors } from '@/components/ranking/utils/chartColors';
import { getColorWithOpacity } from '@/components/ranking/utils/chartColors';

interface DistrictEfficiency {
  district: string;
  total: number;
  completed: number;
  efficiency: number;
}

interface DistrictEfficiencyRadarChartProps {
  data?: any[];
  isLoading?: boolean;
}

const EficienciaDistritoChart: React.FC<DistrictEfficiencyRadarChartProps> = ({
  data,
  isLoading = false
}) => {
  const { sgzData } = useRankingCharts();
  const chartData = data || sgzData;
  
  const [districtEfficiency, setDistrictEfficiency] = useState<DistrictEfficiency[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  const chartRef = useRef<Chart<'radar'>>(null);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    if (chartData && chartData.length > 0) {
      try {
        // Create a map to track totals and completed counts by district
        const districtMap = new Map<string, { total: number; completed: number }>();
        
        chartData.forEach(item => {
          const district = item.sgz_distrito_id || 'Não informado';
          const status = (item.sgz_status || '').toLowerCase();
          const isCompleted = status.includes('conclu') || status.includes('atendid');
          
          if (!districtMap.has(district)) {
            districtMap.set(district, { total: 0, completed: 0 });
          }
          
          const current = districtMap.get(district)!;
          current.total += 1;
          
          if (isCompleted) {
            current.completed += 1;
          }
        });
        
        // Convert to array and calculate efficiency
        const efficiencyArray: DistrictEfficiency[] = Array.from(districtMap.entries())
          .map(([district, counts]) => ({
            district,
            total: counts.total,
            completed: counts.completed,
            efficiency: counts.total > 0 ? (counts.completed / counts.total) * 100 : 0
          }))
          .filter(item => item.total >= 10) // Only include districts with a meaningful number of orders
          .sort((a, b) => b.efficiency - a.efficiency);
        
        setDistrictEfficiency(efficiencyArray.slice(0, 8)); // Limit to top 8 districts for readability
      } catch (error) {
        console.error('Error processing district efficiency data:', error);
      }
    } else {
      setDistrictEfficiency([]);
    }
    
    setIsDataLoading(false);
  }, [chartData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'radar'> => {
    if (districtEfficiency.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: districtEfficiency.map(item => item.district),
      datasets: [
        {
          label: 'Eficiência de Atendimento (%)',
          data: districtEfficiency.map(item => item.efficiency),
          backgroundColor: getColorWithOpacity(lineChartColors[0], 0.2),
          borderColor: lineChartColors[0],
          borderWidth: 2,
          pointBackgroundColor: lineChartColors[0],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: lineChartColors[0],
          pointRadius: 4,
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const distIndex = context.dataIndex;
            const district = districtEfficiency[distIndex];
            return [
              `Eficiência: ${value.toFixed(1)}%`,
              `Concluídas: ${district?.completed} de ${district?.total}`
            ];
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`
        },
        pointLabels: {
          font: {
            size: 10
          }
        }
      }
    }
  };
  
  // Get the average efficiency
  const getAverageEfficiency = (): number => {
    if (districtEfficiency.length === 0) return 0;
    
    const totalEfficiency = districtEfficiency.reduce((sum, item) => sum + item.efficiency, 0);
    return totalEfficiency / districtEfficiency.length;
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (districtEfficiency.length === 0) {
      return { value: '0%', label: 'eficiência média', trend: 'neutral' as const };
    }
    
    const avgEfficiency = getAverageEfficiency();
    
    return {
      value: `${avgEfficiency.toFixed(1)}%`,
      label: 'eficiência média entre distritos',
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Eficiência por Distrito"
      subtitle="Taxa de conclusão por área administrativa"
      isLoading={isDataLoading}
      dataSource="SGZ"
      chartRef={chartRef}
      analysis={`Análise de eficiência por distrito: ${districtEfficiency.length > 0 
        ? `O distrito com maior eficiência é "${districtEfficiency[0].district}" (${districtEfficiency[0].efficiency.toFixed(1)}%).` 
        : 'Sem dados suficientes para análise.'}`}
    >
      <div className="h-72">
        <Radar ref={chartRef} data={prepareChartData()} options={chartOptions} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-2xl font-semibold text-orange-600">{insight.value}</p>
        <p className="text-sm text-gray-600">{insight.label}</p>
      </div>
    </ChartCard>
  );
};

export default EficienciaDistritoChart;
