
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { barChartColors } from '../utils/chartColors';

interface OrdensDistritoChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const OrdensDistritoChart: React.FC<OrdensDistritoChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: barChartColors[0]
          }]
        },
        primaryMetric: {
          value: '0',
          label: 'ordens no total',
          trend: 'neutral'
        }
      };
    }

    // Count orders by district
    const districtCounts: Record<string, number> = {};
    
    data.forEach(order => {
      const district = order.sgz_distrito || 'Não informado';
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });
    
    // Sort districts by count (descending)
    const sortedDistricts = Object.entries(districtCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    
    // Take top 10 districts
    const topDistricts = sortedDistricts.slice(0, 10);
    
    const labels = topDistricts.map(([district]) => district);
    const values = topDistricts.map(([, count]) => count);
    
    // Find the district with the most orders
    const maxDistrict = topDistricts.length > 0 ? topDistricts[0][0] : 'N/A';
    const maxValue = topDistricts.length > 0 ? topDistricts[0][1] : 0;
    
    return {
      chartData: {
        labels,
        datasets: [{
          label: 'Ordens de Serviço',
          data: values,
          backgroundColor: barChartColors[0],
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)'
        }]
      },
      primaryMetric: {
        value: maxValue,
        label: maxDistrict,
        trend: 'neutral'
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Ordens por Distrito"
      subtitle="Distribuição territorial das solicitações"
      data={chartData.chartData}
      options={chartOptions}
      chartType="horizontalBar"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default OrdensDistritoChart;
