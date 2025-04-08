
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
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
  // Custom hook to fetch data for special cards like overdue demands, etc.
  const specialCardsData = useSpecialCardsData();
  
  // Unified approach: don't separate special cards, let the grid system handle positioning
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={isMobileView ? 'col-span-2' : 'col-span-4'}>
        <UnifiedCardGrid
          cards={cards}
          onCardsChange={onCardsChange}
          onEditCard={onEditCard}
          onHideCard={onHideCard}
          isMobileView={isMobileView}
          isEditMode={isEditMode}
          specialCardsData={specialCardsData}
        />
      </div>
    </div>
  );
};

export default CardGridContainer;
