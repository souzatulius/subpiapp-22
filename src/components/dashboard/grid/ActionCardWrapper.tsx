
import React from 'react';
import SortableActionCard from '../SortableActionCard';
import QuickDemandCard from '../QuickDemandCard';
import SmartSearchCard from '../SmartSearchCard';
import OverdueDemandsCard from '../cards/OverdueDemandsCard';
import PendingActionsCard from '../cards/PendingActionsCard';
import NewCardButton from '../cards/NewCardButton';
import { ActionCardItem } from '@/hooks/dashboard/types';

// Function to get width classes
export const getWidthClasses = (width: string = '25') => {
  switch (width) {
    case '25':
      return 'col-span-1';
    case '50':
      return 'col-span-2';
    case '75':
      return 'col-span-3';
    case '100':
      return 'col-span-4';
    default:
      return 'col-span-1';
  }
};

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
  if (card.isQuickDemand) {
    return (
      <div className={`${getWidthClasses(card.width)} flex-none`}>
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
      </div>
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
      <div 
        className={`${getWidthClasses(card.width)} ${card.height === '2' ? 'row-span-2' : ''} flex-none`}
      >
        <OverdueDemandsCard
          id={card.id}
          overdueCount={specialCardsData.overdueCount}
          overdueItems={specialCardsData.overdueItems}
        />
      </div>
    );
  }
  
  if (card.isPendingActions) {
    return (
      <div 
        className={`${getWidthClasses(card.width)} ${card.height === '2' ? 'row-span-2' : ''} flex-none`}
      >
        <PendingActionsCard
          id={card.id}
          notesToApprove={specialCardsData.notesToApprove}
          responsesToDo={specialCardsData.responsesToDo}
        />
      </div>
    );
  }
  
  if (card.isNewCardButton) {
    return (
      <div 
        className={`${getWidthClasses(card.width)} flex-none`}
      >
        <NewCardButton onClick={onAddNewCard} />
      </div>
    );
  }
  
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
