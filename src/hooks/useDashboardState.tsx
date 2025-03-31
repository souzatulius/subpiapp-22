
import { useDashboardData } from './dashboard/useDashboardData';
import { useCardActions } from './dashboard/useCardActions';
import { useSpecialCardActions } from './dashboard/useSpecialCardActions';
import { useSpecialCardsData } from './dashboard/useSpecialCardsData';
import { DashboardStateReturn } from './dashboard/types';
import { getDefaultCards } from './dashboard/defaultCards';
import { useState, useEffect } from 'react';
import { ActionCardItem, DataSourceKey } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardState = (userId?: string): DashboardStateReturn => {
  const defaultCards = getDefaultCards();
  const [actionCards, setActionCards] = useState<ActionCardItem[]>(defaultCards);
  const [firstName, setFirstName] = useState('');
  
  // Fetch user's first name
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome_completo')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user name:', error);
        return;
      }
      
      if (data && data.nome_completo) {
        // Extract first name
        const firstName = data.nome_completo.split(' ')[0];
        setFirstName(firstName);
      } else {
        setFirstName('Usuário');
      }
    };
    
    fetchUserName();
  }, [userId]);
  
  // Try to load data if userId is provided
  useDashboardData(
    'pendencias_por_coordenacao',
    userId || '',
    userId || ''
  );
  
  // Card manipulation actions
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  } = useCardActions(actionCards, setActionCards);
  
  // Special card actions (search and quick demand)
  const {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useSpecialCardActions();
  
  // Fetch data for special cards
  const specialCardsData = useSpecialCardsData();

  return {
    firstName,
    actionCards,
    setActionCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    specialCardsData
  };
};
