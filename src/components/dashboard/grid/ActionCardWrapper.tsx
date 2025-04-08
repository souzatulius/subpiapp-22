
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
import DynamicDataCard from '../DynamicDataCard';
import DashboardSearchCard from '../DashboardSearchCard';
import * as LucideIcons from 'lucide-react';
import { FileText } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

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
  
  // Get the Lucide icon component
  const getIconComponent = (): LucideIcon => {
    if (!card.iconId) return FileText;
    
    // Try direct match first
    const directMatch = LucideIcons[card.iconId as keyof typeof LucideIcons] as LucideIcon | undefined;
    if (directMatch) {
      return directMatch;
    }
    
    // Try capitalized format
    const formattedIconId = card.iconId.charAt(0).toUpperCase() + card.iconId.slice(1);
    const capitalizedMatch = LucideIcons[formattedIconId as keyof typeof LucideIcons] as LucideIcon | undefined;
    if (capitalizedMatch) {
      return capitalizedMatch;
    }
    
    // Return default icon as fallback
    return FileText;
  };
  
  const IconComponent = getIconComponent();

  // Render the appropriate card content based on the card type
  const renderCardContent = () => {
    // Check if it's a smart search card
    if (card.type === 'smart_search') {
      return <DashboardSearchCard isEditMode={true} />;
    }
    
    // Check if it's a dynamic data card
    if (card.type === 'data_dynamic' && card.dataSourceKey) {
      return (
        <DynamicDataCard 
          title={card.title}
          icon={<IconComponent className="h-8 w-8" />}
          color={card.color}
          dataSourceKey={card.dataSourceKey}
          coordenacaoId={userDepartment || 'default'}
          usuarioId="current"
          highlight={false}
        />
      );
    }
    
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
      card={card.isSearch || card.isStandard || card.type === 'data_dynamic' || card.type === 'smart_search' ? {
        ...card,
        path: '' // Remove path to prevent default click behavior for special cards
      } : card} 
      onEdit={() => onEdit(card)}
      onDelete={onDelete}
      isMobileView={isMobileView}
    >
      {renderCardContent()}
    </SortableActionCard>
  );
};

export default ActionCardWrapper;
