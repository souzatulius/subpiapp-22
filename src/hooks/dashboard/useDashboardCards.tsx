
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { supabase } from '@/integrations/supabase/client';

// Initial default cards function - simplified to avoid deep type instantiation
const getDefaultCards = (department?: string): ActionCardItem[] => {
  return [
    {
      id: 'default-1',
      title: 'Dashboard',
      iconId: 'layout-dashboard',
      path: '/dashboard',
      color: 'blue-700',
      type: 'standard'
    },
    {
      id: 'default-2',
      title: 'Comunicação',
      iconId: 'message-square',
      path: '/dashboard/comunicacao',
      color: 'orange-500',
      type: 'standard'
    }
  ];
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
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || undefined;

      const defaultCards = getDefaultCards(normalizedDepartment);

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

        const customCards = typeof data.cards_config === 'string'
          ? JSON.parse(data.cards_config)
          : data.cards_config;

        if (Array.isArray(customCards) && customCards.length > 0) {
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
