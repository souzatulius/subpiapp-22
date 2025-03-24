
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import ActionCardWrapper from './ActionCardWrapper';
import { ActionCardItem } from '@/hooks/dashboard/types';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

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
  // Include all cards in the sortable context, not just the regular ones
  const allCardIds = cards.map(card => card.id);
  
  return (
    <SortableContext items={allCardIds}>
      <div className="grid grid-cols-4 gap-6 auto-rows-auto">
        {/* Mensagem de boas-vindas no primeiro acesso */}
        <WelcomeMessage />
        
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
        
        {/* Show all other cards */}
        {cards.filter(card => !card.isSearch).map((card) => (
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
