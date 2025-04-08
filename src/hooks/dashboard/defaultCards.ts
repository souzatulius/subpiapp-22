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
    // Add more icons as needed
  };
  
  // Create a lazy-loaded component without using JSX directly
  const LoadedIcon = React.lazy(() => 
    IconMap[iconId] ? IconMap[iconId]() : import('lucide-react').then(mod => ({ default: mod.ClipboardList }))
  );
  
  // Return a function that creates the component
  return function IconComponent(props: any) {
    // This function will be used in a React component where JSX is available
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

// Get default cards
export const getDefaultCards = (): ActionCardItem[] => {
  return [
    // Add the search card as the first item
    {
      id: 'dashboard-search-card',
      title: 'Busca Rápida',
      iconId: 'Search',
      path: '',
      color: 'bg-white',
      width: '100', // Full width
      height: '0.5', // Half height
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
      width: '25', // 1 column on desktop
      height: '1', // 1 row
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Origem das Demandas',
      iconId: 'PieChart',
      path: '/dashboard/comunicacao/relatorios',
      color: 'orange-light',
      width: '50', // 2 columns on desktop
      height: '2',  // 2 rows on desktop
      type: 'standard',
      chartId: 'origemDemandas',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Avisos',
      subtitle: 'Notas da coordenação',
      iconId: 'Bell',
      path: '/dashboard/comunicacao',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Responder Demandas',
      subtitle: 'Pendências',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Ranking',
      subtitle: 'Produtividade das Subsecretarias',
      iconId: 'TrendingUp',
      path: '/dashboard/zeladoria/ranking-subs',
      color: 'bg-orange-500',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: uuidv4(),
      title: 'Nova Solicitação',
      iconId: 'Pencil',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: 'Relatórios da Comunicação',
      subtitle: 'Estatísticas e análises',
      iconId: 'PieChart',
      path: '/dashboard/comunicacao/relatorios',
      color: 'orange-light',
      width: '50', // 2 columns on desktop
      height: '1',  // 1 row on desktop
      type: 'standard',
      chartId: 'origemDemandas',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Ações Pendentes',
      iconId: 'AlertTriangle',
      path: '/dashboard/comunicacao/responder',
      color: 'bg-orange-500',
      width: '25', // 1 column on desktop
      height: '2',  // 2 rows on desktop
      type: 'in_progress_demands',
      isPendingActions: true,
      displayMobile: true,
      mobileOrder: 8
    }
  ];
};

// Get communication action cards 
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    // Add the search card as the first item
    {
      id: 'dashboard-search-card',
      title: 'Busca Rápida',
      iconId: 'Search',
      path: '',
      color: 'bg-white',
      width: '100', // Full width
      height: '0.5', // Half height
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: uuidv4(),
      title: 'Nova Demanda',
      iconId: 'Pencil', // Updated to match the new icon scheme
      path: '/dashboard/comunicacao/nova-demanda',
      color: 'gray-medium', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Demandas em Andamento',
      iconId: 'FileText', // Updated to match the new icon scheme
      path: '/dashboard/comunicacao/demandas',
      color: 'deep-blue', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar',
      color: 'bg-orange-500', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Criar Nota',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange-light', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    }
  ];
};
