
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  BarChart2, 
  Settings, 
  TrendingUp
} from 'lucide-react';

// Navigation configuration for the sidebar
export const navigationConfig = {
  sections: [
    // Seção 1: Início
    {
      id: 'inicio',
      title: 'Início',
      adminOnly: false,
      items: [
        {
          icon: <Home size={20} />,
          label: 'Início',
          path: '/dashboard',
        }
      ]
    },
    // Seção 2: Comunicação
    {
      id: 'comunicacao',
      title: 'Comunicação',
      adminOnly: false,
      items: [
        {
          icon: <MessageCircle size={20} />,
          label: 'Comunicação',
          path: '/dashboard/comunicacao/comunicacao',
        }
      ]
    },
    // Seção 4: Relatórios
    {
      id: 'relatorios',
      title: 'Relatórios',
      adminOnly: false,
      items: [
        {
          icon: <BarChart2 size={20} />,
          label: 'Relatórios',
          path: '/dashboard/comunicacao/relatorios',
        }
      ]
    },
    // Seção 5: Ranking das Subs
    {
      id: 'ranking',
      title: 'Ranking das Subs',
      adminOnly: false,
      items: [
        {
          icon: <TrendingUp size={20} />,
          label: 'Ranking das Subs',
          path: '/dashboard/zeladoria/ranking-subs',
        }
      ]
    },
    // Seção 6: Ajustes
    {
      id: 'ajustes',
      title: 'Ajustes',
      adminOnly: false,
      items: [
        {
          icon: <Settings size={20} />,
          label: 'Ajustes',
          path: '/settings',
        }
      ]
    }
  ]
};
