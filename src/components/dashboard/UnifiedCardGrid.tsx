
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
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortableUnifiedActionCard, UnifiedActionCardProps } from './UnifiedActionCard';
import { getWidthClass, getHeightClass } from './CardGrid';
import { ActionCardItem, CardType, CardColor } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';

// Make sure UnifiedCardItem includes all required properties from ActionCardItem
export interface UnifiedCardItem extends Omit<UnifiedActionCardProps, 'color'> {
  width?: string;
  height?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  type: CardType;
  path: string; // Make path required to match ActionCardItem
  iconId: string; // Make iconId required
  color: CardColor; // Use CardColor type explicitly
  isCustom?: boolean;
}

interface UnifiedCardGridProps {
  cards: ActionCardItem[] | UnifiedCardItem[];
  onCardsChange: (cards: ActionCardItem[] | UnifiedCardItem[]) => void;
  onEditCard?: (card: ActionCardItem | UnifiedCardItem) => void;
  onDeleteCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
}

const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onDeleteCard,
  isMobileView = false,
  isEditMode = false,
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
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Use type assertion to ensure the array is recognized as the right type
        const newCards = arrayMove([...cards], oldIndex, newIndex);
        onCardsChange(newCards);
      }
    }
  };

  // Filter cards for mobile view
  const displayedCards = isMobileView
    ? cards.filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : cards;

  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }
  
  // Always call the hook, even if there are no cards to display
  const { totalColumns } = useGridOccupancy(
    displayedCards.map(card => ({ 
      id: card.id,
      width: card.width || '25', 
      height: card.height || '1',
      type: card.type
    })), 
    isMobileView
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={`w-full grid gap-4 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <SortableContext items={displayedCards.map(card => card.id)}>
          {displayedCards.map(card => (
            <div 
              key={card.id}
              className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
            >
              <SortableUnifiedActionCard
                {...card}
                isDraggable={isEditMode}
                isEditing={isEditMode}
                onEdit={onEditCard ? (id) => {
                  const cardToEdit = cards.find(c => c.id === id);
                  if (cardToEdit && onEditCard) onEditCard(cardToEdit);
                } : undefined}
                onDelete={onDeleteCard}
                iconSize={isMobileView ? 'lg' : 'xl'}
              />
            </div>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default UnifiedCardGrid;
