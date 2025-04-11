
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardConfigResult {
  actionCards: ActionCardItem[];
  setActionCards: (cards: ActionCardItem[]) => void;
  isLoadingDashboard: boolean;
  viewType: 'grid' | 'list';
  setViewType: (viewType: 'grid' | 'list') => void;
  firstName: string;
}

export const useDashboardConfig = (): DashboardConfigResult => {
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [firstName, setFirstName] = useState<string>('Usuário');

  useEffect(() => {
    const fetchDashboardConfig = async () => {
      try {
        // Try to fetch department dashboard config from Supabase
        const { data, error } = await supabase
          .from('department_dashboard')
          .select('cards_config')
          .eq('department', 'main')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching department dashboard config:', error);
        }

        if (data && data.cards_config) {
          try {
            const parsedConfig = JSON.parse(data.cards_config);
            setActionCards(parsedConfig);
            setIsLoadingDashboard(false);
          } catch (err) {
            console.error('Error parsing dashboard config:', err);
            setIsLoadingDashboard(false);
          }
        } else {
          setIsLoadingDashboard(false);
        }
      } catch (error) {
        console.error('Error in fetchDashboardConfig:', error);
        setIsLoadingDashboard(false);
      }
      
      // Try to get user's first name from localStorage or any other source
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const { name } = JSON.parse(userInfo);
          if (name) {
            const parts = name.split(' ');
            setFirstName(parts[0] || 'Usuário');
          }
        }
      } catch (error) {
        console.error('Error getting user first name:', error);
      }
    };

    fetchDashboardConfig();
  }, []);

  return {
    actionCards,
    setActionCards,
    isLoadingDashboard,
    viewType,
    setViewType,
    firstName
  };
};
