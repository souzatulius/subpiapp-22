
import React from 'react';
import { Line } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';

interface EvolutionChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ 
  data, 
  sgzData, 
  painelData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    // Generate evolution data
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    // Regular trend
    const pendingTrend = [120, 132, 101, 134, 90, 110]; 
    const completedTrend = [90, 85, 104, 115, 125, 150];
    
    // Simulation would show better trends
    const pendingSimulation = isSimulationActive ? 
      pendingTrend.map(val => Math.round(val * 0.8)) : pendingTrend;
      
    const completedSimulation = isSimulationActive ?
      completedTrend.map(val => Math.round(val * 1.2)) : completedTrend;
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Pendentes',
          data: pendingSimulation,
          borderColor: '#F97316',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Concluídos',
          data: completedSimulation,
          borderColor: '#0EA5E9',
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }, [sgzData, painelData, isSimulationActive]);
  
  return (
    <EnhancedChartCard
      title="Evolução de Ordens"
      subtitle="Tendência de resolução ao longo do tempo"
      value="Histórico"
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
    >
      {!isLoading && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} ordens`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Quantidade de Ordens'
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default EvolutionChart;
