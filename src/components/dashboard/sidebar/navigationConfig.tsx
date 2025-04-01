
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  BarChart2, 
  Settings, 
  TrendingUp
} from 'lucide-react';

// Navigation configuration for the sidebar
export const getNavigationSections = () => [
  // Seção 1: Início
  {
    id: 'inicio',
    icon: <Home size={20} />,
    label: 'Início',
    path: '/dashboard',
    isSection: false
  },
  // Seção 2: Comunicação
  {
    id: 'comunicacao',
    icon: <MessageCircle size={20} />,
    label: 'Comunicação',
    path: '/dashboard/comunicacao/comunicacao',
    isSection: false
  },
  // Seção 4: Relatórios
  {
    id: 'relatorios',
    icon: <BarChart2 size={20} />,
    label: 'Relatórios',
    path: '/dashboard/comunicacao/relatorios',
    isSection: false
  },
  // Seção 5: Ranking das Subs
  {
    id: 'ranking',
    icon: <TrendingUp size={20} />,
    label: 'Ranking das Subs',
    path: '/dashboard/zeladoria/ranking-subs',
    isSection: false
  },
  // Seção 6: Ajustes - Removida a restrição adminOnly
  {
    id: 'ajustes',
    icon: <Settings size={20} />,
    label: 'Ajustes',
    path: '/settings',
    isSection: false
  }
];
