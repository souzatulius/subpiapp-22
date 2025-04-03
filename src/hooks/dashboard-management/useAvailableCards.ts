
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableCards = async () => {
      setIsLoading(true);
      try {
        // Try to get cards from a library table if it exists
        const { data, error } = await supabase
          .from('card_library')
          .select('*');

        if (error) {
          console.error('Error fetching card library:', error);
          // Fallback to sample cards if table doesn't exist
          setAvailableCards(getSampleCards());
        } else if (data && data.length > 0) {
          setAvailableCards(data as ActionCardItem[]);
        } else {
          // No cards found, use sample cards
          setAvailableCards(getSampleCards());
        }
      } catch (err) {
        console.error('Failed to fetch available cards:', err);
        setAvailableCards(getSampleCards());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableCards();
  }, []);

  return { availableCards, isLoading };
};

// Sample cards to display when no data is available
const getSampleCards = (): ActionCardItem[] => {
  return [
    {
      id: 'card-1',
      title: 'Cadastrar Demanda',
      iconId: 'file-plus',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue',
      width: '25',
      height: '1',
      type: 'standard'
    },
    {
      id: 'card-2',
      title: 'Demandas em Andamento',
      subtitle: 'Visualize suas demandas ativas',
      iconId: 'activity',
      path: '/dashboard/comunicacao/demandas',
      color: 'green',
      width: '50',
      height: '1',
      type: 'data_dynamic',
      dataSourceKey: 'ongoing_demands'
    },
    {
      id: 'card-3',
      title: 'Relatórios',
      iconId: 'bar-chart',
      path: '/dashboard/comunicacao/relatorios',
      color: 'orange',
      width: '25',
      height: '1',
      type: 'standard'
    },
    {
      id: 'card-4',
      title: 'Criar Nota Oficial',
      iconId: 'file-text',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'blue-dark',
      width: '25',
      height: '1',
      type: 'standard'
    },
    {
      id: 'card-5',
      title: 'Busca Rápida',
      iconId: 'search',
      path: '#',
      color: 'gray-light',
      width: '50',
      height: '1',
      type: 'smart_search',
      isSearch: true
    },
    {
      id: 'card-6',
      title: 'Demandas Pendentes',
      iconId: 'alert-triangle',
      path: '/dashboard/comunicacao/responder',
      color: 'orange-600',
      width: '25',
      height: '1',
      type: 'data_dynamic',
      dataSourceKey: 'pending_demands',
      hasBadge: true,
      badgeValue: '3'
    }
  ];
};
