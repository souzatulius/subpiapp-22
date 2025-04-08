
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { getDefaultCards } from './defaultCards';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cards from local storage or default configuration
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

  // Handle card reordering - now properly saves mobile order too
  const handleCardsReorder = async (updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (error || !data) {
          // Create new record
          await supabase
            .from('user_dashboard')
            .insert({ 
              user_id: user.id,
              cards_config: JSON.stringify(updatedCards),
              department_id: 'default'
            });
        } else {
          // Update existing record
          await supabase
            .from('user_dashboard')
            .update({ 
              cards_config: JSON.stringify(updatedCards),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
        
        console.log('Dashboard cards saved successfully', {
          cardsCount: updatedCards.length,
          hasMobileOrders: updatedCards.some(card => card.mobileOrder !== undefined)
        });
      } catch (error) {
        console.error('Error saving card order:', error);
      }
    }
  };

  // Handle card edit - receives a card with updated properties
  const handleCardEdit = async (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error saving card updates:', error);
      }
    }
  };

  // Handle card hide - marks a card as hidden
  const handleCardHide = async (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(updatedCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error saving card visibility:', error);
      }
    }
  };

  // Reset dashboard to default configuration
  const resetDashboard = async () => {
    const defaultCards = getDefaultCards();
    setCards(defaultCards);
    
    // Save to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(defaultCards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error resetting dashboard:', error);
      }
    }
  };

  return {
    cards,
    isLoading,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  };
};
