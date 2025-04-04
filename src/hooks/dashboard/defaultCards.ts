
// hooks/dashboard/defaultCards.tsx
import { ActionCardItem, CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
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
    'list-filter': 'ListFilter',
    'communication': 'MessageSquare',
    'list-bullet': 'List',
    'chat-bubble-left-right': 'MessageCircle',
    'document-plus': 'FileText',
    'document-text': 'FileText',
    'trophy': 'Trophy'
  };

  const componentName = iconMap[iconId] || 'ClipboardList';
  return LucideIcons[componentName] as React.ElementType || LucideIcons.ClipboardList;
};

// Action cards para a biblioteca
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'comunicacao',
      title: "Comunicação",
      path: "/dashboard/comunicacao",
      iconId: "communication",
      color: 'blue' as CardColor,
      width: '25' as CardWidth, // Alterado de '50' para '25' (1 coluna)
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'nova-solicitacao',
      title: "Nova Solicitação",
      path: "/dashboard/comunicacao/cadastrar",
      iconId: "plus-circle",
      color: 'blue-light' as CardColor,
      width: '25' as CardWidth, // 1 coluna (widthDesktop: 1)
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'consultar-demandas',
      title: "Consultar Demandas",
      path: "/dashboard/comunicacao/demandas",
      iconId: "list-bullet",
      color: 'green' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'responder-demandas',
      title: "Responder Demandas",
      path: "/dashboard/comunicacao/responder",
      iconId: "chat-bubble-left-right",
      color: 'orange' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      hasBadge: true,
      badgeValue: "0",
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'criar-nota',
      title: "Criar Nota",
      path: "/dashboard/comunicacao/criar-nota",
      iconId: "document-plus",
      color: 'lime' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      hasBadge: true,
      badgeValue: "0",
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'consultar-notas',
      title: "Consultar Notas",
      path: "/dashboard/comunicacao/notas",
      iconId: "document-text",
      color: 'blue-dark' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'aprovar-notas',
      title: "Aprovar Notas",
      path: "/dashboard/comunicacao/aprovar-nota",
      iconId: "check-circle",
      color: 'purple-light' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      hasBadge: true,
      badgeValue: "0",
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'ranking-zeladoria',
      title: "Ranking da Zeladoria",
      path: "/dashboard/zeladoria/ranking-subs",
      iconId: "trophy",
      color: 'orange-600' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 8
    }
  ];
};

// Cards padrão sem JSX nos dados
export const getDefaultCards = (coordenacaoId?: string): ActionCardItem[] => {
  const baseCards: ActionCardItem[] = [
    {
      id: 'smart-search',
      title: 'O que você deseja fazer?',
      iconId: 'search',
      path: '',
      color: 'gray-light' as CardColor,
      width: '100' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      isSearch: true,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'overdue-demands',
      title: 'Demandas em Andamento',
      iconId: 'clock',
      path: '/dashboard/comunicacao/consultar-demandas',
      color: 'orange' as CardColor,
      width: '25' as CardWidth,
      height: '2' as CardHeight,
      isCustom: false,
      isOverdueDemands: true,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'pending-actions',
      title: 'Você precisa agir',
      iconId: 'alert-triangle',
      path: '',
      color: 'orange-light' as CardColor,
      width: '25' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      isPendingActions: true,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: '3',
      title: 'Consultar Demandas',
      iconId: 'list-filter',
      path: '/dashboard/comunicacao/consultar-demandas',
      color: 'green' as CardColor,
      width: '25' as CardWidth,
      height: '1' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: '4',
      title: 'Consultar Notas',
      iconId: 'file-text',
      path: '/dashboard/comunicacao/consultar-notas',
      color: 'blue-dark' as CardColor,
      width: '25' as CardWidth,
      height: '1' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: '5',
      title: 'Ranking de Zeladoria',
      iconId: 'bar-chart-2',
      path: '/dashboard/zeladoria/ranking-subs',
      color: 'orange' as CardColor,
      width: '25' as CardWidth,
      height: '1' as CardHeight,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'new-card',
      title: 'Novo Card',
      iconId: 'plus-circle',
      path: '',
      color: 'orange-light' as CardColor,
      width: '25' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      isNewCardButton: true,
      type: 'standard' as CardType,
      displayMobile: true,
      mobileOrder: 8
    }
  ];

  // Add communication team specific cards
  if (coordenacaoId === 'comunicacao') {
    return [
      ...baseCards,
      {
        id: '1',
        title: 'Nova Demanda',
        iconId: 'clipboard-list',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 2
      },
      {
        id: '2',
        title: 'Criar Nota Oficial',
        iconId: 'file-text',
        path: '/dashboard/comunicacao/criar-nota',
        color: 'lime' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 3
      }
    ];
  }
  
  return baseCards;
};
