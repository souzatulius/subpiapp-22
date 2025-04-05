
import React, { useState, useEffect } from 'react';
import { useCardStatsData } from './hooks/reports/useCardStatsData';
import { Clock, FileText, MessageSquare, Percent } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import InsightCard from '../ranking/insights/InsightCard';

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

  // Format number with comma as decimal separator
  const formatNumber = (value: number): string => {
    return value.toString().replace('.', ',');
  };

  // Format cards data
  const getCardData = () => {
    return {
      demandas: {
        title: 'Demandas',
        value: formatNumber(cardStats.totalDemandas),
        comment: `Hoje foram ${cardStats.totalDemandas} demandas. Ontem foram ${cardStats.totalDemandas - (cardStats.totalDemandas * cardStats.demandasVariacao / 100)}.`
      },
      notas: {
        title: 'Notas',
        value: formatNumber(cardStats.totalNotas),
        comment: `Para a imprensa. ${Math.abs(cardStats.notasVariacao)}% ${cardStats.notasVariacao >= 0 ? 'maior' : 'menor'} que março.`
      },
      tempo: {
        title: 'Resposta',
        value: `${formatNumber(cardStats.tempoMedioResposta)} horas`,
        comment: `Média de tempo. ${Math.abs(cardStats.tempoRespostaVariacao)}% ${cardStats.tempoRespostaVariacao <= 0 ? 'mais rápido' : 'mais lento'} que o período anterior.`
      },
      aprovacao: {
        title: 'Aprovação',
        value: `${formatNumber(cardStats.taxaAprovacao)}%`,
        comment: `${cardStats.notasAprovadas || 0} Notas aprovadas. Editadas: ${cardStats.notasEditadas || 0}%.`
      }
    };
  };

  const cardData = getCardData();

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={cards}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((cardId) => {
            const card = cardData[cardId as keyof typeof cardData];
            return (
              <div key={cardId} id={cardId} className="transform transition-all duration-300">
                <InsightCard
                  title={card.title}
                  value={card.value}
                  comment={card.comment}
                  isLoading={isLoadingCards}
                />
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
