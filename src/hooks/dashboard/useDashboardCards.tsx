
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { getInitialDashboardCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);

  useEffect(() => {
    if (isDepartmentLoading) return;

    const fetchCards = async () => {
      if (!user) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      // Normalize department value for comparison
      const normalizedDepartment = userDepartment
        ? userDepartment
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        : undefined;

      const defaultCards = getInitialDashboardCards(normalizedDepartment);

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'inicial')
          .single();

        if (error || !data?.cards_config) {
          setCards(defaultCards);
          return;
        }

        // Safe parsing of card config data
        let parsedCards: ActionCardItem[] = [];
        
        if (typeof data.cards_config === 'string') {
          try {
            parsedCards = JSON.parse(data.cards_config);
          } catch (e) {
            console.error('Error parsing cards_config:', e);
          }
        } else if (Array.isArray(data.cards_config)) {
          parsedCards = data.cards_config;
        }

        // Only use the parsed cards if they form a valid array
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          setCards(parsedCards);
        } else {
          setCards(defaultCards);
        }
      } catch (error) {
        console.error('Error fetching dashboard cards:', error);
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user, userDepartment, isDepartmentLoading]);

  // Add cleanup/save effect when user navigates away
  useEffect(() => {
    // Define the event handler for beforeunload
    const saveOnExit = () => {
      if (user && cards.length > 0) {
        try {
          // Use synchronous localStorage as a backup
          localStorage.setItem('main_dashboard_backup', JSON.stringify({
            userId: user.id,
            cards: cards,
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error in auto-save to localStorage:', error);
        }
      }
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', saveOnExit);
    
    // Cleanup function
    return () => {
      // Save changes when component unmounts
      if (user && cards.length > 0) {
        persistCards(cards);
      }
      
      // Remove event listener
      window.removeEventListener('beforeunload', saveOnExit);
    };
  }, [user, cards]);

  const persistCards = async (updatedCards: ActionCardItem[]) => {
    if (!user) return;
    
    // Create a distinct clone to avoid mutation issues
    const cardsCopy = JSON.parse(JSON.stringify(updatedCards));
    setCards(cardsCopy);

    try {
      await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          page: 'inicial',
          cards_config: JSON.stringify(cardsCopy),
          department_id: userDepartment || 'default'
        });
    } catch (error) {
      console.error('Erro ao salvar configuração de cards:', error);
    }
  };

  const resetDashboard = async () => {
    if (!user) return;
    
    // Get default cards based on user department
    const normalizedDepartment = userDepartment
      ? userDepartment
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : undefined;
    
    const defaultCards = getInitialDashboardCards(normalizedDepartment);
    
    // Set cards to default
    setCards(defaultCards);
    
    try {
      // Remove the custom configuration from the database
      await supabase
        .from('user_dashboard')
        .delete()
        .eq('user_id', user.id)
        .eq('page', 'inicial');
    } catch (error) {
      console.error('Erro ao resetar dashboard:', error);
    }
  };

  const handleCardEdit = (cardToUpdate: ActionCardItem) => {
    const updatedCards = cards.map(card =>
      card.id === cardToUpdate.id ? cardToUpdate : card
    );
    persistCards(updatedCards);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isHidden: true } : card
    );
    persistCards(updatedCards);
  };

  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    persistCards(updatedCards);
  };

  return {
    cards,
    isLoading: isLoading || isDepartmentLoading,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  };
};

// Add default export to support both import styles
export default useDashboardCards;
