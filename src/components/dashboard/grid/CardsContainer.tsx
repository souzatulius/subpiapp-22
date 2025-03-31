
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
  isEditMode?: boolean; // Add isEditMode prop
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
  isMobileView = false,
  isEditMode = false // Set default value
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
            isEditMode={isEditMode} // Pass the isEditMode prop to ActionCardWrapper
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CardsContainer;
