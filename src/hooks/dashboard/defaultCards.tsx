
// hooks/dashboard/defaultCards.tsx
import { ActionCardItem, CardColor } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import React from 'react';

// Retorna o componente React correspondente ao iconId
export const getIconComponentFromId = (iconId: string): React.ElementType => {
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    'clipboard-list': 'ClipboardList',
    'message-square-reply': 'MessageSquareReply',
    'file-check': 'FileCheck',
    'bar-chart-2': 'BarChart2',
    'plus-circle': 'PlusCircle',
    'search': 'Search',
    'clock': 'Clock',
    'alert-triangle': 'AlertTriangle',
    'check-circle': 'CheckCircle',
    'file-text': 'FileText',
    'list-filter': 'ListFilter'
  };

  const componentName = iconMap[iconId] || 'ClipboardList';
  return LucideIcons[componentName] as React.ElementType || LucideIcons.ClipboardList;
};

// Cards padrão sem JSX nos dados
export const getDefaultCards = (): ActionCardItem[] => [
  {
    id: 'smart-search',
    title: 'O que você deseja fazer?',
    iconId: 'search',
    path: '',
    color: 'gray-light' as CardColor,
    width: '100',
    height: '1',
    isCustom: false,
    isSearch: true,
    type: 'standard'
  },
  {
    id: 'overdue-demands',
    title: 'Demandas em Atraso',
    iconId: 'clock',
    path: '/dashboard/comunicacao/consultar-demandas',
    color: 'orange' as CardColor,
    width: '25',
    height: '2',
    isCustom: false,
    isOverdueDemands: true,
    type: 'standard'
  },
  {
    id: 'pending-actions',
    title: 'Você precisa agir',
    iconId: 'alert-triangle',
    path: '',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    isCustom: false,
    isPendingActions: true,
    type: 'standard'
  },
  {
    id: '1',
    title: 'Nova Demanda',
    iconId: 'clipboard-list',
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue' as CardColor,
    width: '25',
    height: '1',
    type: 'standard'
  },
  {
    id: '2',
    title: 'Criar Nota Oficial',
    iconId: 'file-text',
    path: '/dashboard/comunicacao/criar-nota',
    color: 'blue-dark' as CardColor,
    width: '25',
    height: '1',
    type: 'standard'
  },
  {
    id: '3',
    title: 'Consultar Demandas',
    iconId: 'list-filter',
    path: '/dashboard/comunicacao/consultar-demandas',
    color: 'green' as CardColor,
    width: '25',
    height: '1',
    type: 'standard'
  },
  {
    id: '4',
    title: 'Consultar Notas',
    iconId: 'file-text',
    path: '/dashboard/comunicacao/consultar-notas',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    type: 'standard'
  },
  {
    id: '5',
    title: 'Ranking de Zeladoria',
    iconId: 'bar-chart-2',
    path: '/dashboard/zeladoria/ranking-subs',
    color: 'orange' as CardColor,
    width: '25',
    height: '1',
    type: 'standard'
  },
  {
    id: 'quick-demand',
    title: '',
    iconId: 'plus-circle',
    path: '/dashboard/comunicacao/cadastrar',
    color: 'blue-dark' as CardColor,
    width: '50',
    height: '1',
    isCustom: false,
    isQuickDemand: true,
    type: 'standard'
  },
  {
    id: 'new-card',
    title: 'Novo Card',
    iconId: 'plus-circle',
    path: '',
    color: 'orange-light' as CardColor,
    width: '25',
    height: '1',
    isCustom: false,
    isNewCardButton: true,
    type: 'standard'
  }
];
