
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { ActionCardItem, CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  
  useEffect(() => {
    // Define a comprehensive list of available cards for the library
    const libraryCards: ActionCardItem[] = [
      {
        id: `template-${uuidv4()}`,
        title: 'Consultar Demandas',
        iconId: 'Search',
        path: '/demandas',
        color: 'blue-dark',
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
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
        width: '25' as CardWidth, // Changed from '1' to '25'
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 10,
        isOverdueDemands: true
      }
    ];
    
    setAvailableCards(libraryCards);
  }, []);
  
  return { availableCards };
};
