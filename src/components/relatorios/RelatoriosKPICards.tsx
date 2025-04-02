
import React, { useState, useEffect } from 'react';
import { useCardStatsData } from './hooks/reports/useCardStatsData';
import { SortableKPICard } from './components/SortableKPICard';
import { Clock, FileText, MessageSquare, Percent } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

interface CardData {
  id: string;
  title: string;
  icon: JSX.Element;
  value: string | number;
  change?: number;
  status: 'positive' | 'negative' | 'neutral';
  description: string;
  secondary?: string;
}

interface RelatoriosKPICardsProps {
  isEditMode?: boolean;
}

export const RelatoriosKPICards: React.FC<RelatoriosKPICardsProps> = ({ isEditMode = false }) => {
  const { cardStats, fetchCardStats, isLoadingCards } = useCardStatsData();
  const [cards, setCards] = useLocalStorage<string[]>('relatorios-kpi-order', [
    'demandas', 'notas', 'tempo', 'aprovacao'
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = cards.indexOf(active.id.toString());
      const newIndex = cards.indexOf(over.id.toString());
      
      setCards(arrayMove(cards, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    fetchCardStats();
    const interval = setInterval(() => {
      fetchCardStats();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [fetchCardStats]);

  const cardData: Record<string, CardData> = {
    demandas: {
      id: 'demandas',
      title: 'Demandas do Dia',
      icon: <MessageSquare className="h-5 w-5" />,
      value: cardStats.totalDemandas,
      change: cardStats.demandasVariacao,
      status: cardStats.demandasVariacao >= 0 ? 'positive' : 'negative',
      description: 'Demandas cadastradas hoje',
      secondary: `${Math.abs(cardStats.demandasVariacao)}% em relação a ontem`
    },
    notas: {
      id: 'notas',
      title: 'Notas de Imprensa',
      icon: <FileText className="h-5 w-5" />,
      value: cardStats.totalNotas,
      change: cardStats.notasVariacao,
      status: cardStats.notasVariacao >= 0 ? 'positive' : 'negative',
      description: `${cardStats.notasAguardando || 0} aguardando aprovação`,
      secondary: `${Math.abs(cardStats.notasVariacao)}% em relação ao mês anterior`
    },
    tempo: {
      id: 'tempo',
      title: 'Tempo Médio de Resposta',
      icon: <Clock className="h-5 w-5" />,
      value: `${cardStats.tempoMedioResposta} dias`,
      change: cardStats.tempoRespostaVariacao,
      status: cardStats.tempoRespostaVariacao <= 0 ? 'positive' : 'negative', // Menor tempo é melhor
      description: 'Comparado ao período anterior',
      secondary: `${Math.abs(cardStats.tempoRespostaVariacao)}% ${cardStats.tempoRespostaVariacao <= 0 ? 'mais rápido' : 'mais lento'}`
    },
    aprovacao: {
      id: 'aprovacao',
      title: 'Taxa de Aprovação',
      icon: <Percent className="h-5 w-5" />,
      value: `${cardStats.taxaAprovacao}%`,
      change: cardStats.aprovacaoVariacao,
      status: cardStats.aprovacaoVariacao >= 0 ? 'positive' : 'negative',
      description: `${cardStats.notasEditadas || 0}% das notas foram editadas`,
      secondary: `Variação: ${cardStats.aprovacaoVariacao >= 0 ? '+' : ''}${cardStats.aprovacaoVariacao}%`
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[]}
    >
      <SortableContext 
        items={cards}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((cardId) => {
            const card = cardData[cardId];
            return (
              <SortableKPICard
                key={card.id}
                id={card.id}
                title={card.title}
                icon={card.icon}
                value={card.value}
                change={card.change}
                status={card.status}
                description={card.description}
                secondary={card.secondary}
                isLoading={isLoadingCards}
                isEditMode={isEditMode}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
