
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
  
  // Use the default config hook for preview mode or when user is not logged in
  const defaultConfig = useDefaultDashboardConfig(department);
  
  // Use the dashboard config hook for actual user data
  const dashboardConfig = useDashboardConfig(department, 'communication');
  
  // Determine if we're loading
  const isLoading = isPreview ? defaultConfig.isLoading : dashboardConfig.isLoading;

  // Fetch cards based on whether we're in preview mode or not
  useEffect(() => {
    if (isPreview || !user) {
      // For preview, use the default config
      setCards(defaultConfig.config.map(card => ({
        ...card,
        height: '2' // Set all cards to double height
      })));
    } else {
      // For logged-in users, use their saved config or the default if empty
      const configToUse = dashboardConfig.config.length > 0 ? dashboardConfig.config : defaultConfig.config;
      setCards(configToUse.map(card => ({
        ...card,
        height: '2' // Set all cards to double height
      })));
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
      card.id === updatedCard.id ? {...updatedCard, height: '2'} : card
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
    // Ensure all cards have height of 2
    const heightAdjustedCards = updatedCards.map(card => ({
      ...card,
      height: '2'
    }));
    
    setCards(heightAdjustedCards);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(heightAdjustedCards);
    }
  };

  // Reset dashboard to default configuration
  const resetDashboard = () => {
    const resetCards = defaultConfig.config.map(card => ({
      ...card,
      height: '2'
    }));
    
    setCards(resetCards);
    
    // Save changes if not in preview mode
    if (!isPreview && user) {
      dashboardConfig.saveConfig(resetCards);
    }
  };

  return {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  };
};
