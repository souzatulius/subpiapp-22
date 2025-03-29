
import { useDashboardData } from './dashboard/useDashboardData';
import { useCardActions } from './dashboard/useCardActions';
import { useSpecialCardActions } from './dashboard/useSpecialCardActions';
import { useSpecialCardsData } from './dashboard/useSpecialCardsData';
import { DashboardStateReturn } from './dashboard/types';
import { getDefaultCards } from './dashboard/defaultCards';
import { useState } from 'react';

export const useDashboardState = (userId?: string): DashboardStateReturn => {
  const defaultCards = getDefaultCards();
  const [actionCards, setActionCards] = useState(defaultCards);
  const [firstName, setFirstName] = useState('Usuário');
  
  // Try to load data if userId is provided
  useDashboardData(userId || '');
  
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
