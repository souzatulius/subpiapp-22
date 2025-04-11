
import React from 'react';
import { Pie } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    // Mock data for service types
    const labels = ['Iluminação', 'Pavimentação', 'Limpeza', 'Poda', 'Sinalização', 'Outros'];
    const values = [30, 25, 20, 15, 5, 5];
    
    // In simulation mode, adjust the distribution slightly
    const simulatedValues = isSimulationActive ? 
      [27, 23, 18, 17, 10, 5] : values;
    
    return {
      labels,
      datasets: [{
        data: simulatedValues,
        backgroundColor: [
          '#F97316', // Orange
          '#FB923C', // Light Orange
          '#FFA94D', // Very Light Orange
          '#0EA5E9', // Light Blue
          '#38BDF8', // Very Light Blue
          '#E2E8F0'  // Gray
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    };
  }, [sgzData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Tipos de Serviço"
      subtitle="Distribuição das ordens por categoria"
      value="Categorias"
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

export default ServiceTypesChart;
