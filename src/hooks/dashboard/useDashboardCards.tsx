
import { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { useInitialCards } from './useInitialCards';
import { useCardOperations } from './useCardOperations';
import { Skeleton } from '@/components/ui/skeleton';

export const useDashboardCards = () => {
  const { user } = useAuth();
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);
  const { cards, setCards, isLoading: isCardsLoading } = useInitialCards(userDepartment);
  const { handleCardEdit, handleCardHide } = useCardOperations(cards, setCards, user, userDepartment);

  // Combinando os estados de carregamento para garantir consistência
  const isLoading = isDepartmentLoading || isCardsLoading;

  return {
    cards,
    isLoading,
    handleCardEdit,
    handleCardHide
  };
};
