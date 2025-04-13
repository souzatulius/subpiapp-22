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
    'bar-chart': () => import('lucide-react').then(mod => mod.BarChart),
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
      id: 'busca-rapida',
      title: 'Busca Rápida',
      iconId: 'Search',
      path: '/dashboard/busca',
      color: 'bg-white',
      width: '100',
      height: '0.5',
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'ranking-zeladoria',
      title: 'Ranking da Zeladoria',
      iconId: 'BarChart',
      path: '/dashboard/ranking-subs',
      color: 'bg-orange-500',
      width: '25',  
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'relatorios-comunicacao',
      title: 'Relatórios da Comunicação',
      iconId: 'PieChart',
      path: '/dashboard/relatorios',
      color: 'bg-orange-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'ajustes-notificacao',
      title: 'Ajustes de Notificação',
      iconId: 'Bell',
      path: '/dashboard/settings/notifications',
      color: 'bg-blue-500',
      width: '25',
      height: '1',
      type: 'notification_settings',
      isNotificationSettings: true,
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'responder-demandas',
      title: 'Últimas Demandas',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'bg-blue-500',
      width: '25',
      height: '3',
      type: 'in_progress_demands',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'aprovar-notas',
      title: 'Últimas Notas',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'bg-orange-500',
      width: '25',
      height: '3',
      type: 'recent_notes',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'noticias-site',
      title: 'Notícias do Site',
      iconId: 'Newspaper',
      path: '/dashboard/comunicacao/releases',
      color: 'bg-gray-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'esic-processos',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'bg-gray-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'perfil-usuario',
      title: 'Perfil do Usuário',
      iconId: 'User',
      path: '/dashboard/perfil',
      color: 'bg-blue-500',
      width: '25',
      height: '1',
      type: 'user_profile',
      isUserProfile: true,
      displayMobile: true,
      mobileOrder: 10
    }
  ];
};

/**
 * Get default dashboard cards for the communication dashboard
 */
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'cadastrar-demanda',
      title: 'Cadastrar Demanda',
      iconId: 'PlusCircle',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-light',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'ver-notas',
      title: 'Ver Notas de Imprensa',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/notas',
      color: 'blue-dark',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'consultar-demandas',
      title: 'Consultar Demandas',
      iconId: 'List',
      path: '/dashboard/comunicacao/demandas',
      color: 'green-teal',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'esic-processos',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'deep-blue',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'responder-demanda',
      title: 'Responder Demanda',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'orange-light',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'aprovar-notas',
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'orange-dark',
      width: '25',
      height: '4',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'criar-nota',
      title: 'Criar Nota Oficial',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'esic-processos-secundario',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'nova-solicitacao',
      title: 'Nova Solicitação da Imprensa',
      iconId: 'Newspaper',
      path: '/dashboard/comunicacao/solicitacao',
      color: 'gray-light',
      width: '50',
      height: '4',
      type: 'press_request_card',
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'novo-card-11',
      title: 'Novo Card 11',
      iconId: 'AlertTriangle',
      path: '/dashboard/comunicacao/novo11',
      color: 'orange-700',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10
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
