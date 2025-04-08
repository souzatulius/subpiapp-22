
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { 
  ClipboardList, MessageSquareReply, FileCheck, 
  BarChart2, PlusCircle, Search, Clock, 
  AlertTriangle, CheckCircle, FileText, ListFilter,
  ListTodo
} from 'lucide-react';

// Helper function to get the Icon component from ID
export const getIconComponentFromId = (iconId: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'clipboard-list': ClipboardList,
    'message-square-reply': MessageSquareReply,
    'file-check': FileCheck,
    'bar-chart-2': BarChart2,
    'plus-circle': PlusCircle,
    'search': Search,
    'clock': Clock,
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'file-text': FileText,
    'list-filter': ListFilter,
    'list-todo': ListTodo,
  };
  
  return iconMap[iconId] || ClipboardList;
};

// Generate default cards for the dashboard
export const getDefaultCards = (): ActionCardItem[] => {
  return [
    {
      id: 'pending-tasks',
      title: 'Pendências e Prazos',
      subtitle: 'Visualize demandas e notas pendentes',
      iconId: 'list-todo',
      path: '/dashboard/comunicacao/demandas',
      color: 'blue-dark',
      width: '50',
      height: '2',
      type: 'special',
      isPendingActions: true,
      displayMobile: true,
      mobileOrder: 0,
    },
    {
      id: 'demandas',
      title: 'Demandas',
      subtitle: 'Gerenciar solicitações',
      iconId: 'clipboard-list',
      path: '/dashboard/comunicacao/demandas',
      color: 'blue-vivid',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1,
    },
    {
      id: 'respostas',
      title: 'Responder Demandas',
      subtitle: 'Enviar respostas',
      iconId: 'message-square-reply',
      path: '/dashboard/comunicacao/responder-demanda',
      color: 'green-dark',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2,
    },
    {
      id: 'notas',
      title: 'Notas Oficiais',
      subtitle: 'Gerenciar notas',
      iconId: 'file-check',
      path: '/dashboard/comunicacao/notas',
      color: 'orange-dark',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3,
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      subtitle: 'Visualizar dados',
      iconId: 'bar-chart-2',
      path: '/dashboard/relatorios',
      color: 'deep-blue',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4,
    },
    {
      id: 'quick-demand',
      title: 'Nova Demanda',
      subtitle: 'Criar demanda rápida',
      iconId: 'plus-circle',
      path: '',
      color: 'green-neon',
      width: '25',
      height: '1',
      type: 'special',
      isQuickDemand: true,
      displayMobile: true,
      mobileOrder: 5,
    },
    {
      id: 'search',
      title: 'Busca Avançada',
      subtitle: 'Encontre informações',
      iconId: 'search',
      path: '',
      color: 'gray-light',
      width: '25',
      height: '1',
      type: 'special',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 6,
    },
    {
      id: 'overdue-demands',
      title: 'Demandas Atrasadas',
      subtitle: 'Visualize prazos',
      iconId: 'alert-triangle',
      path: '/dashboard/comunicacao/demandas',
      color: 'orange-700',
      width: '25',
      height: '1',
      type: 'special',
      isOverdueDemands: true,
      displayMobile: true,
      mobileOrder: 7,
    }
  ];
};

// Add the missing function that's referenced in useDefaultDashboardConfig.ts
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return getDefaultCards(); // For now, we'll just reuse the default cards
};
