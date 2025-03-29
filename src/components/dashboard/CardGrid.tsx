import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import CardsContainer from './grid/CardsContainer';
import { ActionCardItem } from '@/hooks/dashboard/types';

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard: () => void;
  isMobileView?: boolean;
  specialCardsData?: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  isMobileView = false,
  specialCardsData = {
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  }
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

  // Filtro e ordenação para mobile
  const displayedCards = isMobileView
    ? cards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder || 0) - (b.mobileOrder || 0))
    : cards;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <CardsContainer
        cards={displayedCards}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        onAddNewCard={onAddNewCard}
        specialCardsData={specialCardsData}
      />
    </DndContext>
  );
};

export default CardGrid;
