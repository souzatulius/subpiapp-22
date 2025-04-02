
import React from 'react';
import SortableActionCard from '../SortableActionCard';
import { ActionCardItem } from '@/types/dashboard';
import { useDepartmentData } from './hooks/useDepartmentData';
import StandardCard from './card-types/StandardCard';
import OverdueDemandsCardWrapper from './card-types/OverdueDemandsCardWrapper';
import PendingActionsCardWrapper from './card-types/PendingActionsCardWrapper';
import SearchCard from './card-types/SearchCard';
import QuickDemandCardWrapper from './card-types/QuickDemandCardWrapper';
import NewCardButtonWrapper from './card-types/NewCardButtonWrapper';

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
  const { userDepartment, isComunicacao } = useDepartmentData();

  // Render the appropriate card content based on the card type
  const renderCardContent = () => {
    if (card.isQuickDemand) {
      return (
        <QuickDemandCardWrapper 
          card={card}
          value={quickDemandTitle}
          onChange={onQuickDemandTitleChange}
          onSubmit={onQuickDemandSubmit}
        />
      );
    }
    
    if (card.isSearch) {
      return (
        <SearchCard
          card={card}
          onSearchSubmit={onSearchSubmit}
        />
      );
    }
    
    if (card.isOverdueDemands) {
      return (
        <OverdueDemandsCardWrapper
          card={card}
          overdueCount={specialCardsData.overdueCount}
          overdueItems={specialCardsData.overdueItems}
          isComunicacao={isComunicacao}
          userDepartmentId={userDepartment || ''}
        />
      );
    }
    
    if (card.isPendingActions) {
      return (
        <PendingActionsCardWrapper
          card={card}
          notesToApprove={specialCardsData.notesToApprove}
          responsesToDo={specialCardsData.responsesToDo}
          isComunicacao={isComunicacao}
          userDepartmentId={userDepartment || ''}
        />
      );
    }
    
    if (card.isNewCardButton) {
      return (
        <NewCardButtonWrapper
          card={card}
          onAddNewCard={onAddNewCard}
        />
      );
    }
    
    // Default to standard card
    return (
      <StandardCard 
        card={card}
        isMobileView={isMobileView}
      />
    );
  };
  
  return (
    <SortableActionCard 
      key={card.id} 
      card={card.isSearch || card.isStandard ? {
        ...card,
        path: '' // Remove path to prevent default click behavior
      } : card} 
      onEdit={onEdit}
      onDelete={onDelete}
      isMobileView={isMobileView}
    >
      {renderCardContent()}
    </SortableActionCard>
  );
};

export default ActionCardWrapper;
