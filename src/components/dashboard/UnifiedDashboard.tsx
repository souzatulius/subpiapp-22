
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';
import { PlusCircle, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import WelcomeCard from '@/components/shared/WelcomeCard';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import HiddenCardsTray from '@/components/dashboard/HiddenCardsTray';

interface UnifiedDashboardProps {
  userId: string;
  dashboardType: 'dashboard' | 'communication';
  title?: string;
  description?: string;
  fallbackCards: ActionCardItem[];
  headerComponent?: React.ReactNode;
}

const CURRENT_DASHBOARD_VERSION = "1.0.0";

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userId,
  dashboardType,
  title,
  description,
  fallbackCards,
  headerComponent
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Use non-generic filter to avoid excessive type instantiation
  const visibleCards = useMemo(() => {
    return cards.filter(card => !card.hidden);
  }, [cards]);
  
  const hiddenCards = useMemo(() => {
    return cards.filter(card => card.hidden === true);
  }, [cards]);
  
  // Simple function to toggle card visibility
  const toggleCardVisibility = (cardId: string) => {
    setCards(currentCards => {
      return currentCards.map(card => {
        if (card.id === cardId) {
          return { ...card, hidden: !card.hidden };
        }
        return card;
      });
    });
  };
  
  // Simple function implementation for deleting a card
  const handleDeleteCard = (id: string) => {
    setCards(currentCards => currentCards.filter(card => card.id !== id));
  };
  
  // Simple function implementation for editing a card
  const handleEditCard = (editedCard: ActionCardItem) => {
    setCards(currentCards => 
      currentCards.map(card => card.id === editedCard.id ? editedCard : card)
    );
  };
  
  // Function to add a new card
  const handleAddNewCard = () => {
    navigate('/settings/dashboard-management');
  };
  
  // Simplified saveDashboard function
  const saveDashboard = async (): Promise<boolean> => {
    try {
      // Create a new array to avoid potential circular references
      const cardsToSave = cards.map(card => ({
        ...card,
        version: card.version || CURRENT_DASHBOARD_VERSION
      }));
      
      const { error } = await supabase
        .from('user_dashboard')
        .upsert({
          user_id: userId,
          dashboard_type: dashboardType,
          cards_config: JSON.stringify(cardsToSave),
          version: CURRENT_DASHBOARD_VERSION,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,dashboard_type'
        });
      
      if (error) throw error;
      
      toast({
        title: "Dashboard salvo com sucesso",
        description: "Suas alterações foram salvas."
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar dashboard:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    
    try {
      console.log("Carregando dashboard para usuário:", userId, "tipo:", dashboardType);
      
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', userId)
        .eq('dashboard_type', dashboardType)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "No rows returned" from postgREST
          console.error("Erro ao carregar dashboard:", error);
          throw error;
        } else {
          console.log("Nenhum dashboard encontrado, usando cards padrão");
        }
      }
      
      if (data && data.cards_config) {
        try {
          const parsedCards = JSON.parse(data.cards_config) as ActionCardItem[];
          console.log("Cards carregados do banco:", parsedCards.length);
          setCards(parsedCards);
        } catch (parseError) {
          console.error("Error parsing cards_config:", parseError);
          console.log("Usando cards fallback devido a erro de parse");
          setCards(fallbackCards);
        }
      } 
      else {
        console.log("Criando configuração inicial com fallback cards");
        // Create a new array of defaultDashboardCards to avoid reference issues
        const defaultDashboardCards = fallbackCards.map(card => ({
          ...card,
          version: CURRENT_DASHBOARD_VERSION
        }));
        
        setCards(defaultDashboardCards);
        
        // Save the default cards to the database
        await supabase
          .from('user_dashboard')
          .upsert({
            user_id: userId,
            dashboard_type: dashboardType,
            cards_config: JSON.stringify(defaultDashboardCards),
            version: CURRENT_DASHBOARD_VERSION,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,dashboard_type'
          });
          
        console.log("Configuração inicial salva no banco");
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setCards(fallbackCards);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      loadDashboard();
    }
  }, [userId, dashboardType]);
  
  // Render UI based on loaded data
  if (!loading && cards.length === 0) {
    return (
      <div className="space-y-6">
        <WelcomeCard
          title="Configure seu Dashboard"
          description="Este dashboard ainda não possui cards. Adicione cards para personalizar sua experiência."
          icon={<Settings className="h-6 w-6" />}
          showButton={true}
          buttonText="Adicionar Cards"
          onButtonClick={() => navigate('/settings/dashboard-management')}
          color="bg-gradient-to-r from-blue-600 to-blue-800"
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {!isMobile && headerComponent ? (
        headerComponent
      ) : title && description && !isMobile ? (
        <WelcomeMessage firstName="" title={title} description={description} />
      ) : null}
      
      {hiddenCards.length > 0 && (
        <HiddenCardsTray 
          hiddenCards={hiddenCards} 
          onShowCard={toggleCardVisibility} 
        />
      )}
      
      <UnifiedCardGrid
        cards={visibleCards}
        setCards={setCards}
        loading={loading}
        handleDeleteCard={handleDeleteCard}
        handleEditCard={handleEditCard}
        handleAddNewCard={handleAddNewCard}
        saveDashboard={saveDashboard}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
    </div>
  );
};

export default UnifiedDashboard;
