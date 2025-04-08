
import React from 'react';
import {
  BarChart2,
  FileText,
  MessageSquare,
  Trophy,
  Home
} from 'lucide-react';

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedDepartments?: string[];
};

export const getNavigationSections = (): NavigationItem[] => {
  return [
    {
      id: 'dashboard',
      label: 'Início',
      path: '/dashboard',
      icon: <Home className="w-8 h-8" />,
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      path: '/dashboard/comunicacao',
      icon: <MessageSquare className="w-8 h-8" />,
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      path: '/dashboard/comunicacao/relatorios',
      icon: <BarChart2 className="w-8 h-8" />,
    },
    {
      id: 'ranking',
      label: 'Zeladoria',
      path: '/dashboard/zeladoria/ranking-subs',
      icon: <Trophy className="w-8 h-8" />,
    },
  ];
};
