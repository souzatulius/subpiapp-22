
import React from 'react';
import CardGrid from './CardGrid';
import { ActionCardItem } from '@/types/dashboard';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  verticalSpacing?: string;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  verticalSpacing = "y-4"
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-${verticalSpacing}`}>
      <CardGrid
        cards={cards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onDeleteCard={onHideCard}
        isMobileView={isMobileView}
        specialCardsData={{
          overdueCount: 0,
          overdueItems: [],
          notesToApprove: 0,
          responsesToDo: 0,
          isLoading: false
        }}
      />
    </div>
  );
};

export default CardGridContainer;
