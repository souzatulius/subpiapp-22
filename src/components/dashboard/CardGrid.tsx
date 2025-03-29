
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import CardsContainer from './grid/CardsContainer';
import { ActionCardItem } from '@/hooks/dashboard/types';
import DynamicDataCard from './DynamicDataCard';

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard: () => void;
  isMobileView?: boolean;
  specialCardsData?: any;
  usuarioId?: string;
  coordenacaoId?: string;
  modoAdmin?: boolean;
  // Add these props to match usage in Dashboard and Comunicacao components
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards = [], // Add default empty array to prevent undefined errors
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  isMobileView = false,
  specialCardsData,
  usuarioId = '',
  coordenacaoId = '',
  modoAdmin = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);
      const newCards = [...cards];
      const [movedItem] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedItem);
      onCardsChange(newCards);
    }
  };

  // Add safe check before filtering to prevent "map of undefined" errors
  const displayedCards = isMobileView && cards
    ? cards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => ((a.mobileOrder ?? 0) - (b.mobileOrder ?? 0)))
    : cards;

  // If cards is undefined or empty, render nothing or a placeholder
  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No cards available to display.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={modoAdmin ? handleDragEnd : undefined}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-auto">
        {displayedCards.map((card) =>
          card.type === 'data_dynamic' && card.dataSourceKey ? (
            <DynamicDataCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              color={card.color}
              dataSourceKey={card.dataSourceKey}
              coordenacaoId={coordenacaoId}
              usuarioId={usuarioId}
            />
          ) : (
            <CardsContainer
              key={card.id}
              cards={[card]}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onAddNewCard={onAddNewCard}
              specialCardsData={specialCardsData}
              quickDemandTitle={quickDemandTitle}
              onQuickDemandTitleChange={onQuickDemandTitleChange}
              onQuickDemandSubmit={onQuickDemandSubmit}
              onSearchSubmit={onSearchSubmit}
            />
          )
        )}
      </div>
    </DndContext>
  );
};

export default CardGrid;
