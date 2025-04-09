
import React from 'react';
import { DndContext, PointerSensor, closestCenter, KeyboardSensor, DragEndEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { useSensor, useSensors } from '@dnd-kit/core';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  specialCardsData?: any;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({ 
  cards, 
  onCardsChange,
  onEditCard,
  onHideCard,
  onDeleteCard,
  isMobileView = false,
  isEditMode = false,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  disableWiggleEffect = false,
  showSpecialFeatures = true,
  specialCardsData = {
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false,
  },
  renderSpecialCardContent
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  // Function to handle drag end (handled by UnifiedCardGrid now)
  const handleDragEnd = (event: DragEndEvent) => {
    // This is now handled by UnifiedCardGrid
  };

  return (
    <DndContext 
      sensors={sensors} 
      modifiers={[restrictToParentElement]} 
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <UnifiedCardGrid
        cards={cards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        onHideCard={onHideCard}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        quickDemandTitle={quickDemandTitle}
        onQuickDemandTitleChange={onQuickDemandTitleChange}
        onQuickDemandSubmit={onQuickDemandSubmit}
        onSearchSubmit={onSearchSubmit}
        disableWiggleEffect={disableWiggleEffect}
        showSpecialFeatures={showSpecialFeatures}
        specialCardsData={specialCardsData}
        renderSpecialCardContent={renderSpecialCardContent}
      />
    </DndContext>
  );
};

export default CardGridContainer;
