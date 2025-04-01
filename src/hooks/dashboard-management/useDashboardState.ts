
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { useCardActions } from '../dashboard/useCardActions';
import { useSpecialCardActions } from '../dashboard/useSpecialCardActions';
import { useSpecialCardsData } from '../dashboard/useSpecialCardsData';
import { getDefaultCards } from '../dashboard/defaultCards';

interface UseDashboardStateResult {
  firstName: string;
  actionCards: ActionCardItem[];
  setActionCards: React.Dispatch<React.SetStateAction<ActionCardItem[]>>;
  userCoordenacaoId: string | null;
  isLoading: boolean;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (open: boolean) => void;
  editingCard: ActionCardItem | null;
  handleAddNewCard: () => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleSaveCard: (data: Partial<ActionCardItem>) => void;
  handleDeleteCard: (id: string) => void;
  specialCardsData: ReturnType<typeof useSpecialCardsData>;
  newDemandTitle: string;
  setNewDemandTitle: (title: string) => void;
  handleQuickDemandSubmit: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (query: string) => void;
}

export const useDashboardState = (userId?: string): UseDashboardStateResult => {
  const [firstName, setFirstName] = useState('');
  const [userCoordenacaoId, setUserCoordenacaoId] = useState<string | null>(null);
  const [defaultCards, setDefaultCards] = useState<ActionCardItem[]>([]);
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user info (nome + coordenação)
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome_completo, coordenacao_id')
          .eq('id', userId)
          .single();

        if (error || !data) {
          console.error('Erro ao buscar dados do usuário:', error);
          return;
        }

        const first = data.nome_completo.split(' ')[0];
        setFirstName(first);
        setUserCoordenacaoId(data.coordenacao_id);

        const defaults = getDefaultCards(data.coordenacao_id);
        setDefaultCards(defaults);
        setActionCards(defaults);
      } catch (err) {
        console.error('Erro ao carregar informações do usuário:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Tenta carregar dashboard personalizado ou padrão
  useEffect(() => {
    const fetchDashboardConfig = async () => {
      if (!userId || !userCoordenacaoId) return;

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

        const { data: deptDashboard } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', userCoordenacaoId)
          .eq('view_type', 'dashboard')
          .maybeSingle();

        if (deptDashboard?.cards_config) {
          const parsed = JSON.parse(deptDashboard.cards_config) as ActionCardItem[];
          setActionCards(parsed);
          return;
        }

        setActionCards(defaultCards);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setActionCards(defaultCards);
      }
    };

    if (!isLoading) {
      fetchDashboardConfig();
    }
  }, [userId, userCoordenacaoId, isLoading, defaultCards]);

  // Ações com os cards (editar, excluir, adicionar)
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    handleDeleteCard
  } = useCardActions(actionCards, setActionCards);

  // Ações especiais para cards de busca e solicitação rápida
  const {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useSpecialCardActions();

  // Dados dinâmicos dos cards especiais
  const specialCardsData = useSpecialCardsData();

  return {
    firstName,
    actionCards,
    setActionCards,
    userCoordenacaoId,
    isLoading,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    handleDeleteCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  };
};
