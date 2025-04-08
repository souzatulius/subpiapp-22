
import React, { useState, useEffect } from 'react';
import { useCardStatsData } from './hooks/reports/useCardStatsData';
import { Clock, FileText, MessageSquare, Percent, Globe, TrendingUp, TrendingDown } from 'lucide-react';
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
    'demandas', 'notas', 'tempo', 'aprovacao', 'noticias'
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

  // Get trend icon based on variation
  const getTrendIcon = (variation: number) => {
    if (variation > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (variation < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  // Format cards data
  const getCardData = () => {
    const yesterdayDemandas = Math.round(cardStats.totalDemandas - (cardStats.totalDemandas * cardStats.demandasVariacao / 100));
    
    return {
      demandas: {
        title: 'Demandas',
        value: formatNumber(cardStats.totalDemandas),
        comment: `${cardStats.totalDemandas} hoje (ontem foram ${yesterdayDemandas})`,
        icon: getTrendIcon(cardStats.demandasVariacao)
      },
      notas: {
        title: 'Notas',
        value: formatNumber(cardStats.totalNotas),
        comment: `+ ${Math.abs(cardStats.notasVariacao)}% que ontem`,
        icon: getTrendIcon(cardStats.notasVariacao)
      },
      tempo: {
        title: 'Resposta',
        value: cardStats.tempoMedioResposta < 1 ? 
          `${Math.round(cardStats.tempoMedioResposta * 60)} minutos` : 
          `${formatNumber(cardStats.tempoMedioResposta)} horas`,
        comment: `${Math.abs(cardStats.tempoRespostaVariacao)}% + rápido nesta semana`,
        icon: getTrendIcon(-cardStats.tempoRespostaVariacao)
      },
      aprovacao: {
        title: 'Aprovação',
        value: `${formatNumber(cardStats.taxaAprovacao)}%`,
        comment: `${cardStats.notasEditadas || 0} notas foram editadas`,
        icon: getTrendIcon(cardStats.taxaAprovacao - 80) // Comparing to a baseline of 80%
      },
      noticias: {
        title: 'Notícias no site',
        value: formatNumber(cardStats.noticiasPublicas || 5),
        comment: `Releases cadastrados na semana: ${cardStats.totalReleases || 8}`,
        icon: getTrendIcon(cardStats.noticiasVariacao || 10)
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((cardId) => {
            const card = cardData[cardId as keyof typeof cardData];
            return (
              <div key={cardId} id={cardId} className="transform transition-all duration-300">
                <InsightCard
                  title={card.title}
                  value={card.value}
                  comment={card.comment}
                  isLoading={isLoadingCards}
                  trendIcon={card.icon}
                />
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
