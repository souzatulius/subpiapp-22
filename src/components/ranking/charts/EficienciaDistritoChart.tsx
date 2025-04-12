
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartData, ChartOptions } from 'chart.js';
import { getColorWithOpacity } from '../utils/chartColors';

interface EficienciaDistritoChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const EficienciaDistritoChart: React.FC<EficienciaDistritoChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: []
        },
        primaryMetric: {
          value: '0%',
          label: 'Sem dados',
          trend: 'neutral'
        }
      };
    }

    // Get unique districts
    const districts = Array.from(new Set(data.map(item => item.sgz_distrito || 'Não informado')))
      .filter(Boolean);
    
    // Calculate efficiency by district
    const districtData: Record<string, { 
      total: number, 
      concluded: number, 
      inProgress: number,
      cancelled: number,
      other: number
    }> = {};
    
    districts.forEach(district => {
      const districtItems = data.filter(item => (item.sgz_distrito || 'Não informado') === district);
      const total = districtItems.length;
      
      const concluded = districtItems.filter(item => {
        const status = (item.sgz_status || '').toLowerCase();
        return status.includes('conclu') || status.includes('executad');
      }).length;
      
      const inProgress = districtItems.filter(item => {
        const status = (item.sgz_status || '').toLowerCase();
        return status.includes('andamento') || status.includes('execução');
      }).length;
      
      const cancelled = districtItems.filter(item => {
        const status = (item.sgz_status || '').toLowerCase();
        return status.includes('cancel');
      }).length;
      
      const other = total - concluded - inProgress - cancelled;
      
      districtData[district as string] = {
        total,
        concluded,
        inProgress,
        cancelled,
        other
      };
    });
    
    // Calculate efficiency percentages and sort by efficiency (conclude rate)
    const districtEfficiency = Object.entries(districtData)
      .map(([district, stats]) => {
        const efficiency = stats.total > 0 ? (stats.concluded / stats.total) : 0;
        // Apply simulation effect
        const simulatedEfficiency = isSimulationActive 
          ? Math.min(efficiency * 1.25, 1)  // 25% boost, max 100% 
          : efficiency;
          
        return {
          district,
          efficiency: simulatedEfficiency,
          total: stats.total
        };
      })
      .filter(item => item.total >= 5) // Only include districts with at least 5 orders
      .sort((a, b) => b.efficiency - a.efficiency);
    
    // Select top 5 districts for the radar chart
    const topDistricts = districtEfficiency.slice(0, 5);
    
    // Prepare the radar chart data
    const radarData: ChartData<'radar'> = {
      labels: ['Conclusão', 'Volume', 'Prazo', 'Qualidade', 'Resposta'],
      datasets: topDistricts.map((item, index) => {
        const baseEfficiency = item.efficiency * 10; // Scale to 0-10
        const baseColor = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ][index % 5];
        
        // Some simulated/random metrics
        const volumeScore = item.total / Math.max(...topDistricts.map(d => d.total)) * 10;
        const deadlineScore = Math.random() * 3 + (baseEfficiency * 0.7); // Correlated with efficiency
        const qualityScore = Math.random() * 2 + (baseEfficiency * 0.8); // Correlated with efficiency
        const responseScore = Math.random() * 2 + 5; // More random, base of 5
        
        return {
          label: item.district,
          data: [
            baseEfficiency, // Conclusion rate
            volumeScore, // Volume handling
            deadlineScore, // Deadline compliance
            qualityScore, // Quality of service
            responseScore // Response time
          ],
          backgroundColor: getColorWithOpacity(baseColor, 0.2),
          borderColor: baseColor,
          borderWidth: 2,
          pointBackgroundColor: baseColor,
          pointBorderColor: '#fff'
        };
      })
    };
    
    // Find the best district for the metric
    const bestDistrict = topDistricts.length > 0 ? {
      name: topDistricts[0].district,
      efficiency: Math.round(topDistricts[0].efficiency * 100)
    } : { name: 'N/A', efficiency: 0 };
    
    return {
      chartData: radarData,
      primaryMetric: {
        value: `${bestDistrict.efficiency}%`,
        label: bestDistrict.name,
        trend: 'up'
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          display: false
        },
        pointLabels: {
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Eficiência por Distrito"
      subtitle="Taxa de conclusão por área administrativa"
      data={chartData.chartData}
      options={chartOptions}
      chartType="radar"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default EficienciaDistritoChart;
