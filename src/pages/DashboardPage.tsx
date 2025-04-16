import React, { useState, useEffect, useCallback } from 'react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardState } from '@/hooks/useDashboardState';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EditCardModal from '@/components/dashboard/EditCardModal';
import PendingActionsCard from '@/components/dashboard/cards/PendingActionsCard';
import OriginDemandStatistics from '@/components/dashboard/cards/OriginDemandStatistics';
import SmartSearchCard from '@/components/dashboard/SmartSearchCard';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserData } from '@/hooks/dashboard/useUserData';

const DashboardPage: React.FC = () => {
  const {
    viewType,
    actionCards,
    setActionCards,
    toggleView
  } = useDashboardState();
  
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCardEditModalOpen, setIsCardEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isMobileView = useIsMobile();
  const specialCardsData = useSpecialCardsData();

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsCardEditModalOpen(true);
  };

  const handleCardHide = (cardId: string) => {
    const updatedCards = actionCards.map(card => card.id === cardId ? {
      ...card,
      isHidden: true
    } : card);
    setActionCards(updatedCards);
    saveCardsToSupabase(updatedCards);
  };

  const handleCardsReorder = (reorderedCards: ActionCardItem[]) => {
    setActionCards(reorderedCards);
    saveCardsToSupabase(reorderedCards);
  };

  const handleSaveCardEdit = (editedCard: ActionCardItem) => {
    const updatedCards = actionCards.map(card => card.id === editedCard.id ? editedCard : card);
    setActionCards(updatedCards);
    setIsCardEditModalOpen(false);
    setSelectedCard(null);
    saveCardsToSupabase(updatedCards);
  };

  const saveCardsToSupabase = async (cards: ActionCardItem[]) => {
    if (!user || !user.id) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('user_dashboard').upsert({
        user_id: user.id,
        cards_config: JSON.stringify(cards),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      if (error) throw error;
      setLastSaved(new Date());
      toast.success("Dashboard salvo com sucesso");
    } catch (error) {
      console.error('Error saving dashboard configuration:', error);
      toast.error('Erro ao salvar as configurações do dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const resetDashboard = async () => {
    if (!user || !user.id) return;
    try {
      // Fetch the default department dashboard config
      const { data, error } = await supabase.from('department_dashboard').select('cards_config').eq('department', 'main').single();
      if (error) throw error;
      if (data && data.cards_config) {
        const defaultCards = JSON.parse(data.cards_config);
        setActionCards(defaultCards);
        saveCardsToSupabase(defaultCards);
        toast.success("Dashboard resetado com sucesso");
      }
    } catch (error) {
      console.error('Error resetting dashboard:', error);
      toast.error('Erro ao resetar o dashboard');
      window.location.reload();
    }
  };

  const renderSpecialCardContent = useCallback((cardId: string) => {
    if (cardId === 'origem-demandas') {
      return <OriginDemandStatistics showComparison={true} />;
    }
    if (cardId === 'acoes-pendentes') {
      return <PendingActionsCard 
        id={cardId}
        showDetailedList={true} 
        notesToApprove={specialCardsData.notesToApprove}
        responsesToDo={specialCardsData.responsesToDo}
        isComunicacao={specialCardsData.isComunicacao}
        userDepartmentId={specialCardsData.userCoordenaticaoId || ''}
      />;
    }
    if (cardId === 'busca-rapida') {
      return <div className="p-4 flex items-center justify-center w-full h-full">
          <SmartSearchCard disableNavigation={true} placeholder="Pesquisar..." />
        </div>;
    }
    return null;
  }, [specialCardsData]);

  return (
    <div className="space-y-6">
      <WelcomeCard 
        title="Dashboard" 
        description="Acompanhe indicadores e acesse as principais funcionalidades do sistema" 
        greeting={true} 
        userName={firstName} 
        userNameClassName="text-white" 
        showResetButton={isEditMode} 
        onResetClick={resetDashboard}
        resetButtonIcon={<RotateCcw className="h-4 w-4" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
        showButton={false} 
      />

      {isSaving && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded-lg mb-4 flex items-center">
          <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full mr-2"></div>
          Salvando alterações...
        </div>
      )}

      <CardGridContainer 
        cards={actionCards} 
        onCardsChange={handleCardsReorder} 
        onEditCard={handleCardEdit} 
        onHideCard={handleCardHide} 
        isMobileView={isMobileView} 
        isEditMode={isEditMode} 
        disableWiggleEffect={true} 
        renderSpecialCardContent={renderSpecialCardContent} 
        specialCardsData={specialCardsData}
      />
      
      {selectedCard && <EditCardModal isOpen={isCardEditModalOpen} onClose={() => setIsCardEditModalOpen(false)} onSave={handleSaveCardEdit} card={selectedCard} />}
    </div>
  );
};

export default DashboardPage;
