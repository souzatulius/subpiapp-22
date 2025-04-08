
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
      iconId: 'search',
      path: '',
      color: 'bg-white',
      width: '100', // Full width
      height: '1', // Half height
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: uuidv4(),
      title: 'Demandas',
      iconId: 'clipboard-list',
      path: '/demandas',
      color: 'bg-blue-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Avisos',
      subtitle: 'Notas da coordenação',
      iconId: 'message-square-reply',
      path: '/dashboard/comunicacao',
      color: 'bg-green-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Aprovações',
      subtitle: 'Notas e documentos',
      iconId: 'file-check',
      path: '/aprovar',
      color: 'bg-red-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Ranking',
      subtitle: 'Produtividade das Subsecretarias',
      iconId: 'bar-chart-2',
      path: '/ranking-subs',
      color: 'bg-purple-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: uuidv4(),
      title: 'Cadastrar Demanda',
      iconId: 'plus-circle',
      path: '/cadastrar-demanda',
      color: 'bg-pink-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: 'Relatórios',
      iconId: 'file-text',
      path: '/relatorios',
      color: 'bg-indigo-500',
      width: '50',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Pendências por Coordenação',
      iconId: 'list-filter',
      path: '/demandas',
      color: 'orange-700',
      width: '50',
      height: '1',
      type: 'data_dynamic',
      dataSourceKey: 'pendencias_por_coordenacao',
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
      iconId: 'search',
      path: '',
      color: 'bg-white',
      width: '100', // Full width
      height: '1', // Half height
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: uuidv4(),
      title: 'Nova Demanda',
      iconId: 'plus-circle',
      path: '/dashboard/comunicacao/nova-demanda',
      color: 'bg-blue-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Demandas em Andamento',
      iconId: 'clipboard-list',
      path: '/dashboard/comunicacao/demandas',
      color: 'bg-green-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Aprovar Notas',
      iconId: 'file-check',
      path: '/dashboard/comunicacao/aprovar',
      color: 'bg-red-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Criar Nota',
      iconId: 'file-text',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'bg-purple-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    }
  ];
};
