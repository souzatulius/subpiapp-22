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
  
  // Separate visible and hidden cards
  const visibleCards = useMemo(() => {
    return cards.filter(card => !card.hidden);
  }, [cards]);
  
  const hiddenCards = useMemo(() => {
    return cards.filter(card => card.hidden === true);
  }, [cards]);
  
  // Function to toggle card visibility
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
  
  // Function to delete a card
  const handleDeleteCard = (id: string) => {
    setCards(currentCards => currentCards.filter(card => card.id !== id));
  };
  
  // Function to edit a card
  const handleEditCard = (editedCard: ActionCardItem) => {
    setCards(currentCards => 
      currentCards.map(card => card.id === editedCard.id ? editedCard : card)
    );
  };
  
  // Function to add a new card (redirects to card customization)
  const handleAddNewCard = () => {
    navigate('/settings/dashboard-management');
  };
  
  // Function to save the dashboard state to the database
  const saveDashboard = async (): Promise<boolean> => {
    try {
      // Add version field to all cards that don't have it
      const cardsWithVersion = cards.map(card => ({
        ...card,
        version: card.version || CURRENT_DASHBOARD_VERSION
      }));
      
      const { error } = await supabase
        .from('user_dashboard')
        .upsert({
          user_id: userId,
          dashboard_type: dashboardType,
          cards_config: JSON.stringify(cardsWithVersion),
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
  
  // Load the dashboard from the database
  const loadDashboard = async () => {
    setLoading(true);
    
    try {
      // Fetch the user's dashboard from the database
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('cards_config')
        .eq('user_id', userId)
        .eq('dashboard_type', dashboardType)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        throw error;
      }
      
      // If dashboard exists in the database, use it
      if (data && data.cards_config) {
        let parsedCards;
        try {
          parsedCards = JSON.parse(data.cards_config);
        } catch (parseError) {
          console.error("Error parsing cards_config:", parseError);
          parsedCards = fallbackCards;
        }
        setCards(parsedCards);
      } 
      // Otherwise, use the fallback cards
      else {
        const defaultDashboardCards = fallbackCards.map(card => ({
          ...card,
          version: CURRENT_DASHBOARD_VERSION
        }));
        
        setCards(defaultDashboardCards);
        
        // Automatically save the default dashboard for this user
        const { error: saveError } = await supabase
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
        
        if (saveError) {
          console.error("Erro ao salvar dashboard padrão:", saveError);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      
      // Use fallback cards if there's an error
      setCards(fallbackCards.map(card => ({
        ...card,
        version: CURRENT_DASHBOARD_VERSION
      })));
    } finally {
      setLoading(false);
    }
  };
  
  // Load the dashboard on component mount
  useEffect(() => {
    if (userId) {
      loadDashboard();
    }
  }, [userId, dashboardType]);
  
  // Handle showing empty state
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
      
      {/* Hidden Cards Tray */}
      {hiddenCards.length > 0 && (
        <HiddenCardsTray 
          hiddenCards={hiddenCards} 
          onShowCard={(cardId) => toggleCardVisibility(cardId)} 
        />
      )}
      
      {/* Card Grid */}
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
