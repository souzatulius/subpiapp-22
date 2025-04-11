
import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';
import { useDndSensors } from './grid/unified/DndSensors';

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
  disableWiggleEffect = true, // Default is true to prevent flickering
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
  // Use our shared sensors hook
  const sensors = useDndSensors();

  return (
    <DndContext 
      sensors={sensors} 
      modifiers={[restrictToParentElement]} 
      collisionDetection={closestCenter}
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
