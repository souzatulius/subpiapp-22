
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { 
  ClipboardList, 
  MessageSquareReply, 
  FileCheck, 
  BarChart2, 
  PlusCircle, 
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  ListFilter
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
      return <PlusCircle className="h-12 w-12" />;
    case 'search':
      return <Search className="h-12 w-12" />;
    case 'clock':
      return <Clock className="h-12 w-12" />;
    case 'alert-triangle':
      return <AlertTriangle className="h-12 w-12" />;
    case 'check-circle':
      return <CheckCircle className="h-12 w-12" />;
    case 'file-text':
      return <FileText className="h-12 w-12" />;
    case 'list-filter':
      return <ListFilter className="h-12 w-12" />;
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
  if (componentStr.includes('CheckCircle')) return 'check-circle';
  if (componentStr.includes('FileText')) return 'file-text';
  if (componentStr.includes('ListFilter')) return 'list-filter';
  
  return 'clipboard-list'; // Default
};

// Default cards configuration
export const getDefaultCards = (): ActionCardItem[] => [
  // First row - Search card
  {
    id: 'smart-search',
    title: 'O que você deseja fazer?',
    icon: <Search className="h-12 w-12" />,
    iconId: 'search',
    path: '',
    color: 'gray-light' as CardColor,
    width: '100',
    height: '1',
    isCustom: false,
    isSearch: true,
    type: 'standard',
  },
  
  // Overdue Demands card as a standard, mandatory card
  {
    id: 'overdue-demands',
    title: 'Demandas em Atraso',
    icon: <Clock className="h-12 w-12" />,
    iconId: 'clock',
    path: '/dashboard/comunicacao/consultar-demandas',
    color: 'orange' as CardColor,
    width: '25',
    height: '2',
    isCustom: false,
    isOverdueDemands: true,
    type: 'standard',
  },
  
  // PendingActions card - Making it standard in the dashboard
  {
    id: 'pending-actions',
    title: 'Você precisa agir',
    icon: <AlertTriangle className="h-12 w-12" />,
    iconId: 'alert-triangle',
    path: '',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    isCustom: false,
    isPendingActions: true,
    type: 'standard',
  },
  
  // Standard operational cards - Configuring the requested cards
  {
    id: '1',
    title: 'Nova Demanda',
    icon: <ClipboardList className="h-12 w-12" />,
    iconId: 'clipboard-list',
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue' as CardColor,
    width: '25',
    height: '1',
    type: 'standard',
  },
  {
    id: '2',
    title: 'Criar Nota Oficial',
    icon: <FileText className="h-12 w-12" />,
    iconId: 'file-text',
    path: '/dashboard/comunicacao/criar-nota',
    color: 'blue-dark' as CardColor,
    width: '25',
    height: '1',
    type: 'standard',
  },
  {
    id: '3',
    title: 'Consultar Demandas',
    icon: <ListFilter className="h-12 w-12" />,
    iconId: 'list-filter',
    path: '/dashboard/comunicacao/consultar-demandas',
    color: 'green' as CardColor,
    width: '25',
    height: '1',
    type: 'standard',
  },
  {
    id: '4',
    title: 'Consultar Notas',
    icon: <FileText className="h-12 w-12" />,
    iconId: 'file-text',
    path: '/dashboard/comunicacao/consultar-notas',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    type: 'standard',
  },
  {
    id: '5',
    title: 'Ranking de Zeladoria',
    icon: <BarChart2 className="h-12 w-12" />,
    iconId: 'bar-chart-2',
    path: '/dashboard/zeladoria/ranking-subs',
    color: 'orange' as CardColor,
    width: '25',
    height: '1',
    type: 'standard',
  },
  
  // Last row - Quick demand and New card
  {
    id: 'quick-demand',
    title: '',
    icon: <PlusCircle className="h-12 w-12" />,
    iconId: 'plus-circle',
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue-dark' as CardColor,
    width: '50',
    height: '1',
    isCustom: false,
    isQuickDemand: true,
    type: 'standard',
  },
  {
    id: 'new-card',
    title: 'Novo Card',
    icon: <PlusCircle className="h-12 w-12" />,
    iconId: 'plus-circle',
    path: '',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    isCustom: false,
    isNewCardButton: true,
    type: 'standard',
  }
];
