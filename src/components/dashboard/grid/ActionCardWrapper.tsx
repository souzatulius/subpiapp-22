
import React from 'react';
import SortableActionCard from '../SortableActionCard';
import QuickDemandCard from '../QuickDemandCard';
import SmartSearchCard from '../SmartSearchCard';
import OverdueDemandsCard from '../cards/OverdueDemandsCard';
import PendingActionsCard from '../cards/PendingActionsCard';
import NewCardButton from '../cards/NewCardButton';
import { ActionCardItem } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

interface ActionCardWrapperProps {
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onDelete: (id: string) => void;
  onAddNewCard: () => void;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  isMobileView?: boolean;
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
  isMobileView = false,
  specialCardsData
}) => {
  const navigate = useNavigate();

  // Function to handle origin selection and navigate to form
  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
  };

  // Map specific card types to their respective components
  if (card.isQuickDemand) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
        isMobileView={isMobileView}
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
        isMobileView={isMobileView}
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
        isMobileView={isMobileView}
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
        isMobileView={isMobileView}
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
        isMobileView={isMobileView}
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
      isMobileView={isMobileView}
    />
  );
};

export default ActionCardWrapper;
