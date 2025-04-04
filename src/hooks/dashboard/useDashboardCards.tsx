import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useInitialCards } from './useInitialCards';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserData } from './useUserData';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userCoordenaticaoId } = useUserData(user?.id);

  const { cards: initialCards, isLoading: isLoadingInitial } = useInitialCards(userCoordenaticaoId);

  useEffect(() => {
    const loadCards = async () => {
      if (!user || isLoadingInitial) return;

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();

        if (error || !data?.cards_config) {
          // Se não há cards salvos, usa os defaults
          setCards(initialCards);
        } else {
          const customCards = typeof data.cards_config === 'string'
            ? JSON.parse(data.cards_config)
            : data.cards_config;

          const isValid = Array.isArray(customCards) &&
            customCards.length >= 6 &&
            customCards.every(card => card.id && card.path);

          if (isValid) {
            setCards(customCards);
          } else {
            console.warn('[DashboardCards] Cards inválidos ou vazios. Usando padrão.');
            setCards(initialCards);
          }
        }
      } catch (e) {
        console.error('[DashboardCards] Erro ao carregar cards personalizados:', e);
        setCards(initialCards);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [user, initialCards, isLoadingInitial]);

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
