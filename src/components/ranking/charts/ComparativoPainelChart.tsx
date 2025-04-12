
import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartCard from './ChartCard';
import { barChartColors } from '@/components/ranking/utils/chartColors';

interface DataSource {
  name: string;
  pendingCount: number;
  completedCount: number;
  totalCount: number;
}

interface ComparativoSGZPainelChartProps {
  sgzData?: any[];
  painelData?: any[];
  isLoading?: boolean;
}

const ComparativoSGZPainelChart: React.FC<ComparativoSGZPainelChartProps> = ({
  sgzData: sgzDataProp,
  painelData: painelDataProp,
  isLoading = false
}) => {
  const { sgzData: storeData, painelData: storePainelData } = useRankingCharts();
  const sgzData = sgzDataProp || storeData;
  const painelData = painelDataProp || storePainelData;
  
  const [sourceComparison, setSourceComparison] = useState<DataSource[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(isLoading);
  const [discrepancy, setDiscrepancy] = useState<number>(0);
  const chartRef = useRef<Chart<'bar'>>(null);
  
  // Process data whenever it changes
  useEffect(() => {
    setIsDataLoading(true);
    
    try {
      const sources: DataSource[] = [
        { name: 'SGZ', pendingCount: 0, completedCount: 0, totalCount: 0 },
        { name: 'Painel', pendingCount: 0, completedCount: 0, totalCount: 0 }
      ];
      
      // Process SGZ data
      if (sgzData && sgzData.length > 0) {
        sources[0].totalCount = sgzData.length;
        
        sgzData.forEach(item => {
          const status = (item.sgz_status || '').toLowerCase();
          
          if (status.includes('conclu') || status.includes('atendid')) {
            sources[0].completedCount += 1;
          } else {
            sources[0].pendingCount += 1;
          }
        });
      }
      
      // Process Painel data
      if (painelData && painelData.length > 0) {
        sources[1].totalCount = painelData.length;
        
        painelData.forEach(item => {
          const status = (item.status || '').toLowerCase();
          
          if (status.includes('conclu') || status.includes('atendid')) {
            sources[1].completedCount += 1;
          } else {
            sources[1].pendingCount += 1;
          }
        });
      }
      
      // Calculate discrepancy percentage
      if (sources[0].totalCount > 0 && sources[1].totalCount > 0) {
        const diff = Math.abs(sources[0].totalCount - sources[1].totalCount);
        const max = Math.max(sources[0].totalCount, sources[1].totalCount);
        setDiscrepancy((diff / max) * 100);
      } else {
        setDiscrepancy(0);
      }
      
      setSourceComparison(sources);
    } catch (error) {
      console.error('Error processing comparison data:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, [sgzData, painelData]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData<'bar'> => {
    if (sourceComparison.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: sourceComparison.map(source => source.name),
      datasets: [
        {
          label: 'Concluídas',
          data: sourceComparison.map(source => source.completedCount),
          backgroundColor: barChartColors[2], // Green
          borderWidth: 0,
        },
        {
          label: 'Pendentes',
          data: sourceComparison.map(source => source.pendingCount),
          backgroundColor: barChartColors[1], // Orange
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
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const sourceIndex = context.dataIndex;
            const source = sourceComparison[sourceIndex];
            const percentage = source.totalCount > 0 
              ? ((value / source.totalCount) * 100).toFixed(1) + '%'
              : '0%';
            
            return `${context.dataset.label}: ${value} (${percentage})`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };
  
  // Get primary insight
  const getPrimaryInsight = () => {
    if (discrepancy === 0 || sourceComparison.length < 2) {
      return { value: '0%', label: 'diferença entre bases', trend: 'neutral' as const };
    }
    
    return {
      value: `${discrepancy.toFixed(1)}%`,
      label: 'diferença entre bases de dados',
      trend: 'neutral' as const
    };
  };
  
  const insight = getPrimaryInsight();
  
  return (
    <ChartCard
      title="Comparativo SGZ vs Painel"
      subtitle="Diferenças entre as duas bases de dados"
      isLoading={isDataLoading}
      dataSource="Ambos"
      chartRef={chartRef}
      analysis={`Análise comparativa: ${sourceComparison.length > 0 
        ? `Existe uma diferença de ${discrepancy.toFixed(1)}% entre as bases SGZ (${sourceComparison[0].totalCount} registros) e Painel (${sourceComparison[1].totalCount} registros).` 
        : 'Sem dados suficientes para análise.'}`}
    >
      <div className="h-72">
        <Bar ref={chartRef} data={prepareChartData()} options={chartOptions} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-2xl font-semibold text-orange-600">{insight.value}</p>
        <p className="text-sm text-gray-600">{insight.label}</p>
      </div>
    </ChartCard>
  );
};

export default ComparativoSGZPainelChart;
