
import React from 'react';
import UnifiedCardGrid from './UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  specialCardsData?: any;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  onDeleteCard,
  isMobileView = false,
  isEditMode = false,
  specialCardsData = {}
}) => {
  const handleCardsChange = (updatedCards: ActionCardItem[]) => {
    // Now we properly call the onCardsChange prop to persist the reordering
    onCardsChange(updatedCards);
  };

  return (
    <UnifiedCardGrid
      cards={cards}
      onCardsChange={handleCardsChange}
      onEditCard={onEditCard}
      onHideCard={onHideCard}
      onDeleteCard={onDeleteCard}
      isMobileView={isMobileView}
      isEditMode={isEditMode}
      disableWiggleEffect={true} // Keep this set to true to disable wiggle effect
      specialCardsData={specialCardsData}
      showSpecialFeatures={true}
    />
  );
};

export default CardGridContainer;
