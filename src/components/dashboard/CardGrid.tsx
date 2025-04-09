
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getWidthClass, getHeightClass } from './grid/GridUtilities';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import OriginSelectionCard from './cards/OriginSelectionCard';

interface CardGridProps {
  cards: ActionCardItem[];
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (cardId: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  renderSpecialCardContent,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  showSpecialFeatures
}) => {
  // Filter out hidden cards
  const visibleCards = cards.filter(card => !card.isHidden);

  const getCardContent = (card: ActionCardItem) => {
    // Check if this is a special card that needs custom rendering
    if (renderSpecialCardContent) {
      const specialContent = renderSpecialCardContent(card.id);
      if (specialContent) return specialContent;
    }

    // Handle origin selection card type
    if (card.type === 'origin_selection' && specialCardsData?.originOptions) {
      return (
        <OriginSelectionCard 
          title={card.title}
          options={specialCardsData.originOptions}
        />
      );
    }

    // Return null for other card types, they'll be handled by SortableActionCard
    return null;
  };

  return (
    <div className={`w-full grid gap-4 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
      {visibleCards.map((card) => (
        <div
          key={card.id}
          className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height, isMobileView)}`}
        >
          <SortableCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onHide={onHideCard}
            isEditing={isEditMode}
            isMobileView={isMobileView}
            disableWiggleEffect={disableWiggleEffect}
            showSpecialFeatures={showSpecialFeatures}
          >
            {getCardContent(card)}
          </SortableCard>
        </div>
      ))}
    </div>
  );
};

// SortableCard component for drag-and-drop functionality
const SortableCard = ({ card, onEdit, onHide, children, isEditing, isMobileView, disableWiggleEffect, showSpecialFeatures }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  // Render the card content
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-full"
    >
      {children ? (
        <div className="h-full">{children}</div>
      ) : (
        <div className="h-full bg-gray-100 rounded-lg p-4">
          <h3>{card.title}</h3>
          {isEditing && (
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onHide(card.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Hide
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardGrid;
