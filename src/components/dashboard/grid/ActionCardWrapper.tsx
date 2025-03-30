
import React from 'react';
import SortableActionCard from '../SortableActionCard';
import QuickDemandCard from '../QuickDemandCard';
import SmartSearchCard from '../SmartSearchCard';
import OverdueDemandsCard from '../cards/OverdueDemandsCard';
import PendingActionsCard from '../cards/PendingActionsCard';
import NewCardButton from '../cards/NewCardButton';
import { ActionCardItem } from '@/types/dashboard';

interface ActionCardWrapperProps {
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onDelete: (id: string) => void;
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

const ActionCardWrapper: React.FC<ActionCardWrapperProps> = ({
  card,
  onEdit,
  onDelete,
  onAddNewCard,
  quickDemandTitle = "",
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {},
  specialCardsData
}) => {
  // Map specific card types to their respective components
  if (card.isQuickDemand) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <QuickDemandCard 
          value={quickDemandTitle}
          onChange={onQuickDemandTitleChange}
          onSubmit={onQuickDemandSubmit}
        />
      </SortableActionCard>
    );
  }
  
  if (card.isSearch) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <SmartSearchCard
          placeholder={card.title}
          onSearch={onSearchSubmit}
        />
      </SortableActionCard>
    );
  }
  
  if (card.isOverdueDemands) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <OverdueDemandsCard
          id={card.id}
          overdueCount={specialCardsData.overdueCount}
          overdueItems={specialCardsData.overdueItems}
        />
      </SortableActionCard>
    );
  }
  
  if (card.isPendingActions) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <PendingActionsCard
          id={card.id}
          notesToApprove={specialCardsData.notesToApprove}
          responsesToDo={specialCardsData.responsesToDo}
        />
      </SortableActionCard>
    );
  }
  
  if (card.isNewCardButton) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <NewCardButton onClick={onAddNewCard} />
      </SortableActionCard>
    );
  }
  
  // Default case - standard card
  return (
    <SortableActionCard 
      key={card.id} 
      card={card} 
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ActionCardWrapper;
