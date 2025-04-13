
import React, { useCallback, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ActionCardItem } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';
import { useCardProcessor } from './grid/unified/CardProcessor';
import { useDndSensors } from './grid/unified/DndSensors';
import UnifiedCardGridContent from './grid/unified/UnifiedCardGridContent';

export interface UnifiedCardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = true,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  renderSpecialCardContent
}) => {
  const sensors = useDndSensors();
  const { processCardDimensions } = useCardProcessor(isMobileView);

  // Handle case when no cards are available - early return outside of hooks
  if (!cards || cards.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove([...cards], oldIndex, newIndex);
        
        if (isMobileView) {
          newCards.forEach((card, index) => {
            card.mobileOrder = index;
          });
        }
        
        onCardsChange(newCards);
      }
    }
  };

  // Filter visible cards
  const visibleCards = useMemo(() => 
    cards.filter(card => !card.isHidden),
  [cards]);

  // Sort and filter cards for display
  const displayedCards = useMemo(() => {
    return isMobileView
      ? visibleCards
          .filter((card) => card.displayMobile !== false)
          .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
      : visibleCards;
  }, [visibleCards, isMobileView]);

  // Process card dimensions
  const processedCards = useMemo(() => {
    return displayedCards.map(card => processCardDimensions(card));
  }, [displayedCards, processCardDimensions]);

  // Use the grid occupancy hook
  const { occupiedSlots } = useGridOccupancy(
    processedCards.map(card => ({
      id: card.id,
      width: card.width || '25',
      height: card.height || '1',
      type: card.type
    })),
    isMobileView
  );

  // When onEditCard is provided, create a handler that finds and passes the card
  // Define this handler outside of any conditions to ensure hook call order is consistent
  const handleEditCard = useCallback((id: string) => {
    if (onEditCard) {
      const cardToEdit = cards.find(c => c.id === id);
      if (cardToEdit) onEditCard(cardToEdit);
    }
  }, [cards, onEditCard]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <UnifiedCardGridContent 
        processedCards={processedCards}
        isEditMode={isEditMode}
        isMobileView={isMobileView}
        disableWiggleEffect={disableWiggleEffect}
        showSpecialFeatures={showSpecialFeatures}
        onEditCard={handleEditCard}
        onDeleteCard={onDeleteCard}
        onHideCard={onHideCard}
        quickDemandTitle={quickDemandTitle}
        onQuickDemandTitleChange={onQuickDemandTitleChange}
        onQuickDemandSubmit={onQuickDemandSubmit}
        onSearchSubmit={onSearchSubmit}
        specialCardsData={specialCardsData}
        renderSpecialCardContent={renderSpecialCardContent}
      />
    </DndContext>
  );
};

export default UnifiedCardGrid;
