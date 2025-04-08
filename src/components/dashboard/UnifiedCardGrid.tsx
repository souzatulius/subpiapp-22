import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortableUnifiedActionCard } from './UnifiedActionCard';
import { getWidthClass, getHeightClass } from './CardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';
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
  specialCardsData
}) => {
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }), useSensor(KeyboardSensor));
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex(item => item.id === active.id);
      const newIndex = cards.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newCards = arrayMove([...cards], oldIndex, newIndex);

        // If in mobile view, update mobileOrder for all cards
        if (isMobileView) {
          newCards.forEach((card, index) => {
            card.mobileOrder = index;
          });
        }

        // Call onCardsChange with updated cards to persist changes
        onCardsChange(newCards);
      }
    }
  };
  const visibleCards = cards.filter(card => !card.isHidden);

  // Sort cards by mobileOrder when in mobile view
  const displayedCards = isMobileView ? visibleCards.filter(card => card.displayMobile !== false).sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999)) : visibleCards;
  const {
    occupiedSlots
  } = useGridOccupancy(displayedCards.map(card => ({
    id: card.id,
    width: card.width || '25',
    height: card.height || '1',
    type: card.type
  })), isMobileView);
  if (!displayedCards || displayedCards.length === 0) {
    return <div className="p-4 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>;
  }
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className={`w-full grid gap-y-3 gap-x-3 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        
      </div>
    </DndContext>;
};
export default UnifiedCardGrid;