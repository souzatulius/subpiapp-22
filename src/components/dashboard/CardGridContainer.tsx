// src/components/dashboard/CardGridContainer.tsx
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
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedCards = [...cards];
        const [movedCard] = updatedCards.splice(oldIndex, 1);
        updatedCards.splice(newIndex, 0, movedCard);
        // Atualiza ordem para visualizações mobile
        const reorderedCards = updatedCards.map((card, index) => ({
          ...card,
          mobileOrder: index + 1,
        }));
        onCardsChange(reorderedCards);
      }
    }
    setActiveId(null);
  };

  const handleCardClick = (card: ActionCardItem) => {
    if (!isEditMode && card.path) {
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
          <div 
            key={card.id} 
            className="h-full"
            onClick={() => !isEditMode && handleCardClick(card)}
          >
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
