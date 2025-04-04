
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
import { ActionCardItem, CardType, CardColor, CardWidth, CardHeight } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';

// Make sure UnifiedCardItem includes all required properties from ActionCardItem
export interface UnifiedCardItem extends ActionCardItem {
  // Any additional props specific to UnifiedCardItem can go here
}

interface UnifiedCardGridProps {
  cards: ActionCardItem[] | UnifiedCardItem[];
  onCardsChange: (cards: ActionCardItem[] | UnifiedCardItem[]) => void;
  onEditCard?: (card: ActionCardItem | UnifiedCardItem) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  // Add properties to support special cards
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
}

const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = false,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData
}) => {
  // Configure sensors for improved drag-and-drop experience
  const sensors = useSensors(
    // Lower the activation constraint distance to make it easier to start dragging
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 5 } // Reduce activation distance for easier dragging
    }),
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

  // Filter cards to show only visible ones (not hidden)
  const visibleCards = cards.filter(card => !card.isHidden);

  // Filter cards for mobile view from visible cards
  const displayedCards = isMobileView
    ? visibleCards.filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : visibleCards;

  // Calculate total columns based on mobile view
  const totalColumns = isMobileView ? 2 : 4;
  
  // Always call useGridOccupancy with displayedCards, even if empty
  // We moved this outside the conditional render to avoid the hooks error
  const { occupiedSlots } = useGridOccupancy(
    displayedCards.map(card => ({ 
      id: card.id,
      width: card.width || '25', 
      height: card.height || '1',
      type: card.type as any
    })), 
    isMobileView
  );

  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

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
                id={card.id}
                title={card.title}
                subtitle={card.subtitle}
                iconId={card.iconId}
                path={card.path}
                color={card.color}
                width={card.width}
                height={card.height}
                isDraggable={true} // Always enable dragging
                isEditing={isEditMode}
                onEdit={onEditCard ? (id) => {
                  const cardToEdit = cards.find(c => c.id === id);
                  if (cardToEdit && onEditCard) onEditCard(cardToEdit);
                } : undefined}
                onDelete={onDeleteCard}
                onHide={onHideCard}
                iconSize={isMobileView ? 'lg' : 'xl'}
                disableWiggleEffect={disableWiggleEffect}
                // Pass through properties for special cards
                type={card.type}
                isQuickDemand={card.isQuickDemand}
                isSearch={card.isSearch}
                showSpecialFeatures={showSpecialFeatures}
                quickDemandTitle={quickDemandTitle}
                onQuickDemandTitleChange={onQuickDemandTitleChange}
                onQuickDemandSubmit={onQuickDemandSubmit}
                onSearchSubmit={onSearchSubmit}
                specialCardsData={specialCardsData}
                isCustom={card.isCustom}
                hasBadge={card.hasBadge}
                badgeValue={card.badgeValue}
                hasSubtitle={!!card.subtitle}
                isMobileView={isMobileView}
              />
            </div>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default UnifiedCardGrid;
