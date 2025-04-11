
import React from 'react';
import { Bar } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';

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
    // Here you would normally process sgzData to get the district performance metrics
    // For now, returning mock data
    const labels = ['Distrito 1', 'Distrito 2', 'Distrito 3', 'Distrito 4', 'Distrito 5'];
    const values = isSimulationActive 
      ? [85, 78, 75, 72, 70] // Simulation values (improved)
      : [75, 68, 65, 62, 60]; // Regular values
    
    return {
      labels,
      datasets: [
        {
          label: 'Performance (%)',
          data: values,
          backgroundColor: '#F97316',
          barPercentage: 0.7,
        }
      ]
    };
  }, [sgzData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Performance por Distrito"
      subtitle="Classificação dos distritos por eficiência"
      value="Ranking"
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
                    return `Performance: ${context.parsed.y}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Performance (%)'
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
