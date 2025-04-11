
import React, { useState } from 'react';
import InsightCard from './InsightCard';
import { useChatGPTInsight } from '@/hooks/ranking/useChatGPTInsight';
import { BarChart3, Lightbulb, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { indicadores, isLoading, error } = useChatGPTInsight(dadosPlanilha, uploadId);
  
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
      simulated.fechadas.comentario = "Ordens de serviço finalizadas oficialmente";
      simulated.fechadas.trend = "up";
    }
    
    if (simulated.pendentes) {
      // Decrease pending percentage
      const currentValue = parseFloat(simulated.pendentes.valor) || 0;
      const newValue = Math.max(currentValue - 10, 0); // Minimum 0%
      simulated.pendentes.valor = `${newValue.toFixed(1)}%`;
      simulated.pendentes.comentario = "Ainda em aberto, aguardando solução";
      simulated.pendentes.trend = "down";
    }
    
    if (simulated.canceladas) {
      // Adjust canceled percentage
      const currentValue = parseFloat(simulated.canceladas.valor) || 0;
      const newValue = Math.max(currentValue - 5, 0); // Minimum 0%
      simulated.canceladas.valor = `${newValue.toFixed(1)}%`;
      simulated.canceladas.comentario = "Solicitações encerradas sem execução";
      simulated.canceladas.trend = "down";
    }
    
    if (simulated.prazo_medio) {
      // Improve average resolution time by 30%
      const currentValue = parseFloat(simulated.prazo_medio.valor.split(' ')[0]) || 0;
      const newValue = Math.max(currentValue * 0.7, 1); // At least 1 day
      simulated.prazo_medio.valor = `${newValue.toFixed(1)} dias`;
      simulated.prazo_medio.comentario = "Média de dias entre abertura e execução das ordens";
      simulated.prazo_medio.trend = "down";
    }
    
    if (simulated.fora_do_prazo) {
      // Reduce overdue orders by 40%
      const currentValue = parseFloat(simulated.fora_do_prazo.valor.split(' ')[0]) || 0;
      const newValue = Math.max(currentValue * 0.6, 0); // Minimum 0
      simulated.fora_do_prazo.valor = `${newValue.toFixed(0)} OS`;
      simulated.fora_do_prazo.comentario = "Ultrapassaram o prazo de atendimento";
      simulated.fora_do_prazo.trend = "down";
    }
    
    return simulated;
  }, [indicadores, isSimulationActive]);

  const handleRefreshInsights = async () => {
    if (!dadosPlanilha || dadosPlanilha.length === 0) {
      toast.warning('Não há dados disponíveis para análise');
      return;
    }

    setIsRefreshing(true);
    toast.info('Atualizando análises...');
    
    // Force re-render of the component to trigger the useChatGPTInsight hook
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {isSimulationActive ? (
            <Lightbulb className="h-5 w-5 text-orange-600" />
          ) : (
            <BarChart3 className="h-5 w-5 text-blue-600" />
          )}
          <h2 className={`text-lg font-semibold ${
            isSimulationActive ? 'text-orange-600' : 'text-blue-600'
          }`}>
            {isSimulationActive ? 'Indicadores Simulados (Cenário Ideal)' : 'Indicadores Inteligentes'}
          </h2>
        </div>
        
        <div className="flex items-center">
          {isSimulationActive && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full mr-2">
              Simulação
            </span>
          )}
          
          <Button
            size="sm"
            variant="outline"
            className={`h-8 w-8 p-0 ${isRefreshing ? 'opacity-50' : ''}`}
            onClick={handleRefreshInsights}
            disabled={isRefreshing || !dadosPlanilha || dadosPlanilha.length === 0}
            title="Atualizar análises"
          >
            <RefreshCcw size={14} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          Erro ao carregar indicadores: {error}
        </motion.div>
      )}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <InsightCard 
          title="OS Fechadas" 
          value={simulatedIndicadores?.fechadas?.valor || '0%'} 
          comment={simulatedIndicadores?.fechadas?.comentario || 'Ordens de serviço finalizadas oficialmente'} 
          isLoading={isLoading || isRefreshing} 
          isSimulated={isSimulationActive}
          trend={simulatedIndicadores?.fechadas?.trend}
        />
        <InsightCard 
          title="OS Pendentes" 
          value={simulatedIndicadores?.pendentes?.valor || '0%'} 
          comment={simulatedIndicadores?.pendentes?.comentario || 'Ainda em aberto, aguardando solução'} 
          isLoading={isLoading || isRefreshing} 
          isSimulated={isSimulationActive}
          trend={simulatedIndicadores?.pendentes?.trend}
        />
        <InsightCard 
          title="OS Canceladas" 
          value={simulatedIndicadores?.canceladas?.valor || '0%'} 
          comment={simulatedIndicadores?.canceladas?.comentario || 'Solicitações encerradas sem execução'} 
          isLoading={isLoading || isRefreshing} 
          isSimulated={isSimulationActive}
          trend={simulatedIndicadores?.canceladas?.trend}
        />
        <InsightCard 
          title="Tempo de Atendimento" 
          value={simulatedIndicadores?.prazo_medio?.valor || '0 dias'} 
          comment={simulatedIndicadores?.prazo_medio?.comentario || 'Média de dias entre abertura e execução das ordens'} 
          isLoading={isLoading || isRefreshing} 
          isSimulated={isSimulationActive}
          trend={simulatedIndicadores?.prazo_medio?.trend}
        />
        <InsightCard 
          title="OS Fora do Prazo" 
          value={simulatedIndicadores?.fora_do_prazo?.valor || '0 OS'} 
          comment={simulatedIndicadores?.fora_do_prazo?.comentario || 'Ultrapassaram o prazo de atendimento'} 
          isLoading={isLoading || isRefreshing} 
          isSimulated={isSimulationActive}
          trend={simulatedIndicadores?.fora_do_prazo?.trend}
        />
      </motion.div>
    </div>
  );
};

export default DashboardCards;
