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
  specialCardsData
}) => {
  const allCardIds = cards.map(card => card.id);

  return (
    <SortableContext items={allCardIds}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-auto">
        {cards.filter(card => card.isSearch).map((card) => (
          <ActionCardWrapper
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            specialCardsData={specialCardsData}
          />
        ))}

        <NotificationsEnabler />

        {cards.filter(card => !card.isSearch).map((card) => (
          <ActionCardWrapper
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onAddNewCard={onAddNewCard}
            specialCardsData={specialCardsData}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default CardsContainer;
