
import React from 'react';
import InsightCard from './InsightCard';
import { useChatGPTInsight } from '@/hooks/ranking/useChatGPTInsight';
import { BarChart3 } from 'lucide-react';

interface DashboardCardsProps {
  dadosPlanilha: any[];
  dadosPainel?: any[] | null;
  uploadId?: string;
  isSimulationActive?: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  dadosPlanilha, 
  dadosPainel, 
  uploadId,
  isSimulationActive = false
}) => {
  const { indicadores, isLoading } = useChatGPTInsight(dadosPlanilha, uploadId);
  
  // Apply simulation adjustments to indicators if simulation is active
  const simulatedIndicadores = React.useMemo(() => {
    if (!isSimulationActive || !indicadores) return indicadores;
    
    // Create a deep copy to avoid mutating the original
    const simulated = JSON.parse(JSON.stringify(indicadores));
    
    // Apply improvements in the "ideal" scenario
    if (simulated.fechadas) {
      // Increase closed percentage by 15-20%
      const currentValue = parseFloat(simulated.fechadas.valor) || 0;
      const newValue = Math.min(currentValue + 15, 100); // Cap at 100%
      simulated.fechadas.valor = `${newValue.toFixed(1)}%`;
      simulated.fechadas.comentario = "Simulação de cenário ideal: cancelamento de OS externas e fechamento de todas as CONC.";
    }
    
    if (simulated.pendentes) {
      // Decrease pending percentage
      const currentValue = parseFloat(simulated.pendentes.valor) || 0;
      const newValue = Math.max(currentValue - 10, 0); // Minimum 0%
      simulated.pendentes.valor = `${newValue.toFixed(1)}%`;
      simulated.pendentes.comentario = "Simulação: redução das OS pendentes após cancelamento de externas.";
    }
    
    if (simulated.canceladas) {
      // Adjust canceled percentage
      const currentValue = parseFloat(simulated.canceladas.valor) || 0;
      const newValue = Math.max(currentValue - 5, 0); // Minimum 0%
      simulated.canceladas.valor = `${newValue.toFixed(1)}%`;
      simulated.canceladas.comentario = "Simulação: redistribuição de OS canceladas em cenário ideal.";
    }
    
    if (simulated.prazo_medio) {
      // Improve average resolution time by 30%
      const currentValue = parseFloat(simulated.prazo_medio.valor.split(' ')[0]) || 0;
      const newValue = Math.max(currentValue * 0.7, 1); // At least 1 day
      simulated.prazo_medio.valor = `${newValue.toFixed(1)} dias`;
      simulated.prazo_medio.comentario = "Simulação: melhoria no tempo médio após cancelamento de OS problemáticas.";
    }
    
    if (simulated.fora_do_prazo) {
      // Reduce overdue orders by 40%
      const currentValue = parseFloat(simulated.fora_do_prazo.valor.split(' ')[0]) || 0;
      const newValue = Math.max(currentValue * 0.6, 0); // Minimum 0
      simulated.fora_do_prazo.valor = `${newValue.toFixed(0)} OS`;
      simulated.fora_do_prazo.comentario = "Simulação: redução das OS fora do prazo após cancelamento de externas.";
    }
    
    return simulated;
  }, [indicadores, isSimulationActive]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          {isSimulationActive ? 'Indicadores Simulados (Cenário Ideal)' : 'Indicadores Inteligentes'}
        </h2>
        {isSimulationActive && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
            Simulação
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <InsightCard 
          title="% de OS Fechadas" 
          value={simulatedIndicadores?.fechadas?.valor || '0%'} 
          comment={simulatedIndicadores?.fechadas?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
          isSimulated={isSimulationActive}
        />
        <InsightCard 
          title="% de OS Pendentes" 
          value={simulatedIndicadores?.pendentes?.valor || '0%'} 
          comment={simulatedIndicadores?.pendentes?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
          isSimulated={isSimulationActive}
        />
        <InsightCard 
          title="% de OS Canceladas" 
          value={simulatedIndicadores?.canceladas?.valor || '0%'} 
          comment={simulatedIndicadores?.canceladas?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
          isSimulated={isSimulationActive}
        />
        <InsightCard 
          title="Prazo Médio de Atendimento" 
          value={simulatedIndicadores?.prazo_medio?.valor || '0 dias'} 
          comment={simulatedIndicadores?.prazo_medio?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
          isSimulated={isSimulationActive}
        />
        <InsightCard 
          title="OS Fora do Prazo" 
          value={simulatedIndicadores?.fora_do_prazo?.valor || '0 OS'} 
          comment={simulatedIndicadores?.fora_do_prazo?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
          isSimulated={isSimulationActive}
        />
      </div>
      
      {dadosPainel && dadosPainel.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 bg-orange-50 p-3 rounded-md border border-orange-200">
          <span className="font-medium">Análise Comparativa:</span> {
            isSimulationActive 
              ? "Os indicadores simulados mostram a projeção ideal considerando o tratamento adequado das OS externas."
              : "Os dados do Painel da Zeladoria foram carregados e estão sendo considerados na análise."
          }
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
