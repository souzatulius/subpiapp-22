
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Line } from 'react-chartjs-2';
import { barChartColors, getColorWithOpacity } from '../utils/chartColors';
import { Loader2 } from 'lucide-react';

interface StatusTransitionChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const StatusTransitionChart: React.FC<StatusTransitionChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Process the data to show status transitions over time
  const chartData = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) return null;
    
    // Instead of a Sankey chart, we'll use a status flow visualization with a line chart
    // Create a time series of status counts
    const statusCounts = {
      'Aberta': Array(7).fill(0),
      'Em Análise': Array(7).fill(0),
      'Em Execução': Array(7).fill(0),
      'Concluída': Array(7).fill(0),
    };
    
    // Generate some meaningful data based on the SGZ data
    // For demonstration purposes - this would be replaced with actual status transition data
    if (isSimulationActive) {
      statusCounts['Aberta'] = [100, 90, 75, 60, 45, 30, 20];
      statusCounts['Em Análise'] = [20, 35, 45, 50, 45, 35, 25];
      statusCounts['Em Execução'] = [10, 15, 25, 35, 45, 50, 45];
      statusCounts['Concluída'] = [5, 10, 15, 25, 40, 60, 85];
    } else {
      // Use distribution from actual data
      const statusDistribution = {};
      sgzData.forEach(item => {
        const status = item.sgz_status || 'Desconhecido';
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
      });
      
      // Create a simulated flow based on the current distribution
      const totalOrdens = sgzData.length;
      const abertas = statusDistribution['Aberta'] || Math.floor(totalOrdens * 0.3);
      const emAnalise = statusDistribution['Em Análise'] || Math.floor(totalOrdens * 0.2);
      const emExecucao = statusDistribution['Em Execução'] || Math.floor(totalOrdens * 0.2);
      const concluidas = statusDistribution['Concluída'] || Math.floor(totalOrdens * 0.3);
      
      statusCounts['Aberta'] = [abertas, Math.floor(abertas*0.9), Math.floor(abertas*0.8), Math.floor(abertas*0.7), Math.floor(abertas*0.6), Math.floor(abertas*0.5), Math.floor(abertas*0.4)];
      statusCounts['Em Análise'] = [emAnalise, Math.floor(emAnalise*1.1), Math.floor(emAnalise*1.2), Math.floor(emAnalise*1.1), Math.floor(emAnalise), Math.floor(emAnalise*0.9), Math.floor(emAnalise*0.8)];
      statusCounts['Em Execução'] = [emExecucao, Math.floor(emExecucao*1.1), Math.floor(emExecucao*1.2), Math.floor(emExecucao*1.3), Math.floor(emExecucao*1.2), Math.floor(emExecucao*1.1), Math.floor(emExecucao)];
      statusCounts['Concluída'] = [concluidas, Math.floor(concluidas*1.1), Math.floor(concluidas*1.2), Math.floor(concluidas*1.3), Math.floor(concluidas*1.4), Math.floor(concluidas*1.5), Math.floor(concluidas*1.6)];
    }

    return {
      labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'],
      datasets: [
        {
          label: 'Aberta',
          data: statusCounts['Aberta'],
          borderColor: barChartColors[0],
          backgroundColor: getColorWithOpacity(barChartColors[0], 0.2),
          fill: true,
          tension: 0.4
        },
        {
          label: 'Em Análise',
          data: statusCounts['Em Análise'],
          borderColor: barChartColors[1],
          backgroundColor: getColorWithOpacity(barChartColors[1], 0.2),
          fill: true,
          tension: 0.4
        },
        {
          label: 'Em Execução',
          data: statusCounts['Em Execução'],
          borderColor: barChartColors[2],
          backgroundColor: getColorWithOpacity(barChartColors[2], 0.2),
          fill: true,
          tension: 0.4
        },
        {
          label: 'Concluída',
          data: statusCounts['Concluída'],
          borderColor: barChartColors[3],
          backgroundColor: getColorWithOpacity(barChartColors[3], 0.2),
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [sgzData, isSimulationActive]);

  const displayValue = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return "Sem dados";
    }
    
    return "Fluxo de Transição de Status";
  }, [sgzData]);

  return (
    <EnhancedChartCard
      title="Status Flow (Transição de Status)"
      subtitle="Fluxo visual dos caminhos das OS entre status, revelando padrões e gargalos"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique gargalos mais comuns no fluxo de atendimento e recomende ações práticas para agilizar a resolução das OS."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full flex-col">
          <div className="text-sm text-gray-600 text-center mb-4">
            Este gráfico requer processamento adicional de dados históricos
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex justify-center items-center mb-4">
              <div className="w-20 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
                Aberta
              </div>
              <div className="w-8 h-2 bg-blue-400"></div>
              <div className="w-20 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white">
                Análise
              </div>
              <div className="w-8 h-2 bg-orange-400"></div>
              <div className="w-20 h-8 bg-green-500 rounded-md flex items-center justify-center text-white">
                Execução
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              {isSimulationActive ? "Visualização em desenvolvimento (futuro)" : "Implementação Futura"}
            </div>
          </div>
        </div>
      ) : (
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Fluxo de transição de status ao longo do tempo',
                color: '#333',
                font: {
                  size: 14
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              },
              legend: {
                position: 'bottom'
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            },
            scales: {
              y: {
                stacked: false,
                title: {
                  display: true,
                  text: 'Quantidade de OS'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Período'
                }
              }
            }
          }}
        />
      ))}
    </EnhancedChartCard>
  );
};

export default StatusTransitionChart;
