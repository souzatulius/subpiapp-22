
import React from 'react';
import {
  BarChart2,
  CheckCircle,
  FileText,
  HelpCircle,
  Home,
  List,
  MessageSquare,
  MessageSquareReply,
  PlusCircle,
  Settings,
  Trophy
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
      icon: <Home className="w-10 h-10" />,
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      path: '/dashboard/comunicacao',
      icon: <MessageSquareReply className="w-10 h-10" />,
    },
    {
      id: 'responder',
      label: 'Responder',
      path: '/dashboard/comunicacao/responder',
      icon: <MessageSquare className="w-10 h-10" />,
    },
    {
      id: 'demandas',
      label: 'Demandas',
      path: '/dashboard/comunicacao/demandas',
      icon: <List className="w-10 h-10" />,
    },
    {
      id: 'notas',
      label: 'Notas',
      path: '/dashboard/comunicacao/notas',
      icon: <FileText className="w-10 h-10" />,
    },
    {
      id: 'aprovar',
      label: 'Aprovar',
      path: '/dashboard/comunicacao/aprovar-nota',
      icon: <CheckCircle className="w-10 h-10" />,
    },
    {
      id: 'ranking',
      label: 'Top Zeladoria',
      path: '/dashboard/zeladoria/ranking-subs',
      icon: <Trophy className="w-10 h-10" />,
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      path: '/dashboard/comunicacao/relatorios',
      icon: <BarChart2 className="w-10 h-10" />,
    },
    {
      id: 'esic',
      label: 'e-SIC',
      path: '/dashboard/esic',
      icon: <FileText className="w-10 h-10" />,
      allowedDepartments: ['comunicacao', 'gabinete'],
    },
    {
      id: 'ajuda',
      label: 'Ajuda',
      path: '/dashboard/ajuda',
      icon: <HelpCircle className="w-10 h-10" />,
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      path: '/dashboard/configuracoes',
      icon: <Settings className="w-10 h-10" />,
    },
  ];
};
