
import React from 'react';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ActionCardItem } from '@/types/dashboard';
import { SortableUnifiedActionCard } from './UnifiedActionCard';
import { useNavigate } from 'react-router-dom';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (updatedCards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (cardId: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the indices of the cards being swapped
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Make a copy of the cards
        const updatedCards = [...cards];
        
        // Remove the card from the old index and insert it at the new index
        const [movedCard] = updatedCards.splice(oldIndex, 1);
        updatedCards.splice(newIndex, 0, movedCard);
        
        // Update mobileOrder values based on new positions
        const reorderedCards = updatedCards.map((card, index) => ({
          ...card,
          mobileOrder: index + 1,
        }));
        
        // Call the onCardsChange callback with the updated cards
        onCardsChange(reorderedCards);
      }
    }

    setActiveId(null);
  };

  // Handler for card clicks
  const handleCardClick = (card: ActionCardItem) => {
    if (!isEditMode && card.path) {
      console.log("Navigating to:", card.path);
      navigate(card.path);
    }
  };

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.id} onClick={(e) => {
            // Only navigate if not in edit mode
            if (!isEditMode) {
              e.stopPropagation();
              handleCardClick(card);
            }
          }}>
            <SortableUnifiedActionCard
              {...card}
              isDraggable={isEditMode}
              isEditing={isEditMode}
              onEdit={onEditCard ? () => onEditCard(card) : undefined}
              onHide={onHideCard ? () => onHideCard(card.id) : undefined}
              isMobileView={isMobileView}
              disableWiggleEffect={!isEditMode}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default CardGridContainer;
