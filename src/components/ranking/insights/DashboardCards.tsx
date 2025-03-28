
import React from 'react';
import InsightCard from './InsightCard';
import { useChatGPTInsight } from '@/hooks/ranking/useChatGPTInsight';
import { BarChart3 } from 'lucide-react';

interface DashboardCardsProps {
  dadosPlanilha: any[];
  uploadId?: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ dadosPlanilha, uploadId }) => {
  const { indicadores, isLoading } = useChatGPTInsight(dadosPlanilha, uploadId);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-800">Indicadores Inteligentes</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <InsightCard 
          title="% de OS Fechadas" 
          value={indicadores?.fechadas?.valor || '0%'} 
          comment={indicadores?.fechadas?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
        />
        <InsightCard 
          title="% de OS Pendentes" 
          value={indicadores?.pendentes?.valor || '0%'} 
          comment={indicadores?.pendentes?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
        />
        <InsightCard 
          title="% de OS Canceladas" 
          value={indicadores?.canceladas?.valor || '0%'} 
          comment={indicadores?.canceladas?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
        />
        <InsightCard 
          title="Prazo Médio de Atendimento" 
          value={indicadores?.prazo_medio?.valor || '0 dias'} 
          comment={indicadores?.prazo_medio?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
        />
        <InsightCard 
          title="OS Fora do Prazo" 
          value={indicadores?.fora_do_prazo?.valor || '0 OS'} 
          comment={indicadores?.fora_do_prazo?.comentario || 'Carregando análise...'} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default DashboardCards;
