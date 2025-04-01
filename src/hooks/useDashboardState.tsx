
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
  const [defaultCards, setDefaultCards] = useState<ActionCardItem[]>([]);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [firstName, setFirstName] = useState('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // Fetch user's info and coordenação
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }
      
      setIsLoadingUser(true);
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo, coordenacao_id')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching user info:', error);
          return;
        }
        
        if (data) {
          // Extract first name
          const firstName = data.nome_completo.split(' ')[0];
          setFirstName(firstName);
          setUserCoordenaticaoId(data.coordenacao_id);
          
          // Load default cards based on the user's department
          const defaultCardsList = getDefaultCards(data.coordenacao_id);
          setDefaultCards(defaultCardsList);
          
          // Set initial action cards
          setActionCards(defaultCardsList);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserInfo();
  }, [userId]);
  
  // Then try to load custom dashboard if available
  useEffect(() => {
    const fetchCustomDashboard = async () => {
      if (!userId) return;
      
      try {
        // First check user's custom dashboard
        const { data: userDashboard, error: userError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userId)
          .single();
        
        if (!userError && userDashboard?.cards_config) {
          try {
            const customCards = JSON.parse(userDashboard.cards_config);
            setActionCards(customCards);
            return;
          } catch (e) {
            console.error('Error parsing user dashboard config:', e);
          }
        }
        
        // If no user-specific dashboard, check if there's a default for the user's department
        if (userCoordenaticaoId) {
          const { data: deptDashboard, error: deptError } = await supabase
            .from('department_dashboards')
            .select('cards_config')
            .eq('department', userCoordenaticaoId)
            .eq('view_type', 'dashboard')
            .single();
          
          if (!deptError && deptDashboard?.cards_config) {
            try {
              const deptCards = JSON.parse(deptDashboard.cards_config);
              setActionCards(deptCards);
              return;
            } catch (e) {
              console.error('Error parsing department dashboard config:', e);
            }
          }
        }
        
        // If no custom dashboards found, use the default cards
        setActionCards(defaultCards);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setActionCards(defaultCards);
      }
    };
    
    // Only fetch custom dashboard if user data is loaded
    if (!isLoadingUser) {
      fetchCustomDashboard();
    }
  }, [userId, userCoordenaticaoId, isLoadingUser, defaultCards]);
  
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
  };
};
