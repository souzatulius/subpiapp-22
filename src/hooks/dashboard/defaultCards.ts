import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';
import React from 'react';

// Function to get a Lucide icon component by its ID string
export const getIconComponentFromId = (iconId: string) => {
  const IconMap: Record<string, () => Promise<any>> = {
    'clipboard-list': () => import('lucide-react').then(mod => mod.ClipboardList),
    'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
    'file-check': () => import('lucide-react').then(mod => mod.FileCheck),
    'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
    'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
    'search': () => import('lucide-react').then(mod => mod.Search),
    'file-text': () => import('lucide-react').then(mod => mod.FileText),
    'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
    'clock': () => import('lucide-react').then(mod => mod.Clock),
    'alert-triangle': () => import('lucide-react').then(mod => mod.AlertTriangle),
    'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
    'bell': () => import('lucide-react').then(mod => mod.Bell),
    'trending-up': () => import('lucide-react').then(mod => mod.TrendingUp),
    'pencil': () => import('lucide-react').then(mod => mod.Pencil),
    'pie-chart': () => import('lucide-react').then(mod => mod.PieChart),
    'message-square': () => import('lucide-react').then(mod => mod.MessageSquare),
    'megaphone': () => import('lucide-react').then(mod => mod.Megaphone),
    'user': () => import('lucide-react').then(mod => mod.User),
    'newspaper': () => import('lucide-react').then(mod => mod.Newspaper),
    'file-search': () => import('lucide-react').then(mod => mod.FileSearch),
    'list': () => import('lucide-react').then(mod => mod.List),
  };
  
  const LoadedIcon = React.lazy(() => 
    IconMap[iconId] ? IconMap[iconId]() : import('lucide-react').then(mod => ({ default: mod.ClipboardList }))
  );
  
  return function IconComponent(props: any) {
    return React.createElement(
      React.Suspense,
      { 
        fallback: React.createElement('div', { 
          className: "w-6 h-6 bg-gray-200 animate-pulse rounded-full" 
        })
      },
      React.createElement(LoadedIcon, props)
    );
  };
};

/**
 * Get default dashboard cards for the main dashboard
 */
export const getDefaultCards = (): ActionCardItem[] => {
  return [
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
      id: 'ranking-zeladoria-card',
      title: 'Ranking Zeladoria',
      iconId: 'TrendingUp',
      path: '/dashboard/zeladoria/ranking',
      color: 'deep-blue',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'relatorio-comunicacao-card',
      title: 'Relatório Comunicação',
      iconId: 'BarChart2',
      path: '/dashboard/comunicacao/relatorios',
      color: 'blue-light',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'responder-demanda-card',
      title: 'Responder Demanda',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '0.5',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'aprovar-notas-card',
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange-light',
      width: '25',
      height: '0.5',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'responder-demanda-dinamico-card',
      title: 'Responder Demanda',
      subtitle: 'Acompanhe demandas pendentes',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'in_progress_demands',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'perfil-usuario-card',
      title: 'Perfil do Usuário',
      iconId: 'User',
      path: '',
      color: 'deep-blue',
      width: '25',
      height: '1',
      type: 'user_profile',
      isUserProfile: true,
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'aprovar-nota-dinamico-card',
      title: 'Aprovar Nota',
      subtitle: 'Notas pendentes de aprovação',
      iconId: 'FileCheck',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange-light',
      width: '25',
      height: '2',
      type: 'recent_notes',
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
      height: '1',
      type: 'notification_settings',
      isNotificationSettings: true,
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'noticias-site-card',
      title: 'Notícias do Site',
      iconId: 'Newspaper',
      path: '/dashboard/comunicacao/releases',
      color: 'blue-light',
      width: '25',
      height: '0.5',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10
    },
    {
      id: 'esic-card',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'deep-blue',
      width: '25',
      height: '0.5',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 11
    },
    {
      id: 'acoes-pendentes-card',
      title: 'Ações Pendentes',
      iconId: 'AlertTriangle',
      path: '/dashboard/comunicacao/responder',
      color: 'bg-white',
      width: '25',
      height: '2',
      type: 'pending_tasks',
      isPendingTasks: true,
      displayMobile: true,
      mobileOrder: 12
    }
  ];
};

/**
 * Get default dashboard cards for the communication dashboard
 */
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'comunicacao-search-card',
      title: 'Busca Comunicação',
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
      id: 'cadastrar-demanda-card',
      title: 'Cadastrar Demanda',
      iconId: 'PlusCircle',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'responder-demanda-card',
      title: 'Responder Demanda',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'criar-nota-card',
      title: 'Criar Nota Oficial',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'aprovar-notas-card',
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'blue-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
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
      mobileOrder: 6
    },
    {
      id: 'esic-card',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'releases-card',
      title: 'Releases e Notícias',
      iconId: 'Newspaper',
      path: '/dashboard/comunicacao/releases',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'ver-notas-card',
      title: 'Ver Notas de Imprensa',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/notas',
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'consultar-demandas-card',
      title: 'Consultar Demandas',
      iconId: 'List',
      path: '/dashboard/comunicacao/demandas',
      color: 'green-teal',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10
    },
    {
      id: 'press-request-card',
      title: 'Nova Solicitação da Imprensa',
      iconId: 'Newspaper',
      path: '',
      color: 'bg-white',
      width: '25',
      height: '2',
      type: 'press_request_card',
      displayMobile: true,
      mobileOrder: 11
    }
  ];
};

// Helper function to get background color from card color
export const getBgColor = (color: string): string => {
  if (color.startsWith('bg-')) return color;
  
  // Color mapping for custom colors
  switch (color) {
    case 'deep-blue': return 'bg-blue-600';
    case 'blue-light': return 'bg-blue-400';
    case 'blue-dark': return 'bg-blue-800';
    case 'blue-vivid': return 'bg-blue-500';
    case 'gray-light': return 'bg-gray-200';
    case 'gray-medium': return 'bg-gray-400';
    case 'orange-light': return 'bg-orange-300';
    case 'orange-dark': return 'bg-orange-700';
    case 'green-teal': return 'bg-teal-500';
    case 'green-neon': return 'bg-green-400';
    case 'green-dark': return 'bg-green-700';
    default: return 'bg-gray-200';
  }
};
