
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import ActionCardWrapper from './ActionCardWrapper';
import { ActionCardItem } from '@/types/dashboard';

interface CardsContainerProps {
  cards: ActionCardItem[];
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard: () => void;
  specialCardsData: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean; // Added isEditMode property
}

const CardsContainer: React.FC<CardsContainerProps> = ({
  cards,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  specialCardsData,
  quickDemandTitle = "",
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {},
  isMobileView = false
}) => {
  const allCardIds = cards.map(card => card.id);

  return (
    <SortableContext items={allCardIds}>
      <div className="w-full h-full">
        {cards.map((card) => (
          <ActionCardWrapper
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            specialCardsData={specialCardsData}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            isMobileView={isMobileView}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CardsContainer;
