
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ActionCardItem } from '@/types/dashboard';
import { DashboardType } from './useDashboardType';

export const useAutosaveDashboard = (
  userId: string | undefined,
  department: string | null,
  defaultCards: ActionCardItem[],
  dashboardType: DashboardType = 'main'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>(defaultCards);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Determine which table to use based on dashboard type
  const tableName = dashboardType === 'main' ? 'user_dashboard' : 'user_dashboard_comunicacao';

  // Load dashboard cards on mount
  useEffect(() => {
    if (!userId) return;
    
    const loadDashboard = async () => {
      setLoading(true);
      try {
        // Use any type to bypass TypeScript strict checking since our tables
        // are dynamically created and not in the TypeScript definitions
        const { data, error } = await supabase
          .from(tableName as any)
          .select('cards_config')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error(`Error loading ${dashboardType} dashboard:`, error);
        } else if (data?.cards_config) {
          try {
            // Parse the JSON string from the database
            const parsedCards = JSON.parse(data.cards_config);
            if (Array.isArray(parsedCards) && parsedCards.length > 0) {
              setCards(parsedCards);
            }
          } catch (parseError) {
            console.error('Error parsing cards config:', parseError);
          }
        }
      } catch (err) {
        console.error(`Error in load${dashboardType}Dashboard:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userId, tableName, dashboardType]);

  // Save dashboard cards whenever they change
  const saveDashboard = useCallback(async (cardsToSave: ActionCardItem[]) => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const cardsJson = JSON.stringify(cardsToSave);
      
      const { data, error } = await supabase
        .from(tableName as any)
        .upsert(
          { 
            user_id: userId, 
            cards_config: cardsJson,
            updated_at: new Date().toISOString() // Convert Date to string
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error(`Error saving ${dashboardType} dashboard:`, error);
        toast({
          title: 'Erro ao salvar dashboard',
          description: 'Não foi possível salvar suas alterações no dashboard.',
          variant: 'destructive',
        });
      } else {
        setLastSaved(new Date().toISOString());
      }
    } catch (err) {
      console.error(`Error in save${dashboardType}Dashboard:`, err);
    } finally {
      setIsSaving(false);
    }
  }, [userId, tableName, dashboardType]);

  // Handle card reordering
  const handleCardsReorder = useCallback((updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    saveDashboard(updatedCards);
    return updatedCards;
  }, [saveDashboard]);

  // Handle editing a card
  const handleSaveCardEdit = useCallback((updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    setCards(updatedCards);
    saveDashboard(updatedCards);
    return updatedCards;
  }, [cards, saveDashboard]);

  // Handle hiding a card
  const handleCardHide = useCallback((cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    saveDashboard(updatedCards);
    return updatedCards;
  }, [cards, saveDashboard]);

  // Reset dashboard to default
  const resetDashboard = useCallback(() => {
    setCards(defaultCards);
    saveDashboard(defaultCards);
    return defaultCards;
  }, [defaultCards, saveDashboard]);

  return {
    cards,
    setCards,
    loading,
    isSaving,
    lastSaved,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard
  };
};
