
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Sankey } from 'react-chartjs-2';
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
  // This is a placeholder for a Sankey chart, which requires a specialized sankey plugin
  // and complex data processing for transitions between statuses
  
  const displayValue = React.useMemo(() => {
    if (!sgzData || sgzData.length === 0) {
      return "Sem dados";
    }
    
    return "Pendente → Análise → Execução";
  }, [sgzData]);

  return (
    <EnhancedChartCard
      title="Sankey de Transição de Status"
      subtitle="Fluxo visual dos caminhos das OS entre status, revelando padrões e gargalos"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Identifique gargalos mais comuns no fluxo de atendimento e recomende ações práticas para agilizar a resolução das OS."
    >
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
    </EnhancedChartCard>
  );
};

export default StatusTransitionChart;
