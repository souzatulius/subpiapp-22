
import { useState, useEffect, useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useDefaultDashboardConfig } from './useDefaultDashboardConfig';
import { useDashboardConfig } from './useDashboardConfig';

interface DashboardConfig {
  id: string;
  user_id: string;
  cards_config: string;
  created_at: string;
}

export const useComunicacaoDashboard = (
  user: any = null, 
  isPreview = false, 
  department = 'comunicacao'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [specialCardsData, setSpecialCardsData] = useState({
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: true,
    coordenacaoId: '',
    usuarioId: ''
  });
  
  // Use the default config hook for preview mode or when user is not logged in
  const defaultConfig = useDefaultDashboardConfig(department);
  
  // Use the dashboard config hook for actual user data
  const dashboardConfig = useDashboardConfig(department, 'communication');
  
  // Determine if we're loading
  const isLoading = isPreview ? defaultConfig.isLoading : dashboardConfig.isLoading;

  // Fetch special cards data
  useEffect(() => {
    // Load special cards data if not in preview mode
    const loadSpecialCardsData = async () => {
      if (isPreview || !user) {
        setSpecialCardsData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Get user's coordenacao
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        const coordenacaoId = userData?.coordenacao_id;

        // Todo: Load other data like overdue demands, notes to approve, etc.
        const overdueCount = 0; // Placeholder
        const notesToApprove = 0; // Placeholder
        const responsesToDo = 0; // Placeholder

        setSpecialCardsData({
          overdueCount,
          overdueItems: [],
          notesToApprove,
          responsesToDo,
          isLoading: false,
          coordenacaoId: coordenacaoId || '',
          usuarioId: user.id
        });

      } catch (error) {
        console.error('Error loading special cards data:', error);
        setSpecialCardsData(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadSpecialCardsData();
  }, [user, isPreview]);

  // Fetch cards based on whether we're in preview mode or not
  useEffect(() => {
    if (isPreview || !user) {
      // For preview, use the default config
      setCards(defaultConfig.config);
    } else {
      // For logged-in users, use their saved config or the default if empty
      setCards(dashboardConfig.config.length > 0 ? dashboardConfig.config : defaultConfig.config);
    }
  }, [isPreview, user, defaultConfig.config, dashboardConfig.config]);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  // Handle card edit
  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  // Handle saving card edit
  const handleSaveCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    setCards(updatedCards);
    setIsEditModalOpen(false);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(updatedCards);
    }
  };

  // Handle card hide
  const handleCardHide = (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(updatedCards);
    }
  };

  // Handle cards reorder
  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(updatedCards);
    }
  };

  // Reset dashboard to default configuration
  const resetDashboard = () => {
    setCards(defaultConfig.config);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(defaultConfig.config);
    }
  };

  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    specialCardsData,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
