
import React from 'react';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (updatedCards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (id: string) => void;
  isMobileView: boolean;
  isEditMode: boolean;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView,
  isEditMode
}) => {
  return (
    <div>
      <UnifiedCardGrid
        cards={cards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onHideCard={onHideCard}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        specialCardsData={{}}
      />
    </div>
  );
};

export default CardGridContainer;
