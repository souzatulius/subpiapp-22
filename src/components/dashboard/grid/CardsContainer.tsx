
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import ActionCardWrapper from './ActionCardWrapper';
import { ActionCardItem } from '@/hooks/dashboard/types';

interface CardsContainerProps {
  cards: ActionCardItem[];
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard: () => void;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
}

const CardsContainer: React.FC<CardsContainerProps> = ({
  cards,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData
}) => {
  return (
    <SortableContext items={cards.map(card => card.id)}>
      <div className="grid grid-cols-4 gap-6 auto-rows-auto">
        {/* First show the search card */}
        {cards.filter(card => card.isSearch).map((card) => (
          <ActionCardWrapper 
            key={card.id}
            card={card} 
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
          />
        ))}
        
        {/* Add NotificationsEnabler after the search card */}
        <NotificationsEnabler />
        
        {/* Show pending actions card */}
        {cards.filter(card => card.isPendingActions).map((card) => (
          <ActionCardWrapper 
            key={card.id}
            card={card} 
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
          />
        ))}
        
        {/* Show overdue demands card */}
        {cards.filter(card => card.isOverdueDemands).map((card) => (
          <ActionCardWrapper 
            key={card.id}
            card={card} 
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
          />
        ))}
        
        {/* Show standard cards */}
        {cards.filter(card => !card.isSearch && !card.isPendingActions && !card.isOverdueDemands && 
                            !card.isQuickDemand && !card.isNewCardButton).map((card) => (
          <ActionCardWrapper 
            key={card.id}
            card={card} 
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
          />
        ))}
        
        {/* Show quick demand and new card button at the end */}
        {cards.filter(card => card.isQuickDemand || card.isNewCardButton).map((card) => (
          <ActionCardWrapper 
            key={card.id}
            card={card} 
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            quickDemandTitle={quickDemandTitle}
            onQuickDemandTitleChange={onQuickDemandTitleChange}
            onQuickDemandSubmit={onQuickDemandSubmit}
            onSearchSubmit={onSearchSubmit}
            specialCardsData={specialCardsData}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CardsContainer;
