
import React from 'react';
import { Bar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { barChartColors } from '../utils/chartColors';

interface DistrictPerformanceChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Generate district performance data
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Ordens de Serviço',
          data: [],
          backgroundColor: barChartColors[0],
          barPercentage: 0.7,
        }]
      };
    }
    
    // Count orders by district
    const districtCounts: Record<string, number> = {};
    
    sgzData.forEach(order => {
      const district = order.sgz_distrito || 'Não informado';
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });
    
    // Sort districts by order count, descending
    const sortedDistricts = Object.entries(districtCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 7); // Take top 7 districts
    
    const labels = sortedDistricts.map(([district]) => district);
    const values = sortedDistricts.map(([, count]) => count);
    
    // Simulation effect - slight randomization for demonstration
    const simulatedValues = isSimulationActive 
      ? values.map(v => Math.round(v * (1 + Math.random() * 0.1))) 
      : values;
    
    // Find max value for display
    const maxDistrict = sortedDistricts.length > 0 ? sortedDistricts[0][0] : 'N/A';
    const maxValue = sortedDistricts.length > 0 ? sortedDistricts[0][1] : 0;
    
    return {
      labels,
      datasets: [
        {
          label: 'Ordens de Serviço',
          data: simulatedValues,
          backgroundColor: barChartColors[0],
          barPercentage: 0.7,
        }
      ],
      maxDistrict,
      maxValue
    };
  }, [sgzData, isSimulationActive]);

  // Determine the max district for the display value
  const displayValue = React.useMemo(() => {
    if (!chartData.maxDistrict || chartData.maxDistrict === 'N/A') {
      return "Sem dados";
    }
    return `${chartData.maxDistrict}: ${chartData.maxValue}`;
  }, [chartData]);

  return (
    <EnhancedChartCard
      title="Ordens por Distrito"
      subtitle="Distribuição das OS por distrito em barras verticais, mostrando volume geográfico das demandas"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique o distrito com maior demanda e sugira estratégias de priorização e planejamento de recursos."
    >
      {!isLoading && chartData.labels.length > 0 && (
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Ordens: ${context.parsed.y}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Quantidade de OS'
                }
              },
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default DistrictPerformanceChart;
