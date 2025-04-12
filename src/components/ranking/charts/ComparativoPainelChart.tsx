
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { barChartColors, getColorWithOpacity } from '../utils/chartColors';

interface ComparativoPainelChartProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const ComparativoPainelChart: React.FC<ComparativoPainelChartProps> = ({ 
  sgzData,
  painelData,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!sgzData || !painelData || sgzData.length === 0 || painelData.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: []
        },
        primaryMetric: {
          value: '0',
          label: 'ordens inconsistentes',
          trend: 'neutral'
        }
      };
    }

    // Compare counts by status
    // 1. Get status counts from SGZ data
    const sgzStatusCounts: Record<string, number> = {};
    sgzData.forEach(item => {
      const status = item.sgz_status || 'Não informado';
      sgzStatusCounts[status] = (sgzStatusCounts[status] || 0) + 1;
    });
    
    // 2. Get status counts from Painel data
    const painelStatusCounts: Record<string, number> = {};
    painelData.forEach(item => {
      const status = item.status || 'Não informado';
      painelStatusCounts[status] = (painelStatusCounts[status] || 0) + 1;
    });
    
    // 3. Get all unique statuses
    const allStatuses = Array.from(new Set([
      ...Object.keys(sgzStatusCounts),
      ...Object.keys(painelStatusCounts)
    ]));
    
    // 4. Create comparative data
    const comparativeData = allStatuses.map(status => {
      const sgzCount = sgzStatusCounts[status] || 0;
      const painelCount = painelStatusCounts[status] || 0;
      
      return {
        status,
        sgzCount,
        painelCount,
        difference: Math.abs(sgzCount - painelCount),
        percentDifference: Math.max(sgzCount, painelCount) > 0
          ? Math.abs(sgzCount - painelCount) / Math.max(sgzCount, painelCount) * 100
          : 0
      };
    });
    
    // 5. Sort by difference (descending)
    const sortedData = comparativeData
      .filter(item => item.difference > 0) // Only include items with differences
      .sort((a, b) => b.difference - a.difference)
      .slice(0, 5); // Take top 5 with the biggest differences
    
    // 6. Calculate total inconsistencies
    const totalOrders = Math.max(sgzData.length, painelData.length);
    const totalDifferences = comparativeData.reduce((sum, item) => sum + item.difference, 0);
    const percentInconsistent = totalOrders > 0 
      ? (totalDifferences / (2 * totalOrders) * 100).toFixed(1) 
      : '0';
    
    // Apply simulation effect - in ideal scenario, there would be fewer inconsistencies
    const simulatedPercent = isSimulationActive 
      ? (parseFloat(percentInconsistent) * 0.3).toFixed(1)  // 70% reduction
      : percentInconsistent;

    return {
      chartData: {
        labels: sortedData.map(item => item.status),
        datasets: [
          {
            label: 'SGZ',
            data: sortedData.map(item => item.sgzCount),
            backgroundColor: barChartColors[0],
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)'
          },
          {
            label: 'Painel',
            data: sortedData.map(item => item.painelCount),
            backgroundColor: barChartColors[1],
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)'
          }
        ]
      },
      primaryMetric: {
        value: `${simulatedPercent}%`,
        label: 'inconsistência',
        trend: 'down' // Lower is better for inconsistencies
      }
    };
  }, [sgzData, painelData, isSimulationActive]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: ${value} ordens`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Comparativo SGZ vs Painel"
      subtitle="Diferenças entre as duas bases de dados"
      data={chartData.chartData}
      options={chartOptions}
      chartType="bar"
      isLoading={isLoading}
      sourceLabel="Ambos"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default ComparativoPainelChart;
