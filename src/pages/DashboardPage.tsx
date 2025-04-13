
import React, { useState, useEffect, useCallback } from 'react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardState } from '@/hooks/useDashboardState';
import { RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EditCardModal from '@/components/dashboard/EditCardModal';
import PendingActionsCard from '@/components/dashboard/cards/PendingActionsCard';
import OriginDemandStatistics from '@/components/dashboard/cards/OriginDemandStatistics';

const DashboardPage: React.FC = () => {
  const {
    viewType,
    actionCards,
    setActionCards,
    toggleView,
    firstName,
    user
  } = useDashboardState();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCardEditModalOpen, setIsCardEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isMobileView = useIsMobile();

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
      const {
        error
      } = await supabase.from('user_dashboard').upsert({
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
      const {
        data,
        error
      } = await supabase.from('department_dashboard').select('cards_config').eq('department', 'main').single();
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

  // Render specialized content for specific cards
  const renderSpecialCardContent = useCallback((cardId: string) => {
    if (cardId === 'origem-demandas') {
      return <OriginDemandStatistics />;
    }
    if (cardId === 'acoes-pendentes') {
      return <PendingActionsCard />;
    }
    if (cardId === 'busca-rapida') {
      return <div className="p-4 flex items-center justify-center w-full h-full">
          <div className="bg-white rounded-lg w-full flex items-center shadow-sm border border-gray-200">
            <Search className="h-5 w-5 ml-3 text-gray-500" />
            <input type="text" placeholder="Pesquisar..." onClick={e => {
            e.preventDefault();
            window.location.href = '/search';
          }} className="w-full p-2 border-none focus:outline-none focus:ring-0 rounded-lg px-0 py-0" />
          </div>
        </div>;
    }
    return null;
  }, []);

  return <div className="space-y-6">
      <div className="mb-8">
        <WelcomeCard title="Dashboard" description="Acompanhe indicadores e acesse as principais funcionalidades do sistema" greeting={true} userName={firstName} userNameClassName="text-gray-950" showResetButton={isEditMode} onResetClick={resetDashboard} showButton={true} buttonText={isEditMode ? "Concluir Edição" : "Personalizar Dashboard"} buttonVariant="outline" onButtonClick={toggleEditMode} spacingClassName="space-y-3" />
      </div>

      {isSaving && <div className="bg-blue-50 text-blue-700 p-2 rounded-lg mb-4 flex items-center">
          <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full mr-2"></div>
          Salvando alterações...
        </div>}

      <CardGridContainer cards={actionCards} onCardsChange={handleCardsReorder} onEditCard={handleCardEdit} onHideCard={handleCardHide} isMobileView={isMobileView} isEditMode={isEditMode} disableWiggleEffect={!isEditMode} renderSpecialCardContent={renderSpecialCardContent} />
      
      {selectedCard && <EditCardModal isOpen={isCardEditModalOpen} onClose={() => setIsCardEditModalOpen(false)} onSave={handleSaveCardEdit} card={selectedCard} />}
    </div>;
};

export default DashboardPage;
