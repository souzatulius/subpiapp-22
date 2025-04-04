
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDepartment } from './useDepartment';
import { getInitialDashboardCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { userDepartment, isLoading: isDepartmentLoading } = useDepartment(user);

  // Carregar cards quando o usuário ou departamento mudar
  useEffect(() => {
    // Não fazer nada se ainda estiver carregando o departamento
    if (isDepartmentLoading) return;

    const fetchCards = async () => {
      setIsLoading(true);
      console.log('Fetching dashboard cards...');
      
      if (!user) {
        console.log('No user found, setting empty cards');
        setCards([]);
        setIsLoading(false);
        return;
      }

      // Normaliza o valor da coordenação para facilitar comparação
      const normalizedDepartment = userDepartment
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || 'default';
        
      console.log('User department:', normalizedDepartment);

      // Obter cards padrão para o departamento
      const defaultCards = getInitialDashboardCards(normalizedDepartment);

      try {
        // Buscar configuração personalizada do usuário
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .eq('page', 'inicial')
          .maybeSingle();

        if (error) {
          console.log('Error fetching user dashboard:', error);
          console.log('Using default cards');
          setCards(defaultCards);
          setIsLoading(false);
          return;
        }

        if (data?.cards_config) {
          const customCards = typeof data.cards_config === 'string'
            ? JSON.parse(data.cards_config)
            : data.cards_config;

          if (Array.isArray(customCards) && customCards.length > 0) {
            console.log('Using custom dashboard');
            setCards(customCards);
          } else {
            console.log('Custom cards invalid, using defaults');
            setCards(defaultCards);
          }
        } else {
          console.log('No custom dashboard found, using defaults');
          setCards(defaultCards);
        }
      } catch (error) {
        console.error('Error processing dashboard cards:', error);
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [user, userDepartment, isDepartmentLoading]);

  // Função para persistir cards no banco de dados
  const persistCards = (updatedCards: ActionCardItem[]) => {
    if (!user) return;

    console.log('Persisting cards to database');
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

  // Manipulador para editar card
  const handleCardEdit = (cardToUpdate: ActionCardItem) => {
    console.log('Editing card:', cardToUpdate);
    const updatedCards = cards.map(card =>
      card.id === cardToUpdate.id ? cardToUpdate : card
    );
    persistCards(updatedCards);
  };

  // Manipulador para ocultar card
  const handleCardHide = (id: string) => {
    console.log('Hiding card:', id);
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
