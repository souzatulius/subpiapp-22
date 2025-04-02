
import { useDashboardData } from './dashboard/useDashboardData';
import { useCardActions } from './dashboard/useCardActions';
import { useSpecialCardActions } from './dashboard/useSpecialCardActions';
import { useSpecialCardsData } from './dashboard/useSpecialCardsData';
import { DashboardStateReturn } from './dashboard/types';
import { useUserData } from './dashboard/useUserData';
import { useDashboardConfig } from './dashboard/useDashboardConfig';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useDashboardState = (): DashboardStateReturn => {
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get user data (name, department)
  const { firstName, userCoordenaticaoId, isLoadingUser } = useUserData(userId);
  
  // Load dashboard configuration
  const { 
    actionCards, 
    setActionCards, 
    isLoadingDashboard, 
    viewType 
  } = useDashboardConfig(userId, userCoordenaticaoId, isLoadingUser);
  
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
  } = useCardActions(actionCards, setActionCards, userCoordenaticaoId || '');
  
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
    specialCardsData,
    userCoordenaticaoId,
    isLoadingDashboard,
    viewType
  };
};
