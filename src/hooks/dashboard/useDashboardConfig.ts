
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardConfigResult {
  actionCards: ActionCardItem[];
  config: ActionCardItem[]; // Added config property
  isLoading: boolean; // Added isLoading property
  setActionCards: (cards: ActionCardItem[]) => void;
  viewType: 'grid' | 'list';
  setViewType: (viewType: 'grid' | 'list') => void;
  firstName: string;
  saveConfig: (cards: ActionCardItem[]) => Promise<void>; // Added saveConfig method
}

export const useDashboardConfig = (department?: string, type?: string): DashboardConfigResult => {
  const [actionCards, setActionCards] = useState<ActionCardItem[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [firstName, setFirstName] = useState<string>('Usuário');

  useEffect(() => {
    // Mock loading state
    const loadTimer = setTimeout(() => {
      const defaultCards: ActionCardItem[] = [
        {
          id: 'dashboard-search-card',
          title: 'Busca Rápida',
          iconId: 'Search',
          path: '',
          color: 'bg-white',
          width: '100',
          height: '0.5',
          type: 'smart_search',
          isSearch: true,
          displayMobile: true,
          mobileOrder: 1
        },
        {
          id: uuidv4(),
          title: 'Demandas',
          iconId: 'FileText',
          path: '/dashboard/comunicacao/demandas',
          color: 'deep-blue',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 2
        },
        {
          id: 'origem-demandas-card',
          title: 'Atividades em Andamento',
          subtitle: 'Demandas da semana por área técnica',
          iconId: 'BarChart2',
          path: '',
          color: 'gray-light',
          width: '50',
          height: '2',
          type: 'origin_demand_chart',
          displayMobile: true,
          mobileOrder: 5
        }
      ];

      setActionCards(defaultCards);
      setIsLoadingDashboard(false);
      
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
    }, 500);

    return () => clearTimeout(loadTimer);
  }, [department, type]);

  // Add saveConfig function to match the expected interface
  const saveConfig = async (cards: ActionCardItem[]): Promise<void> => {
    try {
      console.log('Saving cards config:', cards);
      // This is a placeholder implementation
      // In a real application, you would save this to a database or localStorage
      setActionCards(cards);
    } catch (error) {
      console.error('Error saving dashboard config:', error);
    }
  };

  return {
    actionCards,
    config: actionCards, // Map actionCards to config for compatibility
    isLoading: isLoadingDashboard, // Map isLoadingDashboard to isLoading for compatibility
    setActionCards,
    viewType,
    setViewType,
    firstName,
    saveConfig
  };
};
