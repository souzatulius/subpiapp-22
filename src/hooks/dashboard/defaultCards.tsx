
// hooks/dashboard/defaultCards.tsx
import { ActionCardItem, CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import React from 'react';

// Retorna o componente React correspondente ao iconId
export const getIconComponentFromId = (iconId: string): React.ElementType => {
  // First check if the iconId is directly a key in LucideIcons
  if (iconId in LucideIcons) {
    return LucideIcons[iconId as keyof typeof LucideIcons] as React.ElementType;
  }
  
  // If not, use the mapping for legacy icon IDs
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
    'list-filter': 'ListFilter',
    'Search': 'Search',
    'FileText': 'FileText',
    'Plus': 'Plus',
    'FileEdit': 'FileEdit'
  };

  const componentName = iconMap[iconId] || 'ClipboardList';
  return LucideIcons[componentName] as React.ElementType || LucideIcons.ClipboardList;
};

// Cards padrão sem JSX nos dados - agora usando a configuração CPDU como base
export const getDefaultCards = (coordenacaoId?: string): ActionCardItem[] => {
  // CPDU focused cards that will be used as the standard default
  const cpduBaseCards: ActionCardItem[] = [
    {
      id: 'search',
      title: 'Pesquisar',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue-dark' as CardColor,
      width: '1' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'notas',
      title: 'Consultar Notas',
      iconId: 'FileText',
      path: '/notas',
      color: 'green' as CardColor,
      width: '1' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 2
    }
  ];

  // Comunicação department specific cards
  if (coordenacaoId === 'comunicacao') {
    return [
      {
        id: 'nova-solicitacao',
        title: 'Nova Solicitação',
        iconId: 'Plus',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'orange-600' as CardColor,
        width: '1' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: 'criar-nota',
        title: 'Criar Nota Oficial',
        iconId: 'FileEdit',
        path: '/dashboard/notas/criar',
        color: 'lime' as CardColor,
        width: '1' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 2
      },
      ...cpduBaseCards
    ];
  }

  return cpduBaseCards;
};
