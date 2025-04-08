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

// Action cards para a página de comunicação
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'cadastro-demandas',
      title: "De onde vem a solicitação?",
      path: "/dashboard/comunicacao/cadastrar",
      iconId: "plus-circle",
      color: 'blue-vivid',
      width: '50',
      height: '2',
      type: 'origin_selection',
      isOriginSelection: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'nova-solicitacao',
      title: "Nova Solicitação",
      path: "/dashboard/comunicacao/cadastrar",
      iconId: "plus-circle",
      color: 'blue-vivid',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'responder-demandas',
      title: "Responder Demandas",
      path: "/dashboard/comunicacao/responder",
      iconId: "chat-bubble-left-right",
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: false,
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'consultar-demandas',
      title: "Consultar Demandas",
      path: "/dashboard/comunicacao/demandas",
      iconId: "list-bullet",
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'criar-nota',
      title: "Nova Nota",
      path: "/dashboard/comunicacao/criar-nota",
      iconId: "document-plus",
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: true,
      badgeValue: "0",
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'aprovar-notas',
      title: "Aprovar Notas",
      path: "/dashboard/comunicacao/aprovar-nota",
      iconId: "check-circle",
      color: 'blue-dark',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: false,
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'consultar-notas',
      title: "Notas",
      path: "/dashboard/comunicacao/notas",
      iconId: "document-text",
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'relatorios-comunicacao',
      title: 'Relatórios da Comunicação',
      path: '/dashboard/comunicacao/relatorios',
      iconId: 'bar-chart-2',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'gerar-noticia',
      title: 'Notícias',
      path: '/dashboard/comunicacao/cadastrar-release',
      iconId: 'document-plus',
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'ver-releases',
      title: 'Notícias',
      path: '/dashboard/comunicacao/releases',
      iconId: 'file-text',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10
    },
    {
      id: 'esic',
      title: 'e-SIC',
      path: '/dashboard/esic',
      iconId: 'file-text',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 11,
      allowedDepartments: ['comunicacao', 'gabinete']
    }
  ];
};

// Cards padrão para o dashboard inicial
export const getInitialDashboardCards = (coordenacaoId?: string): ActionCardItem[] => {
  if (coordenacaoId === 'comunicacao') {
    return [
      {
        id: 'nova-solicitacao',
        title: 'Nova Solicitação',
        iconId: 'plus-circle',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue-vivid',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: 'responder-demandas',
        title: 'Responder Demandas',
        iconId: 'chat-bubble-left-right',
        path: '/dashboard/comunicacao/responder',
        color: 'orange-dark',
        width: '25',
        height: '2',
        type: 'standard',
        hasBadge: true,
        badgeValue: "0",
        displayMobile: true,
        mobileOrder: 2
      },
      {
        id: 'consultar-demandas',
        title: 'Consultar Demandas',
        iconId: 'list-bullet',
        path: '/dashboard/comunicacao/demandas',
        color: 'deep-blue',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: 'criar-nota',
        title: 'Nova Nota',
        iconId: 'document-plus',
        path: '/dashboard/comunicacao/criar-nota',
        color: 'gray-medium',
        width: '25',
        height: '2',
        type: 'standard',
        hasBadge: true,
        badgeValue: '0',
        displayMobile: true,
        mobileOrder: 4
      },
      {
        id: 'aprovar-notas',
        title: 'Aprovar Notas',
        iconId: 'check-circle',
        path: '/dashboard/comunicacao/aprovar-nota',
        color: 'blue-dark',
        width: '25',
        height: '2',
        type: 'standard',
        hasBadge: true,
        badgeValue: '0',
        displayMobile: true,
        mobileOrder: 5
      },
      {
        id: 'ranking-zeladoria',
        title: 'Ranking de Zeladoria',
        iconId: 'trophy',
        path: '/dashboard/zeladoria/ranking-subs',
        color: 'gray-light',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 7
      },
      {
        id: 'relatorios-comunicacao',
        title: 'Relatórios da Comunicação',
        path: '/dashboard/comunicacao/relatorios',
        iconId: 'bar-chart-2',
        color: 'deep-blue',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 8
      },
      {
        id: 'gerar-noticia',
        title: 'Notícias',
        path: '/dashboard/comunicacao/cadastrar-release',
        iconId: 'document-plus',
        color: 'orange-dark',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 9
      },
      {
        id: 'ver-releases',
        title: 'Notícias',
        path: '/dashboard/comunicacao/releases',
        iconId: 'file-text',
        color: 'gray-medium',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 10
      },
      {
        id: 'esic',
        title: 'e-SIC',
        path: '/dashboard/esic',
        iconId: 'file-text',
        color: 'blue-light',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: 11,
        allowedDepartments: ['comunicacao', 'gabinete']
      }
    ];
  }
  
  return [
    {
      id: 'nova-solicitacao',
      title: 'Nova Solicitação',
      iconId: 'plus-circle',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-vivid',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'responder-demandas',
      title: 'Responder Demandas',
      iconId: 'chat-bubble-left-right',
      path: '/dashboard/comunicacao/responder',
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: true,
      badgeValue: "0",
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'consultar-demandas',
      title: 'Consultar Demandas',
      iconId: 'list-bullet',
      path: '/dashboard/comunicacao/demandas',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'criar-nota',
      title: 'Nova Nota',
      iconId: 'document-plus',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: true,
      badgeValue: '0',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'aprovar-notas',
      title: 'Aprovar Notas',
      iconId: 'check-circle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'blue-dark',
      width: '25',
      height: '2',
      type: 'standard',
      hasBadge: true,
      badgeValue: '0',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'ranking-zeladoria',
      title: 'Ranking de Zeladoria',
      iconId: 'trophy',
      path: '/dashboard/zeladoria/ranking-subs',
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'relatorios-comunicacao',
      title: 'Relatórios da Comunicação',
      path: '/dashboard/comunicacao/relatorios',
      iconId: 'bar-chart-2',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'gerar-noticia',
      title: 'Notícias',
      path: '/dashboard/comunicacao/cadastrar-release',
      iconId: 'document-plus',
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'ver-releases',
      title: 'Notícias',
      path: '/dashboard/comunicacao/releases',
      iconId: 'file-text',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10
    },
    {
      id: 'esic',
      title: 'e-SIC',
      path: '/dashboard/esic',
      iconId: 'file-text',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 10,
      allowedDepartments: ['comunicacao', 'gabinete']
    }
  ];
};

// Compatibilidade com código existente
export const getDefaultCards = getInitialDashboardCards;
