
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
      title: 'Demandas',
      icon: <MessageSquare className="h-5 w-5" />,
      value: cardStats.totalDemandas,
      change: cardStats.demandasVariacao,
      status: cardStats.demandasVariacao >= 0 ? 'positive' : 'negative',
      description: 'Hoje',
      secondary: `Ontem foram ${cardStats.totalDemandas - (cardStats.totalDemandas * cardStats.demandasVariacao / 100)}`
    },
    notas: {
      id: 'notas',
      title: 'Notas',
      icon: <FileText className="h-5 w-5" />,
      value: cardStats.totalNotas,
      change: cardStats.notasVariacao,
      status: cardStats.notasVariacao >= 0 ? 'positive' : 'negative',
      description: `Para a imprensa`,
      secondary: `${Math.abs(cardStats.notasVariacao)}% ${cardStats.notasVariacao >= 0 ? 'maior' : 'menor'} que março`
    },
    tempo: {
      id: 'tempo',
      title: 'Resposta',
      icon: <Clock className="h-5 w-5" />,
      value: `${cardStats.tempoMedioResposta} horas`,
      change: cardStats.tempoRespostaVariacao,
      status: cardStats.tempoRespostaVariacao <= 0 ? 'positive' : 'negative', // Menor tempo é melhor
      description: 'Média de tempo',
      secondary: `${Math.abs(cardStats.tempoRespostaVariacao)}% ${cardStats.tempoRespostaVariacao <= 0 ? 'mais rápido' : 'mais lento'}`
    },
    aprovacao: {
      id: 'aprovacao',
      title: 'Aprovação',
      icon: <Percent className="h-5 w-5" />,
      value: `${cardStats.taxaAprovacao}%`,
      change: cardStats.aprovacaoVariacao,
      status: cardStats.aprovacaoVariacao >= 0 ? 'positive' : 'negative',
      description: `${cardStats.notasAprovadas || 0} Notas aprovadas`,
      secondary: `Editadas: ${cardStats.notasEditadas || 0}%`
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
