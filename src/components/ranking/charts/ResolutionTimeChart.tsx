
import React from 'react';
import { Bar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';

interface ResolutionTimeChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    const serviceTypes = ['Luz', 'Asfalto', 'Entulho', 'Árvores', 'Sinalização'];
    
    // Regular resolution times in days
    const resolutionTimes = [25, 15, 10, 20, 7];
    
    // Simulation would show better resolution times
    const simulatedTimes = isSimulationActive ? 
      resolutionTimes.map(time => Math.round(time * 0.8)) : resolutionTimes;
    
    return {
      labels: serviceTypes,
      datasets: [{
        label: 'Tempo Médio (dias)',
        data: simulatedTimes,
        backgroundColor: [
          '#06B6D4', // Cyan
          '#0EA5E9', // Light Blue
          '#3B82F6', // Blue
          '#6366F1', // Indigo
          '#8B5CF6'  // Violet
        ],
        barPercentage: 0.7,
      }]
    };
  }, [sgzData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Tempo de Resolução"
      subtitle="Dias médios até conclusão por tipo de serviço"
      value="Eficiência"
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
    >
      {!isLoading && (
        <Bar
          data={chartData}
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
                    return `Tempo médio: ${context.parsed.y} dias`;
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
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default ResolutionTimeChart;
