
import { useState, useEffect } from 'react';
import { ActionCardItem } from './types';
import { defaultActionCards } from './defaultCards';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = (userId?: string) => {
  const [firstName, setFirstName] = useState('');
  const [actionCards, setActionCards] = useState<ActionCardItem[]>(defaultActionCards);
  const [loading, setLoading] = useState(true);

  // Fetch user dashboard data and cards
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user info for first name
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('nome_completo')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;
        
        if (userData?.nome_completo) {
          // Extract first name
          const names = userData.nome_completo.split(' ');
          setFirstName(names[0]);
        }
        
        // Fetch user dashboard settings
        const { data: dashboardData, error: dashboardError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userId);
        
        if (dashboardError) throw dashboardError;
        
        if (dashboardData && dashboardData.length > 0 && dashboardData[0].cards_config) {
          try {
            const customCards = JSON.parse(dashboardData[0].cards_config);
            if (Array.isArray(customCards) && customCards.length > 0) {
              setActionCards(customCards);
            }
          } catch (parseError) {
            console.error('Erro ao processar configuração de cards:', parseError);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    firstName,
    actionCards,
    setActionCards,
    loading
  };
};
