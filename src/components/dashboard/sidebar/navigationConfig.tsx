
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  BarChart2, 
  TrendingUp,
  FileText,
  Sparkles,
  Settings
} from 'lucide-react';

export const navigationConfig = [
  {
    title: 'Principal',
    items: [
      {
        icon: <Home size={20} />,
        label: 'Início',
        path: '/dashboard',
      },
      {
        icon: <MessageCircle size={20} />,
        label: 'Comunicação',
        path: '/dashboard/comunicacao',
      },
      {
        icon: <BarChart2 size={20} />,
        label: 'Relatórios',
        path: '/dashboard/comunicacao/relatorios',
      },
      {
        icon: <TrendingUp size={20} />,
        label: 'Zeladoria',
        path: '/dashboard/zeladoria/ranking-subs',
      }
    ]
  },
  {
    title: 'Admin',
    items: [
      {
        icon: <Settings size={20} />,
        label: 'Configurações',
        path: '/settings',
      }
    ]
  }
];

// Add this function for mobile navigation components
export const getNavigationSections = () => {
  return [
    {
      id: 'home',
      label: 'Início',
      path: '/dashboard',
      icon: <Home size={20} />
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      path: '/dashboard/comunicacao',
      icon: <MessageCircle size={20} />
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      path: '/dashboard/comunicacao/relatorios',
      icon: <BarChart2 size={20} />
    },
    {
      id: 'ranking',
      label: 'Ranking das Subs',
      path: '/dashboard/zeladoria/ranking-subs',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'settings',
      label: 'Configurações',
      path: '/settings',
      icon: <Settings size={20} />
    }
  ];
};

export default navigationConfig;
