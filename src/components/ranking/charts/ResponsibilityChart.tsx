
import React from 'react';
import { Pie } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { pieChartColors, getServiceResponsibility } from '../utils/chartColors';
import { Briefcase } from 'lucide-react';

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
  // Process data to show service responsibility distribution
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Count orders by responsibility
    const responsibilityCounts: Record<string, number> = {
      'subprefeitura': 0,
      'dzu': 0,
      'enel': 0,
      'sabesp': 0,
      'selimp': 0,
      'outros': 0
    };
    
    // Use the service type to classify responsibility
    sgzData.forEach(item => {
      const serviceType = item.sgz_tipo_servico || '';
      const responsibility = getServiceResponsibility(serviceType) || 'outros';
      responsibilityCounts[responsibility] = (responsibilityCounts[responsibility] || 0) + 1;
    });
    
    // Prepare data for the chart
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    Object.entries(responsibilityCounts).forEach(([key, value], index) => {
      if (value > 0) {
        // Format label for display
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === 'dzu') label = 'DZU';
        if (key === 'enel') label = 'ENEL';
        if (key === 'sabesp') label = 'SABESP';
        if (key === 'selimp') label = 'SELIMP';
        if (key === 'subprefeitura') label = 'Subprefeitura';
        if (key === 'outros') label = 'Outros';
        
        labels.push(label);
        data.push(value);
        backgroundColors.push(pieChartColors[index % pieChartColors.length]);
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: '#fff'
        }
      ]
    };
  }, [sgzData]);

  // Calculate the percentage of OS that are not subprefeitura's responsibility
  const externalPercentage = React.useMemo(() => {
    if (!chartData || !chartData.datasets || chartData.datasets[0].data.length === 0) {
      return "Sem dados";
    }

    const total = chartData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
    if (total === 0) return "0%";
    
    let subprefeituraIndex = chartData.labels.findIndex((label: string) => label === "Subprefeitura");
    if (subprefeituraIndex === -1) subprefeituraIndex = 0;
    
    const subprefeituraCount = chartData.datasets[0].data[subprefeituraIndex] || 0;
    const externalCount = total - subprefeituraCount;
    const percentage = Math.round((externalCount / total) * 100);
    
    return `${percentage}%`;
  }, [chartData]);

  return (
    <EnhancedChartCard
      title="Impacto dos Terceiros"
      subtitle="Mostra o impacto dos serviços externos (DZU, ENEL, SABESP, SELIMP) na performance da Subprefeitura"
      value={externalPercentage}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Avalie como os serviços de responsabilidade externa afetam os indicadores internos e recomende ações para melhor gestão."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mb-2" />
            <div className="text-sm text-gray-500">
              Sem dados suficientes para classificar responsabilidades
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center">
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
                    font: { size: 11 }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw as number;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number;
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      ))}
    </EnhancedChartCard>
  );
};

export default ResponsibilityChart;
