
import React from 'react';
import { Radar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { pieChartColors, getColorWithOpacity } from '../utils/chartColors';

interface DistrictEfficiencyRadarChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const DistrictEfficiencyRadarChart: React.FC<DistrictEfficiencyRadarChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Process data to show district efficiency on various metrics
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Get unique districts
    const districts = [...new Set(sgzData.map(item => item.sgz_distrito))].filter(Boolean);
    
    // For demonstration, we'll create a radar chart with 5 metrics for each district
    // In a real implementation, these would be calculated from actual data
    const datasets = districts.slice(0, 5).map((district, index) => {
      // Generate simulated efficiency scores for each district
      const volume = isSimulationActive ? 
        Math.floor(Math.random() * 3) + 7 : // Simulation: 7-10
        Math.floor(Math.random() * 5) + 4;  // Regular: 4-9
      
      const timeEfficiency = isSimulationActive ?
        Math.floor(Math.random() * 3) + 7 :
        Math.floor(Math.random() * 6) + 3;
        
      const resolutionRate = isSimulationActive ?
        Math.floor(Math.random() * 3) + 7 :
        Math.floor(Math.random() * 7) + 2;
        
      const citizenSatisfaction = isSimulationActive ?
        Math.floor(Math.random() * 2) + 8 :
        Math.floor(Math.random() * 4) + 5;
        
      const resourceOptimization = isSimulationActive ?
        Math.floor(Math.random() * 3) + 7 :
        Math.floor(Math.random() * 5) + 4;
      
      return {
        label: district,
        data: [volume, timeEfficiency, resolutionRate, citizenSatisfaction, resourceOptimization],
        backgroundColor: getColorWithOpacity(pieChartColors[index % pieChartColors.length], 0.2),
        borderColor: pieChartColors[index % pieChartColors.length],
        borderWidth: 2,
        pointBackgroundColor: pieChartColors[index % pieChartColors.length],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: pieChartColors[index % pieChartColors.length]
      };
    });

    return {
      labels: [
        'Volume de Atendimento', 
        'Eficiência de Tempo', 
        'Taxa de Resolução', 
        'Satisfação Cidadão', 
        'Otimização de Recursos'
      ],
      datasets: datasets
    };
  }, [sgzData, isSimulationActive]);

  // Find the district with lowest average score
  const lowestEfficiencyDistrict = React.useMemo(() => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return "Sem dados suficientes";
    }

    let lowestAvg = Infinity;
    let lowestDistrict = "";
    
    chartData.datasets.forEach(dataset => {
      const avg = dataset.data.reduce((sum: number, val: number) => sum + val, 0) / dataset.data.length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestDistrict = dataset.label;
      }
    });
    
    return lowestDistrict || "Sem dados";
  }, [chartData]);

  return (
    <EnhancedChartCard
      title="Radar de Eficiência por Distrito"
      subtitle="Avalia distritos em volume, rapidez e conclusão das OS"
      value={lowestEfficiencyDistrict}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique o distrito com menor eficiência e recomende estratégias para melhorar desempenho."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-gray-500">
            Sem dados suficientes para gerar o radar de eficiência
          </div>
        </div>
      ) : (
        <Radar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                  stepSize: 2
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
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.r;
                    const index = context.dataIndex;
                    const metric = context.chart.data.labels?.[index];
                    return `${label}: ${metric} - ${value}`;
                  }
                }
              }
            }
          }}
        />
      ))}
    </EnhancedChartCard>
  );
};

export default DistrictEfficiencyRadarChart;
