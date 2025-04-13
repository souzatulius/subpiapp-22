
import React, { useState, useEffect } from 'react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardState } from '@/hooks/useDashboardState';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    const updatedCards = actionCards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    setActionCards(updatedCards);
    saveCardsToSupabase(updatedCards);
  };

  const handleCardsReorder = (reorderedCards: ActionCardItem[]) => {
    setActionCards(reorderedCards);
    saveCardsToSupabase(reorderedCards);
  };

  const saveCardsToSupabase = async (cards: ActionCardItem[]) => {
    if (!user || !user.id) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          cards_config: JSON.stringify(cards),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving dashboard configuration:', error);
      toast.error('Erro ao salvar as configurações do dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const resetDashboard = async () => {
    if (!user || !user.id) return;
    
    // Reset to default cards
    // This would typically come from a default configuration
    // For now we'll just reload the page
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <WelcomeCard
          title="Dashboard"
          description="Acompanhe indicadores e acesse as principais funcionalidades do sistema"
          greeting={true}
          userName={firstName}
          showResetButton={isEditMode}
          onResetClick={resetDashboard}
          showButton={true}
          buttonText={isEditMode ? "Concluir Edição" : "Personalizar Dashboard"}
          buttonVariant="outline"
          onButtonClick={toggleEditMode}
          icon={<div className="h-8 w-8 mr-4 text-gray-800" />}
        />
      </div>

      <CardGridContainer
        cards={actionCards}
        onCardsChange={handleCardsReorder}
        onEditCard={handleCardEdit}
        onHideCard={handleCardHide}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        disableWiggleEffect={!isEditMode}
      />
    </div>
  );
};

export default DashboardPage;
