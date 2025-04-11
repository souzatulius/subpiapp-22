
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Bar } from 'react-chartjs-2';
import { barChartColors } from '../utils/chartColors';
import { compararBases, OSComparacao, ResultadoComparacao } from '@/hooks/ranking/utils/compararBases';
import { FileCheck2, FileX2 } from 'lucide-react';

interface ComparativoSGZPainelChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ComparativoSGZPainelChart: React.FC<ComparativoSGZPainelChartProps> = ({
  data,
  sgzData,
  painelData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Process SGZ and Painel data to compare and find inconsistencies
  const comparisonResult = React.useMemo(() => {
    if (!sgzData || !painelData || sgzData.length === 0 || painelData.length === 0) {
      return null;
    }
    
    // Use the comparison function from utils
    return compararBases(sgzData, painelData);
  }, [sgzData, painelData]);

  // Prepare chart data based on comparison results
  const chartData = React.useMemo(() => {
    if (!comparisonResult) return null;

    return {
      labels: ['Presentes em Ambos', 'Ausentes no Painel', 'Com Status Divergente'],
      datasets: [
        {
          label: 'Quantidade de Ordens de Serviço',
          data: [
            comparisonResult.totalSGZ - comparisonResult.divergencias.length,
            comparisonResult.ausentes.length,
            comparisonResult.divergenciasStatus.length
          ],
          backgroundColor: [
            barChartColors[2], // Green for matching
            barChartColors[0], // Blue for missing
            barChartColors[1]  // Orange for divergent
          ]
        }
      ]
    };
  }, [comparisonResult]);

  // Display the number of inconsistencies as the main value
  const divergenceCount = React.useMemo(() => {
    if (!comparisonResult) return "Sem dados";
    return comparisonResult.divergencias.length.toString();
  }, [comparisonResult]);

  return (
    <EnhancedChartCard
      title="Comparativo SGZ vs Painel"
      subtitle="Valida coerência dos dados entre SGZ e Painel da Zeladoria, indicando possíveis inconsistências"
      value={divergenceCount}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ e Painel da Zeladoria"
      analysis="Avalie as divergências encontradas entre SGZ e Painel e recomende procedimentos para melhorar a precisão dos dados."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center text-center">
            {(!sgzData || sgzData.length === 0) && (!painelData || painelData.length === 0) ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <FileX2 className="w-10 h-10 text-orange-300" />
                  <FileX2 className="w-10 h-10 text-blue-300" />
                </div>
                <div className="text-sm text-gray-500">
                  Sem dados do SGZ e do Painel para comparação
                </div>
              </>
            ) : !sgzData || sgzData.length === 0 ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <FileX2 className="w-10 h-10 text-orange-300" />
                  <FileCheck2 className="w-10 h-10 text-blue-500" />
                </div>
                <div className="text-sm text-gray-500">
                  Dados do Painel disponíveis, mas faltam dados do SGZ
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <FileCheck2 className="w-10 h-10 text-orange-500" />
                  <FileX2 className="w-10 h-10 text-blue-300" />
                </div>
                <div className="text-sm text-gray-500">
                  Dados do SGZ disponíveis, mas faltam dados do Painel
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center">
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
                      const value = context.raw as number;
                      const total = comparisonResult?.totalSGZ || 0;
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${context.label}: ${value} (${percentage}%)`;
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
                }
              }
            }}
          />
          
          {/* Show a summary of the comparison */}
          {comparisonResult && (
            <div className="mt-4 p-3 bg-blue-50 text-xs rounded border border-blue-100">
              <p className="font-medium text-blue-700">Resumo da comparação:</p>
              <ul className="mt-1 text-gray-600 space-y-1">
                <li>• Total SGZ: {comparisonResult.totalSGZ} ordens</li>
                <li>• Total Painel: {comparisonResult.totalPainel} ordens</li>
                <li>• Divergências de status: {comparisonResult.divergenciasStatus.length}</li>
                <li>• OS ausentes no Painel: {comparisonResult.ausentes.length}</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </EnhancedChartCard>
  );
};

export default ComparativoSGZPainelChart;
