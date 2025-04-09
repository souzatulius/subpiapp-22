
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { getDefaultCards } from './defaultCards';
import { toast } from '@/hooks/use-toast';
import { useCardStorage } from './useCardStorage';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { saveCardConfig, isSaving } = useCardStorage(user, null);

  // Load cards from database or default configuration
  useEffect(() => {
    const fetchUserCards = async () => {
      setIsLoading(true);
      
      if (!user) {
        const defaultCards = getDefaultCards();
        setCards(defaultCards);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error || !data || !data.cards_config) {
          console.log('Fallback to default cards');
          // Fallback to default cards
          const defaultCards = getDefaultCards();
          setCards(defaultCards);
        } else {
          console.log('Using user cards from DB');
          // Parse JSON if needed
          const userCards = typeof data.cards_config === 'string' 
            ? JSON.parse(data.cards_config) 
            : data.cards_config;
            
          setCards(userCards);
        }
      } catch (error) {
        console.error('Error fetching user dashboard settings:', error);
        // Fallback to default cards
        const defaultCards = getDefaultCards();
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCards();
  }, [user]);

  // Handle card reordering with auto-save
  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    // Determine if we are in mobile view by checking the window width
    const isMobileView = window.innerWidth < 768;
    
    // If in mobile view, update mobileOrder for all cards
    if (isMobileView) {
      updatedCards.forEach((card, index) => {
        card.mobileOrder = index;
      });
    }
    
    setCards(updatedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(updatedCards);
    }
    
    return updatedCards;
  };

  // Handle card edit with auto-save
  const handleCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(updatedCards);
    }
    
    return updatedCard;
  };

  // Handle card hide with auto-save
  const handleCardHide = (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(updatedCards);
    }
    
    return updatedCards;
  };

  // Reset dashboard to default configuration
  const resetDashboard = () => {
    const defaultCards = getDefaultCards();
    setCards(defaultCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(defaultCards);
    }
    
    return defaultCards;
  };

  return {
    cards,
    isLoading,
    isSaving,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  };
};
