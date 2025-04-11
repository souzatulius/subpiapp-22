
import React from 'react';
import { Pie } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({
  data,
  sgzData,
  painelData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    // Mock data for responsibility distribution
    const labels = ['Subprefeitura', 'Terceirizado', 'Outra Secretaria', 'Concessionária', 'Cidadão'];
    const values = [40, 30, 15, 10, 5];
    
    // In simulation mode, adjust the distribution to show more handled by Subprefeitura
    const simulatedValues = isSimulationActive ? 
      [50, 25, 12, 8, 5] : values;
    
    return {
      labels,
      datasets: [{
        data: simulatedValues,
        backgroundColor: [
          '#F97316', // Orange (Subprefeitura)
          '#FB923C', // Light Orange (Terceirizado)
          '#FFA94D', // Very Light Orange (Outra Secretaria)
          '#0EA5E9', // Light Blue (Concessionária)
          '#38BDF8'  // Very Light Blue (Cidadão)
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    };
  }, [sgzData, painelData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Responsabilidade"
      subtitle="Distribuição por órgão responsável"
      value="Diversidade"
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
    >
      {!isLoading && (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 12,
                  font: {
                    size: 11
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value * 100) / total) + '%';
                    return `${label}: ${percentage}`;
                  }
                }
              }
            }
          }}
        />
      )}
    </EnhancedChartCard>
  );
};

export default ResponsibilityChart;
