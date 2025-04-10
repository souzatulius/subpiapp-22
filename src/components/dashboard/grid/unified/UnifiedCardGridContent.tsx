
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { ActionCardItem } from '@/types/dashboard';
import CardRenderer from './CardRenderer';

interface UnifiedCardGridContentProps {
  processedCards: ActionCardItem[];
  isEditMode: boolean;
  isMobileView: boolean;
  disableWiggleEffect: boolean;
  showSpecialFeatures: boolean;
  onEditCard?: (id: string) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
}

export const UnifiedCardGridContent: React.FC<UnifiedCardGridContentProps> = ({
  processedCards,
  isEditMode,
  isMobileView,
  disableWiggleEffect,
  showSpecialFeatures,
  onEditCard,
  onDeleteCard,
  onHideCard,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  renderSpecialCardContent
}) => {
  return (
    <SortableContext items={processedCards.map(card => card.id)}>
      <div className={`w-full grid gap-3 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4 grid-flow-dense'}`}>
        {processedCards.map(card => (
          <CardRenderer
            key={card.id}
            card={card}
            isEditMode={isEditMode}
            isMobileView={isMobileView}
            disableWiggleEffect={disableWiggleEffect}
            showSpecialFeatures={showSpecialFeatures}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
            onHideCard={onHideCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
            renderSpecialCardContent={renderSpecialCardContent}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default UnifiedCardGridContent;
