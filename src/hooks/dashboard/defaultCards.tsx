
import { ActionCardItem } from './types';
import { ClipboardList, MessageSquareReply, FileCheck, BarChart2, PlusCircleIcon, Search } from 'lucide-react';
import React from 'react';

// Map icon string IDs to components
export const getIconComponentFromId = (iconId: string) => {
  switch (iconId) {
    case 'clipboard-list':
      return <ClipboardList className="h-12 w-12" />;
    case 'message-square-reply':
      return <MessageSquareReply className="h-12 w-12" />;
    case 'file-check':
      return <FileCheck className="h-12 w-12" />;
    case 'bar-chart-2':
      return <BarChart2 className="h-12 w-12" />;
    case 'plus-circle':
      return <PlusCircleIcon className="h-12 w-12" />;
    case 'search':
      return <Search className="h-12 w-12" />;
    default:
      return <ClipboardList className="h-12 w-12" />;
  }
};

// Get icon ID from component type
export const getIconIdFromComponent = (component: React.ReactNode): string => {
  // This is a simplified approach - in a real implementation, 
  // you might need a more sophisticated method to identify components
  const componentStr = component?.toString() || '';
  
  if (componentStr.includes('ClipboardList')) return 'clipboard-list';
  if (componentStr.includes('MessageSquareReply')) return 'message-square-reply';
  if (componentStr.includes('FileCheck')) return 'file-check';
  if (componentStr.includes('BarChart2')) return 'bar-chart-2';
  if (componentStr.includes('PlusCircle')) return 'plus-circle';
  if (componentStr.includes('Search')) return 'search';
  
  return 'clipboard-list'; // Default
};

// Default cards configuration
export const getDefaultCards = (): ActionCardItem[] => [
  // First row - Search card
  {
    id: 'smart-search',
    title: 'O que você deseja fazer?',
    icon: <Search className="h-12 w-12" />,
    path: '',
    color: 'gray-light',
    width: '100',
    height: '1',
    isCustom: false,
    isSearch: true,
  },
  
  // Second Row - Standard operational cards
  {
    id: '1',
    title: 'Nova Demanda',
    icon: <ClipboardList className="h-12 w-12" />,
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue',
    width: '25',
    height: '1'
  },
  {
    id: '2',
    title: 'Aprovar Nota',
    icon: <FileCheck className="h-12 w-12" />,
    path: '/dashboard/comunicacao/aprovar-nota',
    color: 'green',
    width: '25',
    height: '1'
  },
  {
    id: '3',
    title: 'Responder Demandas',
    icon: <MessageSquareReply className="h-12 w-12" />,
    path: '/dashboard/comunicacao/responder',
    color: 'orange',
    width: '25',
    height: '1'
  },
  {
    id: '4',
    title: 'Números da Comunicação',
    icon: <BarChart2 className="h-12 w-12" />,
    path: '/dashboard/comunicacao/relatorios',
    color: 'gray-light',
    width: '25',
    height: '1'
  },
  
  // Last row - Quick demand and New card
  {
    id: 'quick-demand',
    title: 'Iniciar nova demanda',
    icon: <PlusCircleIcon className="h-12 w-12" />,
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue-dark',
    width: '25',
    height: '1',
    isCustom: false,
    isQuickDemand: true,
  },
  {
    id: 'new-card',
    title: '+ Novo Card',
    icon: <PlusCircleIcon className="h-12 w-12" />,
    path: '',
    color: 'orange-light',
    width: '25',
    height: '1',
    isNewCardButton: true
  }
];
