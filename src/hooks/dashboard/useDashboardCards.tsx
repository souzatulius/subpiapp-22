
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultDashboardConfig } from './useDefaultDashboardConfig';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { config: defaultConfig, isLoading: isLoadingDefault } = useDefaultDashboardConfig();

  // Load cards for the current user
  useEffect(() => {
    const fetchCards = async () => {
      if (!user) {
        // If no user, just use the default cards
        setCards(defaultConfig || []);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No record found, use default cards
            setCards(defaultConfig || []);
          } else {
            console.error('Error fetching user dashboard:', error);
            toast({
              title: 'Erro ao carregar dashboard',
              description: 'Não foi possível carregar suas configurações do dashboard.',
              variant: 'destructive',
            });
          }
        } else if (data) {
          // Parse the cards data
          try {
            const parsedCards = JSON.parse(data.cards_config);
            setCards(Array.isArray(parsedCards) ? parsedCards : []);
          } catch (parseError) {
            console.error('Error parsing cards config:', parseError);
            setCards(defaultConfig || []);
          }
        }
      } catch (err) {
        console.error('Error in fetchCards:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoadingDefault) {
      fetchCards();
    }
  }, [user, defaultConfig, isLoadingDefault]);

  // Handle card editing (updating a card)
  const handleCardEdit = async (updatedCard: ActionCardItem) => {
    try {
      // Find the card to update
      const updatedCards = cards.map(card => 
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      );
      
      setCards(updatedCards);
      
      if (user) {
        await saveToDatabase(updatedCards);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o card.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Handle hiding a card
  const handleCardHide = async (cardId: string) => {
    try {
      // Mark the card as hidden
      const updatedCards = cards.map(card => 
        card.id === cardId ? { ...card, isHidden: true } : card
      );
      
      setCards(updatedCards);
      
      if (user) {
        await saveToDatabase(updatedCards);
      }
      
      toast({
        title: 'Card ocultado',
        description: 'O card foi ocultado do seu dashboard.',
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error('Error hiding card:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível ocultar o card.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Handle reordering cards
  const handleCardsReorder = async (newCards: ActionCardItem[]) => {
    try {
      setCards(newCards);
      
      if (user) {
        await saveToDatabase(newCards);
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering cards:', error);
      return false;
    }
  };

  // Helper function to save cards to the database
  const saveToDatabase = async (cardsToSave: ActionCardItem[]) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Update existing record
        await supabase
          .from('user_dashboard')
          .update({ 
            cards_config: JSON.stringify(cardsToSave),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Create new record
        await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: user.id,
            cards_config: JSON.stringify(cardsToSave)
          });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving to database:', error);
      return false;
    }
  };

  return {
    cards,
    isLoading: isLoading || isLoadingDefault,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
  };
};
