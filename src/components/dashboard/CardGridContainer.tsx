
import React from 'react';
import CardGrid from './CardGrid';
import UnifiedCardGrid from './UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';

interface CardGridContainerProps {
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
  className?: string;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
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
  specialCardsData,
  className = ''
}) => {
  const hasDynamicCards = cards.some(card => card.type === 'data_dynamic');
  
  // Use CardGrid for complex cards with dynamic data
  if (hasDynamicCards) {
    return (
      <div className={`w-full ${className}`}>
        <CardGrid
          cards={cards}
          onCardsChange={onCardsChange}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard || (() => {})}
          onHideCard={onHideCard}
          isMobileView={isMobileView}
          specialCardsData={specialCardsData}
          quickDemandTitle={quickDemandTitle}
          onQuickDemandTitleChange={onQuickDemandTitleChange}
          onQuickDemandSubmit={onQuickDemandSubmit}
          onSearchSubmit={onSearchSubmit}
        />
      </div>
    );
  }
  
  // Use UnifiedCardGrid for standard cards
  return (
    <div className={`w-full ${className}`}>
      <UnifiedCardGrid
        cards={cards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onHideCard={onHideCard}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        disableWiggleEffect={disableWiggleEffect}
        showSpecialFeatures={showSpecialFeatures}
        quickDemandTitle={quickDemandTitle}
        onQuickDemandTitleChange={onQuickDemandTitleChange}
        onQuickDemandSubmit={onQuickDemandSubmit}
        onSearchSubmit={onSearchSubmit}
        specialCardsData={specialCardsData}
      />
    </div>
  );
};

export default CardGridContainer;
