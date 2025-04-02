
import React, { useEffect, useState } from 'react';
import { ChevronUp, Users, Clock, Star, Flag, BookOpen } from 'lucide-react';
import { SortableKPICard } from './components/SortableKPICard';
import { useReportsData } from './hooks/useReportsData';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

interface RelatoriosKPICardsProps {
  currentTheme?: string;
}

export const RelatoriosKPICards: React.FC<RelatoriosKPICardsProps> = ({ currentTheme = 'mixed' }) => {
  const { isLoading } = useReportsData();
  const [kpiOrder, setKpiOrder] = useState(['demandas', 'tempoResposta', 'satisfacao', 'crescimento', 'abertas']);
  
  // KPI data would typically come from your data hooks
  const kpiData = {
    demandas: {
      id: 'demandas',
      title: 'Total de Demandas',
      icon: <Users className="h-4 w-4" />,
      value: '497',
      change: 12.5,
      status: 'positive' as const,
      description: 'Total acumulado no período',
      secondary: 'Aumento de 12.5% em relação ao mês anterior'
    },
    tempoResposta: {
      id: 'tempoResposta',
      title: 'Tempo Médio de Resposta',
      icon: <Clock className="h-4 w-4" />,
      value: '5.2 dias',
      change: -8.4,
      status: 'positive' as const,
      description: 'Média do período selecionado',
      secondary: 'Redução de 8.4% em relação ao mês anterior'
    },
    satisfacao: {
      id: 'satisfacao',
      title: 'Índice de Satisfação',
      icon: <Star className="h-4 w-4" />,
      value: '87%',
      change: 3.2,
      status: 'positive' as const,
      description: 'Baseado em 245 avaliações',
      secondary: 'Aumento de 3.2% em relação ao mês anterior'
    },
    crescimento: {
      id: 'crescimento',
      title: 'Taxa de Crescimento',
      icon: <ChevronUp className="h-4 w-4" />,
      value: '15.3%',
      change: 5.1,
      status: 'positive' as const,
      description: 'Crescimento mensal',
      secondary: 'Aumento de 5.1% em relação ao mês anterior'
    },
    abertas: {
      id: 'abertas',
      title: 'Demandas Abertas',
      icon: <Flag className="h-4 w-4" />,
      value: '57',
      change: -12.3,
      status: 'negative' as const,
      description: 'Aguardando resolução',
      secondary: 'Diminuição de 12.3% em relação ao mês anterior'
    }
  };

  return (
    <div className="rounded-lg bg-white p-3 border border-orange-100">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium text-orange-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-600" />
          Indicadores Chave
        </h3>
      </div>
      
      <SortableContext items={kpiOrder} strategy={horizontalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiOrder.map((id) => (
            <SortableKPICard
              key={id}
              id={id}
              isLoading={isLoading}
              {...kpiData[id as keyof typeof kpiData]}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
