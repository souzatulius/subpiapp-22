
import React from 'react';
import {
  BarChart2,
  FileText,
  MessageSquareReply,
  Trophy,
  LayoutDashboard
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
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-8 h-8" />,
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      path: '/dashboard/comunicacao',
      icon: <MessageSquareReply className="w-8 h-8" />,
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
    {
      id: 'esic',
      label: 'e-SIC',
      path: '/dashboard/esic',
      icon: <FileText className="w-8 h-8" />,
      allowedDepartments: ['comunicacao', 'gabinete'],
    },
  ];
};
