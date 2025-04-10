
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';

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
          title: 'Área da Comunicação',
          iconId: 'Bell',
          path: '/dashboard/comunicacao',
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
        },
        {
          id: 'acoes-pendentes-card',
          title: 'Ações Pendentes',
          iconId: 'AlertTriangle',
          path: '',
          color: 'bg-white',
          width: '25',
          height: '2',
          type: 'pending_tasks',
          isPendingTasks: true,
          displayMobile: true,
          mobileOrder: 3
        },
        {
          id: 'comunicados-card',
          title: 'Comunicados',
          iconId: 'Megaphone',
          path: '/dashboard/settings/comunicados',
          color: 'bg-white',
          width: '25',
          height: '2',
          type: 'communications',
          isComunicados: true,
          displayMobile: true,
          mobileOrder: 4
        },
        {
          id: uuidv4(),
          title: 'Aprovar Notas de Imprensa',
          iconId: 'FileText',
          path: 'comunicacao/criar-nota',
          color: 'orange-light',
          width: '25',
          height: '2',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 6
        },
        {
          id: uuidv4(),
          title: 'Notícias do Site',
          iconId: 'Newspaper',
          path: 'comunicacao/releases',
          color: 'blue-light',
          width: '25',
          height: '2',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 7
        },
        {
          id: 'perfil-usuario-card',
          title: 'Perfil do Usuário',
          iconId: 'User',
          path: '',
          color: 'deep-blue',
          width: '25',
          height: '2',
          type: 'user_profile',
          isUserProfile: true,
          displayMobile: true,
          mobileOrder: 8
        },
        {
          id: 'ajustes-notificacao-card',
          title: 'Ajustes de Notificação',
          iconId: 'Bell',
          path: '',
          color: 'blue-dark',
          width: '25',
          height: '2',
          type: 'notification_settings',
          isNotificationSettings: true,
          displayMobile: true,
          mobileOrder: 9
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
