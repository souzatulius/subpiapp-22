
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import CardGrid from './CardGrid';
import WelcomeMessage from './WelcomeMessage';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false
}) => {
  return (
    <div className="space-y-4">
      {!isEditMode && <WelcomeMessage />}
      
      <CardGrid
        cards={cards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onDeleteCard={() => {}}
        isMobileView={isMobileView}
        onAddNewCard={() => {}}
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
