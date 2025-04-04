
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { getInitialDashboardCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';

// This function processes cards data to prevent deep type issues
const processCardsData = (data: any): ActionCardItem[] => {
  if (!data) return [];
  
  // Handle string JSON
  const rawCards = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Validate it's an array
  if (!Array.isArray(rawCards)) return [];
  
  // Return the cards
  return rawCards;
};

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);

  useEffect(() => {
    if (isDepartmentLoading) return;

    const fetchCards = async () => {
      if (!user) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      // Normaliza o valor da coordenação para facilitar comparação
      const normalizedDepartment = userDepartment
        ? userDepartment
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        : undefined;

      const defaultCards = getInitialDashboardCards(normalizedDepartment);

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'inicial')
          .single();

        if (error || !data?.cards_config) {
          setCards(defaultCards);
          return;
        }

        const customCards = processCardsData(data.cards_config);
        
        if (customCards.length > 0) {
          setCards(customCards);
        } else {
          setCards(defaultCards);
        }
      } catch (error) {
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user, userDepartment, isDepartmentLoading]);

  const persistCards = (updatedCards: ActionCardItem[]) => {
    if (!user) return;

    setCards(updatedCards);

    supabase
      .from('user_dashboard')
      .upsert({
        user_id: user.id,
        page: 'inicial',
        cards_config: JSON.stringify(updatedCards),
        department_id: userDepartment || 'default'
      })
      .then(({ error }) => {
        if (error) console.error('Erro ao salvar configuração de cards:', error);
      });
  };

  const handleCardEdit = (cardToUpdate: ActionCardItem) => {
    const updatedCards = cards.map(card =>
      card.id === cardToUpdate.id ? cardToUpdate : card
    );
    persistCards(updatedCards);
  };

  const handleCardHide = (id: string) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isHidden: true } : card
    );
    persistCards(updatedCards);
  };

  return {
    cards,
    isLoading: isLoading || isDepartmentLoading,
    handleCardEdit,
    handleCardHide
  };
};
