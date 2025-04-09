
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CardGrid from './CardGrid';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (cardId: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: Record<string, any>;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  renderSpecialCardContent,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  showSpecialFeatures
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the end of a drag event - reorder cards
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove(cards, oldIndex, newIndex);
        onCardsChange(newCards);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext
        items={cards.map(card => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <CardGrid 
          cards={cards}
          onEditCard={onEditCard}
          onHideCard={onHideCard}
          isMobileView={isMobileView}
          isEditMode={isEditMode}
          renderSpecialCardContent={renderSpecialCardContent}
          onSearchSubmit={onSearchSubmit}
          specialCardsData={specialCardsData}
          disableWiggleEffect={disableWiggleEffect}
          showSpecialFeatures={showSpecialFeatures}
        />
      </SortableContext>
    </DndContext>
  );
};

export default CardGridContainer;
