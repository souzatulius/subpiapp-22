
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { getDashboardCards } from '@/services/dashboardService';
import { defaultComunicacaoCards } from '@/data/dashboardCards';
import { toast } from '@/hooks/use-toast';

export const useDashboardCards = (userId?: string | null, departmentId?: string) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      if (!userId) {
        setCards(defaultComunicacaoCards);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userCards = await getDashboardCards(userId, departmentId);
        
        if (userCards && userCards.length > 0) {
          setCards(userCards);
        } else {
          // Fallback to default cards if no user-specific cards are found
          setCards(defaultComunicacaoCards);
        }
      } catch (error) {
        console.error('Error loading dashboard cards:', error);
        toast({
          title: 'Erro ao carregar cards',
          description: 'Não foi possível carregar seus cards personalizados.',
          variant: 'destructive',
        });
        setCards(defaultComunicacaoCards);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [userId, departmentId]);

  const saveCards = async (updatedCards: ActionCardItem[]) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .upsert(
          {
            user_id: userId,
            cards_config: JSON.stringify(updatedCards),
            department_id: departmentId || 'comunicacao',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,department_id' }
        );

      if (error) throw error;
      
      setCards(updatedCards);
      return true;
    } catch (error) {
      console.error('Error saving dashboard cards:', error);
      toast({
        title: 'Erro ao salvar cards',
        description: 'Não foi possível salvar suas configurações.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add the methods required by DashboardPage.tsx
  const handleCardEdit = (card: ActionCardItem) => {
    // This function will be called when a card is edited
    return card;
  };

  const handleCardHide = (id: string) => {
    // This function will be called when a card is hidden
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    // This function will be called when cards are reordered
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  return { 
    cards, 
    setCards, 
    isLoading, 
    saveCards, 
    handleCardEdit, 
    handleCardHide, 
    handleCardsReorder 
  };
};
