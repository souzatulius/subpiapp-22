
// src/components/dashboard/CardGrid.tsx
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
import { SortableContext } from '@dnd-kit/sortable';
import { ActionCardItem } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';
import CardGroup from './grid/CardGroup';

export interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard?: () => void;
  isMobileView?: boolean;
  specialCardsData?: any;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards = [],
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
  },
  quickDemandTitle = '',
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {}
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const { totalColumns } = useGridOccupancy(
    cards.map(card => ({ 
      id: card.id,
      width: card.width || '25', 
      height: card.height || '1',
      type: card.type
    })), 
    isMobileView
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

  if (!cards || cards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

  const displayedCards = isMobileView
    ? cards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : cards;

  const searchCards = displayedCards.filter(card => card.isSearch);
  const dynamicDataCards = displayedCards.filter(
    card => card.type === 'data_dynamic' && card.dataSourceKey
  );
  const regularCards = displayedCards.filter(
    card => !card.isSearch && (card.type !== 'data_dynamic' || !card.dataSourceKey)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={`w-full grid gap-y-2 gap-x-4 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <SortableContext items={displayedCards.map(card => card.id)}>
          {[...searchCards, ...dynamicDataCards, ...regularCards].map(card => (
            <CardGroup
              key={card.id}
              card={card}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onAddNewCard={onAddNewCard}
              specialCardsData={specialCardsData}
              quickDemandTitle={quickDemandTitle}
              onQuickDemandTitleChange={onQuickDemandTitleChange}
              onQuickDemandSubmit={onQuickDemandSubmit}
              onSearchSubmit={onSearchSubmit}
              isMobileView={isMobileView}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export { getWidthClass, getHeightClass } from './grid/GridUtilities';
export default CardGrid;
