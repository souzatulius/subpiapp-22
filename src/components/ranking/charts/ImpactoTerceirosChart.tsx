
import React, { useMemo } from 'react';
import ZeladoriaChartCard from './ZeladoriaChartCard';
import { ChartOptions } from 'chart.js';
import { pieChartColors } from '../utils/chartColors';

interface ImpactoTerceirosChartProps {
  data: any[] | null;
  isLoading: boolean;
  isSimulationActive?: boolean;
}

const ImpactoTerceirosChart: React.FC<ImpactoTerceirosChartProps> = ({ 
  data,
  isLoading,
  isSimulationActive = false
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: pieChartColors
          }]
        },
        primaryMetric: {
          value: '0%',
          label: 'ordens de terceiros',
          trend: 'neutral'
        }
      };
    }

    // Count orders by responsible entity
    const responsibleCounts: Record<string, number> = {};
    
    data.forEach(order => {
      let responsible = order.servico_responsavel || 'Não informado';
      
      // Normalize common responsible entities
      if (responsible.toLowerCase().includes('subpref')) {
        responsible = 'Subprefeitura';
      } else if (responsible.toLowerCase().includes('enel')) {
        responsible = 'ENEL';
      } else if (responsible.toLowerCase().includes('sabesp')) {
        responsible = 'SABESP';
      } else if (responsible.toLowerCase().includes('comgás')) {
        responsible = 'COMGÁS';
      } else if (!['Subprefeitura', 'ENEL', 'SABESP', 'COMGÁS'].includes(responsible)) {
        responsible = 'Outros';
      }
      
      responsibleCounts[responsible] = (responsibleCounts[responsible] || 0) + 1;
    });
    
    // Sort by count (descending)
    const sortedResponsibles = Object.entries(responsibleCounts)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number));
    
    const labels = sortedResponsibles.map(([responsible]) => responsible);
    const values = sortedResponsibles.map(([, count]) => count);
    
    // Calculate third-party percentage
    const totalOrders = data.length;
    const subprefOrders = responsibleCounts['Subprefeitura'] || 0;
    const thirdPartyOrders = totalOrders - subprefOrders;
    const thirdPartyPercentage = totalOrders > 0 
      ? ((thirdPartyOrders / totalOrders) * 100).toFixed(1) 
      : '0';
      
    // Apply simulation effect - in ideal scenario, third-party coordination would be better
    const simulatedPercentage = isSimulationActive 
      ? ((parseFloat(thirdPartyPercentage) * 0.9).toFixed(1))  // 10% reduction
      : thirdPartyPercentage;
    
    return {
      chartData: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: pieChartColors,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      primaryMetric: {
        value: `${simulatedPercentage}%`,
        label: 'ordens de terceiros',
        trend: thirdPartyOrders > (totalOrders * 0.3) ? 'down' : 'up'
      }
    };
  }, [data, isSimulationActive]);

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
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
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((sum, val) => sum + (val as number), 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ZeladoriaChartCard
      title="Impacto de Terceiros"
      subtitle="Responsáveis por execução fora da Subprefeitura"
      data={chartData.chartData}
      options={chartOptions}
      chartType="pie"
      isLoading={isLoading}
      sourceLabel="SGZ"
      primaryMetric={chartData.primaryMetric}
      height={280}
    />
  );
};

export default ImpactoTerceirosChart;
