
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
import { SortableUnifiedActionCard } from './UnifiedActionCard';
import { getWidthClass, getHeightClass, getMobileSpecificDimensions } from './grid/GridUtilities';
import { ActionCardItem, CardWidth, CardHeight } from '@/types/dashboard';
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);

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
  const displayedCards = isMobileView
    ? visibleCards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : visibleCards;

  // Apply specific dimensions for certain cards
  const processedCards = displayedCards.map(card => {
    if (isMobileView) {
      // Apply special dimensions for specific cards on mobile
      if (card.title === "Relatórios da Comunicação" || card.title === "Ações Pendentes") {
        const mobileSpecific = getMobileSpecificDimensions(card.title);
        return {
          ...card,
          width: mobileSpecific.width,
          height: mobileSpecific.height
        };
      }
    } else {
      // Desktop-specific adjustments
      if (card.title === "Relatórios da Comunicação") {
        return {
          ...card,
          width: '50' as CardWidth, // 2 columns - explicit type cast to CardWidth
          height: '1' as CardHeight  // 1 row - explicit type cast to CardHeight
        };
      } else if (card.title === "Ações Pendentes") {
        return {
          ...card,
          width: '25' as CardWidth, // 1 column - explicit type cast to CardWidth
          height: '2' as CardHeight  // 2 rows - explicit type cast to CardHeight
        };
      }
    }
    return card;
  });

  const { occupiedSlots } = useGridOccupancy(
    processedCards.map(card => ({
      id: card.id,
      width: card.width || '25',
      height: card.height || '1',
      type: card.type
    })),
    isMobileView
  );

  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
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
      <div className={`w-full grid gap-y-3 gap-x-3 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <SortableContext items={processedCards.map(card => card.id)}>
          {processedCards.map(card => (
            <div
              key={card.id}
              className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height, isMobileView)}`}
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
                isDraggable={true}
                isEditing={isEditMode}
                onEdit={onEditCard ? (id) => {
                  const cardToEdit = cards.find(c => c.id === id);
                  if (cardToEdit) onEditCard(cardToEdit);
                } : undefined}
                onDelete={onDeleteCard}
                onHide={onHideCard}
                iconSize={isMobileView ? 'lg' : 'xl'}
                disableWiggleEffect={disableWiggleEffect}
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
                isPendingActions={card.isPendingActions}
              />
            </div>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default UnifiedCardGrid;
