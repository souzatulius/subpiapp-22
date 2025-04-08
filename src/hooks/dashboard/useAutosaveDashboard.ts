
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

export const useAutosaveDashboard = (
  userId: string | undefined,
  department: string,
  initialCards: ActionCardItem[]
) => {
  const [cards, setCards] = useState<ActionCardItem[]>(initialCards);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load dashboard config from database
  const loadUserDashboard = useCallback(async () => {
    if (!userId) return;
    
    try {
      // First check for user-specific dashboard
      const { data: userData, error: userError } = await supabase
        .from('user_dashboard')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (userData) {
        try {
          const parsedConfig = JSON.parse(userData.cards_config);
          if (Array.isArray(parsedConfig) && parsedConfig.length > 0) {
            setCards(parsedConfig);
            return;
          }
        } catch (e) {
          console.error('Error parsing user dashboard config:', e);
        }
      }
      
      // If no user-specific dashboard, check for department dashboard
      const { data: deptData, error: deptError } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', department)
        .eq('view_type', 'dashboard')
        .maybeSingle();

      if (deptData) {
        try {
          const parsedConfig = JSON.parse(deptData.cards_config);
          if (Array.isArray(parsedConfig) && parsedConfig.length > 0) {
            setCards(parsedConfig);
            return;
          }
        } catch (e) {
          console.error('Error parsing department dashboard config:', e);
        }
      }
      
      // If still no config, set initial cards
      setCards(initialCards);
      
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
      setCards(initialCards);
    }
  }, [userId, department, initialCards]);

  // Save dashboard config to database
  const saveUserDashboard = useCallback(async (cardsToSave: ActionCardItem[]) => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      // Save to user_dashboard table
      const { data: existingData, error: checkError } = await supabase
        .from('user_dashboard')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      const cardsConfig = JSON.stringify(cardsToSave);
      
      if (existingData) {
        // Update existing record
        await supabase
          .from('user_dashboard')
          .update({ cards_config: cardsConfig, updated_at: new Date() })
          .eq('user_id', userId);
      } else {
        // Insert new record
        await supabase
          .from('user_dashboard')
          .insert({ 
            user_id: userId, 
            cards_config: cardsConfig
          });
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast({
        title: 'Erro ao salvar dashboard',
        description: 'Não foi possível salvar suas alterações.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [userId, toast]);

  // Update cards when department or userId changes
  useEffect(() => {
    if (userId) {
      loadUserDashboard();
    }
  }, [userId, department, loadUserDashboard]);

  // Function to handle card reordering with autosave
  const handleCardsReorder = useCallback((reorderedCards: ActionCardItem[]) => {
    setCards(reorderedCards);
    saveUserDashboard(reorderedCards);
  }, [saveUserDashboard]);

  // Handle card edits with autosave
  const handleSaveCardEdit = useCallback((updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    setCards(updatedCards);
    saveUserDashboard(updatedCards);
  }, [cards, saveUserDashboard]);

  // Handle hiding a card with autosave
  const handleCardHide = useCallback((cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    setCards(updatedCards);
    saveUserDashboard(updatedCards);
  }, [cards, saveUserDashboard]);

  // Reset dashboard to default
  const resetDashboard = useCallback(() => {
    setCards(initialCards);
    saveUserDashboard(initialCards);
  }, [initialCards, saveUserDashboard]);

  return {
    cards,
    isSaving,
    lastSaved,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard
  };
};
