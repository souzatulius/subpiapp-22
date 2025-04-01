
import { useDashboardData } from './dashboard/useDashboardData';
import { useCardActions } from './dashboard/useCardActions';
import { useSpecialCardActions } from './dashboard/useSpecialCardActions';
import { useSpecialCardsData } from './dashboard-management/dashboard/useSpecialCardsData';
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { getDefaultCards } from './dashboard/defaultCards';

export interface DashboardState {
  firstName: string;
  actionCards: ActionCardItem[];
  setActionCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (v: boolean) => void;
  editingCard: ActionCardItem | null;
  handleDeleteCard: (id: string) => void;
  handleAddNewCard: () => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleSaveCard: (data: Partial<ActionCardItem>) => void;
  newDemandTitle: string;
  setNewDemandTitle: (title: string) => void;
  handleQuickDemandSubmit: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearchSubmit: (query?: string) => void; // Modified to accept optional parameter
  specialCardsData: ReturnType<typeof useSpecialCardsData>;
  userCoordenaticaoId: string | null;
  isLoading: boolean; 
}

export const useDashboardState = (userId?: string): DashboardState => {
  const [defaultCards, setDefaultCards] = useState<ActionCardItem[]>([]);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [firstName, setFirstName] = useState('');
  const [userCoordenaticaoId, setUserCoordenaticaoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo, coordenacao_id')
          .eq('id', userId)
          .single();

        if (error || !data) {
          console.error("Error fetching user info:", error);
          setIsLoading(false);
          return;
        }

        setFirstName(data.nome_completo.split(' ')[0]);
        setUserCoordenaticaoId(data.coordenacao_id);
        
        // Get default cards for this department
        const defaultCardsList = getDefaultCards(data.coordenacao_id);
        
        setDefaultCards(defaultCardsList);
        setActionCards(defaultCardsList);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  useEffect(() => {
    const fetchCustomDashboard = async () => {
      if (!userId || isLoading) return;

      try {
        const { data: userDashboard } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userId)
          .single();

        if (userDashboard?.cards_config) {
          const parsed = JSON.parse(userDashboard.cards_config) as ActionCardItem[];
          setActionCards(parsed);
          return;
        }

        if (userCoordenaticaoId) {
          const { data: deptDashboard } = await supabase
            .from('department_dashboards')
            .select('cards_config')
            .eq('department', userCoordenaticaoId)
            .eq('view_type', 'dashboard')
            .single();

          if (deptDashboard?.cards_config) {
            const parsed = JSON.parse(deptDashboard.cards_config) as ActionCardItem[];
            setActionCards(parsed);
            return;
          }
        }

        setActionCards(defaultCards);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setActionCards(defaultCards);
      }
    };

    if (!isLoading) {
      fetchCustomDashboard();
    }
  }, [userId, userCoordenaticaoId, isLoading, defaultCards]);

  useDashboardData('pendencias_por_coordenacao', userId || '', userId || '');

  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  } = useCardActions(actionCards, setActionCards);

  const {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useSpecialCardActions();

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
    isLoading
  };
};
