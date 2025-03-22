
import { ActionCardItem } from './types';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  PlusCircleIcon, 
  Search,
  Clock,
  AlertTriangle
} from 'lucide-react';
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
    case 'clock':
      return <Clock className="h-12 w-12" />;
    case 'alert-triangle':
      return <AlertTriangle className="h-12 w-12" />;
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
  if (componentStr.includes('Clock')) return 'clock';
  if (componentStr.includes('AlertTriangle')) return 'alert-triangle';
  
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
  
  // After search - PendingActions card 
  {
    id: 'pending-actions',
    title: 'Você precisa agir',
    icon: <AlertTriangle className="h-12 w-12" />,
    path: '',
    color: 'orange-light',
    width: '25',
    height: '1',
    isCustom: false,
    isPendingActions: true,
  },
  
  // OverdueDemands card
  {
    id: 'overdue-demands',
    title: 'Demandas em Atraso',
    icon: <Clock className="h-12 w-12" />,
    path: '',
    color: 'orange',
    width: '25',
    height: '2',
    isCustom: false,
    isOverdueDemands: true,
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
    title: '', // Removed title as requested
    icon: <PlusCircleIcon className="h-12 w-12" />,
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue-dark',
    width: '50', // Set to 50% width
    height: '1',
    isCustom: false,
    isQuickDemand: true,
  },
  {
    id: 'new-card',
    title: 'Novo Card',
    icon: <PlusCircleIcon className="h-12 w-12" />,
    path: '',
    color: 'orange-light',
    width: '25',
    height: '1',
    isCustom: false,
    isNewCardButton: true
  }
];
