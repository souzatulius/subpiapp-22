
import { useState, useEffect, useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useInitialCards } from './useInitialCards';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userCoordenaticaoId } = useUserData(user?.id);

  // Pass the user's department to useInitialCards
  const { cards: initialCards, isLoading: isLoadingInitial } = useInitialCards(userCoordenaticaoId);

  useEffect(() => {
    const loadCards = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (isLoadingInitial) {
        return; // Wait for initial cards to load first
      }

      try {
        setIsLoading(true);
        console.log("Loading cards for user:", user.id, "department:", userCoordenaticaoId);
        
        // Use a timeout to prevent excessive loading time
        const timeoutId = setTimeout(() => {
          if (isLoading) {
            console.log("Loading timeout reached, using initial cards");
            setCards(initialCards);
            setIsLoading(false);
          }
        }, 3000);
        
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .maybeSingle();

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        if (error && error.code !== 'PGRST116') {
          console.error('[DashboardCards] Error fetching user cards:', error);
          // Fallback to initial cards if there's an unexpected error
          setCards(initialCards);
        } else if (data?.cards_config) {
          try {
            const customCards = typeof data.cards_config === 'string'
              ? JSON.parse(data.cards_config)
              : data.cards_config;

            const isValid = Array.isArray(customCards) &&
              customCards.length > 0 &&
              customCards.every(card => card.id && card.path);

            if (isValid) {
              setCards(customCards);
              console.log("Loaded custom cards configuration:", customCards.length, "cards");
            } else {
              console.warn('[DashboardCards] Invalid cards configuration, using default cards');
              setCards(initialCards);
            }
          } catch (e) {
            console.error('[DashboardCards] Error parsing cards config:', e);
            setCards(initialCards);
          }
        } else {
          // No user-specific cards found, use the initial cards
          console.log("No custom cards found, using initial cards filtered by department:", userCoordenaticaoId);
          setCards(initialCards);
        }
      } catch (e) {
        console.error('[DashboardCards] General error loading cards:', e);
        setCards(initialCards);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [user, userCoordenaticaoId, initialCards, isLoadingInitial]);

  const handleCardEdit = (updatedCard: ActionCardItem) => {
    setCards(currentCards =>
      currentCards.map(card =>
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      )
    );
  };

  const handleCardHide = (cardId: string) => {
    setCards(currentCards =>
      currentCards.map(card =>
        card.id === cardId ? { ...card, isHidden: true } : card
      )
    );
    
    // Save the updated cards configuration to the database
    if (user) {
      const updatedCards = cards.map(card => 
        card.id === cardId ? { ...card, isHidden: true } : card
      );
      
      saveUserCards(user.id, updatedCards);
    }
  };
  
  const saveUserCards = async (userId: string, cardConfig: ActionCardItem[]) => {
    try {
      const { data, error: checkError } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const cardsJson = JSON.stringify(cardConfig);
      
      if (data) {
        const { error } = await supabase
          .from('user_dashboard')
          .update({ cards_config: cardsJson })
          .eq('id', data.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: userId, 
            cards_config: cardsJson,
            department_id: userCoordenaticaoId || 'default'
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Configuração salva",
        description: "Suas preferências foram salvas com sucesso"
      });
      
    } catch (error) {
      console.error('Error saving card configuration:', error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Não foi possível salvar a configuração dos cards",
        variant: "destructive"
      });
    }
  };

  return {
    cards,
    isLoading: isLoading || isLoadingInitial,
    setCards,
    handleCardEdit,
    handleCardHide
  };
};

export default useDashboardCards;
