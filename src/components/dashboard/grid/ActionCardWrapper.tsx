import React from 'react';
import SortableActionCard from '../SortableActionCard';
import QuickDemandCard from '../QuickDemandCard';
import SmartSearchCard from '../SmartSearchCard';
import OverdueDemandsCard from '../cards/OverdueDemandsCard';
import PendingActionsCard from '../cards/PendingActionsCard';
import NewCardButton from '../cards/NewCardButton';
import { ActionCardItem } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

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
  isEditMode?: boolean;
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
  isEditMode = false,
  specialCardsData
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = React.useState<string | null>(null);
  const [isComunicacao, setIsComunicacao] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const fetchUserDepartment = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user department:', error);
          return;
        }
        
        if (data) {
          setUserDepartment(data.coordenacao_id);
          setIsComunicacao(data.coordenacao_id === 'comunicacao');
        }
      } catch (error) {
        console.error('Failed to fetch user department:', error);
      }
    };
    
    fetchUserDepartment();
  }, [user]);

  const handleCardClick = () => {
    if (card.path) {
      navigate(card.path);
    }
  };
  
  const handleOriginSelect = (originId: string) => {
    navigate(`/dashboard/comunicacao/cadastrar?origem_id=${originId}`);
  };

  if (card.isQuickDemand) {
    return (
      <SortableActionCard 
        key={card.id} 
        card={card} 
        onEdit={onEdit}
        onDelete={onDelete}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
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
        isEditMode={isEditMode}
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
        isEditMode={isEditMode}
      >
        <OverdueDemandsCard
          id={card.id}
          overdueCount={specialCardsData.overdueCount}
          overdueItems={specialCardsData.overdueItems}
          isComunicacao={isComunicacao}
          userDepartmentId={userDepartment || ''}
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
        isEditMode={isEditMode}
      >
        <PendingActionsCard
          id={card.id}
          notesToApprove={specialCardsData.notesToApprove}
          responsesToDo={specialCardsData.responsesToDo}
          isComunicacao={isComunicacao}
          userDepartmentId={userDepartment || ''}
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
        isEditMode={isEditMode}
      >
        <NewCardButton onClick={onAddNewCard} />
      </SortableActionCard>
    );
  }
  
  return (
    <SortableActionCard 
      key={card.id} 
      card={{
        ...card,
        path: ''
      }} 
      onEdit={onEdit}
      onDelete={onDelete}
      isMobileView={isMobileView}
      isEditMode={isEditMode}
    >
      <div 
        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {React.createElement(
            card.iconId ? card.iconId : 'div',
            { 
              className: isMobileView ? 'h-12 w-12 mb-4 text-white' : 'h-16 w-16 mb-4 text-white' 
            }
          )}
          <h3 className="text-lg font-semibold text-white text-center">{card.title}</h3>
        </div>
      </div>
    </SortableActionCard>
  );
};

export default ActionCardWrapper;
