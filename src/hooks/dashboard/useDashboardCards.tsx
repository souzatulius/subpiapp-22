
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useInitialCards } from './useInitialCards';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useUserData } from './useUserData';

// Enhanced version of the hook to provide actual card data
export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userCoordenaticaoId } = useUserData(user?.id);
  
  // Use the initialCards hook to get the default cards based on user department
  const { cards: initialCards, isLoading: isLoadingInitial } = useInitialCards(userCoordenaticaoId);
  
  useEffect(() => {
    if (!isLoadingInitial) {
      setCards(initialCards);
      setIsLoading(false);
    }
  }, [initialCards, isLoadingInitial]);
  
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
