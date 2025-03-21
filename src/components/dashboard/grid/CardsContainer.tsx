
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        {cards.map((card) => (
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
        
        {/* Add NotificationsEnabler after the cards */}
        <NotificationsEnabler />
      </div>
    </SortableContext>
  );
};

export default CardsContainer;
