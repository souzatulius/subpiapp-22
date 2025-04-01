
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { ActionCardItem, CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  
  useEffect(() => {
    // Define a comprehensive list of available cards for the library
    const libraryCards: ActionCardItem[] = [
      // Cards da página de comunicação (da imagem)
      {
        id: `template-${uuidv4()}`,
        title: 'Cadastrar Demanda',
        subtitle: 'Registre novas solicitações da imprensa',
        iconId: 'PlusCircle',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Responder Demanda',
        subtitle: 'Responda às demandas pendentes',
        iconId: 'MessageSquare',
        path: '/dashboard/comunicacao/responder',
        color: 'green-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 2
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Criar Nota Oficial',
        subtitle: 'Elabore notas oficiais',
        iconId: 'FileText',
        path: '/dashboard/comunicacao/criar-nota',
        color: 'orange-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Aprovar Notas',
        subtitle: 'Revise e aprove notas oficiais',
        iconId: 'CheckCircle',
        path: '/dashboard/comunicacao/aprovar',
        color: 'purple-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 4
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Nova Solicitação',
        subtitle: 'Escolha a origem da solicitação',
        iconId: 'Plus',
        path: '',
        color: 'blue-light',
        width: '33' as CardWidth,
        height: '2',
        isCustom: false,
        type: 'special',
        displayMobile: true,
        mobileOrder: 5,
        hasSubmenu: true,
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas Pendentes',
        subtitle: 'Veja as demandas aguardando resposta',
        iconId: 'MessageSquare',
        path: '',
        color: 'blue',
        width: '33' as CardWidth,
        height: '2',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'pending_demands',
        displayMobile: true,
        mobileOrder: 6,
        hasBadge: true,
        badgeValue: '0'
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Notas Oficiais',
        subtitle: 'Gerencie as notas da sua coordenação',
        iconId: 'FileText',
        path: '',
        color: 'orange',
        width: '33' as CardWidth,
        height: '2',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'official_notes',
        displayMobile: true,
        mobileOrder: 7,
        hasBadge: true,
        badgeValue: '1'
      },
      
      // Search card
      {
        id: `template-${uuidv4()}`,
        title: 'O que você deseja fazer?',
        iconId: 'Search',
        path: '',
        color: 'gray-light',
        width: '100' as CardWidth, 
        height: '1',
        isCustom: false,
        type: 'standard',
        isSearch: true,
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Consultar Demandas',
        iconId: 'Search',
        path: '/demandas',
        color: 'blue-dark',
        width: '25' as CardWidth, 
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Consultar Notas',
        iconId: 'FileText',
        path: '/notas',
        color: 'green',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 4
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Nova Solicitação',
        iconId: 'Plus',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'orange-600',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Criar Nota Oficial',
        iconId: 'FileEdit',
        path: '/dashboard/notas/criar',
        color: 'lime',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 2
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Relatórios',
        iconId: 'BarChart3',
        path: '/relatorios',
        color: 'blue',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 5
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Configurações',
        iconId: 'Settings',
        path: '/settings',
        color: 'gray-dark',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 6
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Perfil',
        iconId: 'User',
        path: '/perfil',
        color: 'orange-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 7
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Notificações',
        iconId: 'Bell',
        path: '/notificacoes',
        color: 'orange',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 8
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas Pendentes',
        iconId: 'Clock',
        path: '/demandas/pendentes',
        color: 'blue-dark',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 9,
        isPendingActions: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas em Atraso',
        iconId: 'AlertTriangle',
        path: '/demandas/atrasadas',
        color: 'orange-600',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 10,
        isOverdueDemands: true
      },
      // Add dynamic data cards from Comunicacao dashboard
      {
        id: `template-${uuidv4()}`,
        title: 'Nova Demanda',
        iconId: 'Plus',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 11
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Responder Demandas',
        iconId: 'MessageSquareReply',
        path: '/dashboard/comunicacao/responder',
        color: 'green',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 12
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Gerenciar Notas',
        iconId: 'FileText',
        path: '/dashboard/comunicacao/notas',
        color: 'orange-light',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 13
      },
      // Dynamic data cards
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas Pendentes (Dinâmico)',
        iconId: 'Clock',
        path: '',
        color: 'orange-600',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'pending_demands',
        displayMobile: true,
        mobileOrder: 14
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas em Andamento (Dinâmico)',
        iconId: 'BarChart3',
        path: '',
        color: 'blue-dark',
        width: '25' as CardWidth,
        height: '1',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'ongoing_demands',
        displayMobile: true,
        mobileOrder: 15
      }
    ];
    
    setAvailableCards(libraryCards);
  }, []);
  
  return { availableCards };
};
