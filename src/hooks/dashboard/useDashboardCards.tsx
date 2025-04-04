
import { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { useInitialCards } from './useInitialCards';
import { useCardOperations } from './useCardOperations';

export const useDashboardCards = () => {
  const { user } = useAuth();
  const { userDepartment, isLoading } = useDepartment(user);
  const { cards, setCards } = useInitialCards(userDepartment);
  const { handleCardEdit, handleCardHide } = useCardOperations(cards, setCards, user, userDepartment);

  return {
    cards,
    isLoading,
    handleCardEdit,
    handleCardHide
  };
};
