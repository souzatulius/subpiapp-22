
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import SortableActionCard from './SortableActionCard';
import { getWidthClass, getHeightClass } from './grid/GridUtilities';

interface CardGridProps {
  cards: ActionCardItem[];
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (cardId: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  renderSpecialCardContent
}) => {
  // Filter cards to only display visible ones
  const visibleCards = cards.filter(card => !card.isHidden);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
      {visibleCards.map((card) => (
        <div 
          key={card.id}
          className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
        >
          <SortableActionCard
            card={card}
            onEdit={() => onEditCard(card)}
            onDelete={onHideCard}
            isDraggable={isEditMode}
            isMobileView={isMobileView}
            specialContent={renderSpecialCardContent && renderSpecialCardContent(card.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
