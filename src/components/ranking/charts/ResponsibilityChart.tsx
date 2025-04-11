
import React from 'react';
import { Pie } from 'react-chartjs-2';
import EnhancedChartCard from './EnhancedChartCard';
import { pieChartColors } from '../utils/chartColors';

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
    if (!sgzData || sgzData.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 1,
          borderColor: '#fff'
        }],
        externalPercentage: 0
      };
    }
    
    // Count orders by responsibility
    const responsibilityCounts: Record<string, number> = {};
    let totalOrders = 0;
    
    sgzData.forEach(order => {
      const responsibility = order.sgz_responsavel || order.responsavel_classificado || 'Não informado';
      // Normalize responsibility names
      let normalizedResp = responsibility.toLowerCase();
      
      if (normalizedResp.includes('subpref')) {
        normalizedResp = 'Subprefeitura';
      } else if (normalizedResp.includes('ilume') || normalizedResp.includes('lume')) {
        normalizedResp = 'ILUME';
      } else if (normalizedResp.includes('enel') || normalizedResp.includes('eletr')) {
        normalizedResp = 'ENEL';
      } else if (normalizedResp.includes('sabesp') || normalizedResp.includes('água')) {
        normalizedResp = 'SABESP';
      } else if (normalizedResp.includes('amlurb') || normalizedResp.includes('limp')) {
        normalizedResp = 'AMLURB';
      } else if (normalizedResp === 'não informado') {
        normalizedResp = 'Não Classificado';
      } else if (!['Subprefeitura', 'ILUME', 'ENEL', 'SABESP', 'AMLURB', 'Não Classificado'].includes(normalizedResp)) {
        normalizedResp = 'Outros';
      }
      
      responsibilityCounts[normalizedResp] = (responsibilityCounts[normalizedResp] || 0) + 1;
      totalOrders++;
    });
    
    // Sort by count
    const sortedResponsibilities = Object.entries(responsibilityCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    
    const labels = sortedResponsibilities.map(([resp]) => resp);
    const values = sortedResponsibilities.map(([, count]) => count);
    
    // Calculate percentage of external (non-subprefeitura) orders
    const subprefeituraCount = responsibilityCounts['Subprefeitura'] || 0;
    const externalCount = totalOrders - subprefeituraCount;
    const externalPercentage = totalOrders > 0 ? Math.round((externalCount / totalOrders) * 100) : 0;
    
    // Apply simulation effect if active
    let simulatedValues = values;
    if (isSimulationActive) {
      simulatedValues = values.map((value, index) => {
        const respName = labels[index];
        // In simulation, slightly increase subprefeitura proportion
        if (respName === 'Subprefeitura') {
          return Math.round(value * 1.1);
        }
        return value;
      });
    }
    
    return {
      labels,
      datasets: [{
        data: simulatedValues,
        backgroundColor: pieChartColors.slice(0, labels.length),
        borderWidth: 1,
        borderColor: '#fff'
      }],
      externalPercentage
    };
  }, [sgzData, isSimulationActive]);

  return (
    <EnhancedChartCard
      title="Gráfico de Impacto dos Terceiros"
      subtitle="Mostra o impacto dos serviços externos na performance da Subprefeitura"
      value={`Externos: ${chartData.externalPercentage}%`}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Avalie como os serviços de responsabilidade externa afetam os indicadores internos e recomende ações para melhor gestão."
    >
      {!isLoading && chartData.labels.length > 0 && (
        <Pie
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
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
                    return `${label}: ${value} (${percentage})`;
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
