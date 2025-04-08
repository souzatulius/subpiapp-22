
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { ActionCardItem } from '@/types/dashboard';

export const useAutosaveDashboard = (
  initialCards: ActionCardItem[],
  saveTrigger?: number 
) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<ActionCardItem[]>(initialCards);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load dashboard cards on mount
  useEffect(() => {
    if (!user) return;
    
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading dashboard:', error);
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
        console.error('Error in loadDashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // Save dashboard cards whenever they change
  const saveDashboard = useCallback(async (cardsToSave: ActionCardItem[]) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const cardsJson = JSON.stringify(cardsToSave);
      
      const { data, error } = await supabase
        .from('user_dashboard')
        .upsert(
          { 
            user_id: user.id, 
            cards_config: cardsJson,
            updated_at: new Date().toISOString() // Convert Date to string
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error saving dashboard:', error);
        toast({
          title: 'Erro ao salvar dashboard',
          description: 'Não foi possível salvar suas alterações no dashboard.',
          variant: 'destructive',
        });
      } else {
        setLastSaved(new Date().toISOString());
      }
    } catch (err) {
      console.error('Error in saveDashboard:', err);
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  // Debounced save
  useEffect(() => {
    if (!user || cards === initialCards) return;
    
    const timeoutId = setTimeout(() => {
      saveDashboard(cards);
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [cards, saveDashboard, initialCards, user]);

  // Manual save trigger
  useEffect(() => {
    if (saveTrigger && cards.length > 0) {
      saveDashboard(cards);
    }
  }, [saveTrigger, saveDashboard, cards]);

  return {
    cards,
    setCards,
    loading,
    isSaving,
    lastSaved
  };
};
