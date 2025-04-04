
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
  const IconComponent = card.iconId ? getIconComponentFromId(card.iconId) : null;

  // Get icon component from ID
  function getIconComponentFromId(iconId: string) {
    const IconMap = {
      'clipboard-list': () => import('lucide-react').then(mod => mod.ClipboardList),
      'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
      'file-check': () => import('lucide-react').then(mod => mod.FileCheck),
      'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
      'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
      'search': () => import('lucide-react').then(mod => mod.Search),
      'clock': () => import('lucide-react').then(mod => mod.Clock),
      'alert-triangle': () => import('lucide-react').then(mod => mod.AlertTriangle),
      'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
      'file-text': () => import('lucide-react').then(mod => mod.FileText),
      'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
      // Add more icons as needed
    };
    
    const LoadedIcon = React.lazy(() => 
      IconMap[iconId]?.() || import('lucide-react').then(mod => ({ default: mod.ClipboardList }))
    );
    
    return (props: any) => (
      <React.Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
        <LoadedIcon {...props} />
      </React.Suspense>
    );
  }

  // Render the appropriate card content based on the card type
  const renderCardContent = () => {
    // Check if it's a dynamic data card
    if (card.type === 'data_dynamic' && card.dataSourceKey) {
      return (
        <DynamicDataCard 
          title={card.title}
          icon={IconComponent && <IconComponent className="h-8 w-8" />}
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
      card={card} 
      onEdit={onEdit}
      onDelete={onDelete}
      isMobileView={isMobileView}
    >
      {renderCardContent()}
    </SortableActionCard>
  );
};

export default ActionCardWrapper;
