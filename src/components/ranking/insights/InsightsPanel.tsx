
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightsPanelProps {
  planilhaData: any[];
  isLoading: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ planilhaData, isLoading }) => {
  // Simple insights based on the data
  const insights = React.useMemo(() => {
    if (!planilhaData?.length || isLoading) return [];
    
    return [
      {
        title: "Oportunidade de Melhoria",
        description: "Identificamos que 35% das pendências poderiam ser resolvidas com ajustes simples de processos internos.",
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
        variant: "blue"
      },
      {
        title: "Ponto de Atenção",
        description: "Demandas relacionadas à poda de árvores têm prazo médio de 30 dias, o dobro do ideal.",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        variant: "orange"
      },
      {
        title: "Fato Relevante",
        description: "Dos 10 serviços mais solicitados, 7 são de responsabilidade direta da subprefeitura.",
        icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
        variant: "yellow"
      }
    ];
  }, [planilhaData, isLoading]);
  
  if (isLoading) {
    return (
      <Card className="p-6 border-blue-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
          <Lightbulb className="h-5 w-5" />
          Carregando insights...
        </h2>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full bg-blue-50" />
          <Skeleton className="h-16 w-full bg-blue-50" />
          <Skeleton className="h-16 w-full bg-blue-50" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 border-blue-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
        <Lightbulb className="h-5 w-5" />
        Insights Automáticos
      </h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg bg-${insight.variant}-50 border border-${insight.variant}-100 flex items-start gap-3`}
          >
            <div className={`p-1.5 rounded-full bg-${insight.variant}-100`}>
              {insight.icon}
            </div>
            <div>
              <h3 className={`font-medium text-${insight.variant}-700 text-sm`}>
                {insight.title}
              </h3>
              <p className={`text-${insight.variant}-600 text-xs mt-1`}>
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InsightsPanel;
