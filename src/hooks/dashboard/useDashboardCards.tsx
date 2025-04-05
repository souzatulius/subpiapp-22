
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDepartment } from './useDepartment';
import { getDefaultActionCards } from './defaultCards';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);

  useEffect(() => {
    const fetchCards = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // First get default cards based on department
        const defaultCards = getDefaultActionCards();
        
        // Then try to fetch user customizations
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'dashboard')
          .single();
        
        if (error) {
          console.log('No custom dashboard found, using defaults');
          setCards(defaultCards);
        } else if (data && data.cards_config) {
          try {
            const customCards = typeof data.cards_config === 'string' 
              ? JSON.parse(data.cards_config) 
              : data.cards_config;
            
            if (Array.isArray(customCards) && customCards.length > 0) {
              setCards(customCards);
            } else {
              setCards(defaultCards);
            }
          } catch (e) {
            console.error('Error parsing cards config', e);
            setCards(defaultCards);
          }
        } else {
          setCards(defaultCards);
        }
      } catch (error) {
        console.error('Error fetching dashboard cards', error);
        // Fallback to default cards on error
        setCards(getDefaultActionCards());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user, userDepartment]);

  const persistCards = async (updatedCards: ActionCardItem[]) => {
    if (!user) return;
    
    try {
      // Create a JSON string to avoid circular reference issues
      const cardsData = JSON.stringify(updatedCards);
      
      // Update the cards state 
      setCards(JSON.parse(cardsData));

      // Save to database
      await supabase
        .from('user_dashboard')
        .upsert({
          user_id: user.id,
          page: 'dashboard',
          cards_config: cardsData,
          department_id: userDepartment || 'default'
        });
    } catch (error) {
      console.error('Erro ao salvar configuração de cards:', error);
    }
  };

  const handleCardEdit = (card: ActionCardItem) => {
    const updatedCards = cards.map(c => 
      c.id === card.id ? card : c
    );
    persistCards(updatedCards);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    persistCards(updatedCards);
  };

  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    persistCards(updatedCards);
  };

  return {
    cards,
    isLoading,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder
  };
};
