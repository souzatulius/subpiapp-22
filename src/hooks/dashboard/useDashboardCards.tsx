
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { getDefaultCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';

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
        // Start with default cards based on department
        const defaultCards = getDefaultCards(userDepartment || undefined);
        
        // Try to fetch user customizations
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
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
        setCards(getDefaultCards(userDepartment || undefined));
      } finally {
        setIsLoading(false);
      }
    };

    // Only start fetching if department loading is complete
    if (!isDepartmentLoading) {
      fetchCards();
    }
  }, [user, userDepartment, isDepartmentLoading]);

  const handleCardEdit = (cardToUpdate: ActionCardItem) => {
    if (!user) return;
    
    const updatedCards = cards.map(card => 
      card.id === cardToUpdate.id ? cardToUpdate : card
    );
    
    setCards(updatedCards);
    
    supabase
      .from('user_dashboard')
      .upsert({
        user_id: user.id,
        cards_config: JSON.stringify(updatedCards),
        department_id: userDepartment || 'default'
      })
      .then(({ error }) => {
        if (error) console.error('Error saving card edit', error);
      });
  };

  const handleCardHide = (id: string) => {
    if (!user) return;
    
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    supabase
      .from('user_dashboard')
      .upsert({
        user_id: user.id,
        cards_config: JSON.stringify(updatedCards),
        department_id: userDepartment || 'default'
      })
      .then(({ error }) => {
        if (error) console.error('Error saving card hide preference', error);
      });
  };

  return {
    cards,
    isLoading: isLoading || isDepartmentLoading,
    handleCardEdit,
    handleCardHide
  };
};
