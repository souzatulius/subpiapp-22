
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  
  useEffect(() => {
    // Template cards that can be added to the dashboard
    const templateCards: ActionCardItem[] = [
      {
        id: 'template-demandas',
        title: 'Demandas',
        iconId: 'ClipboardList',
        path: '/dashboard/demandas',
        color: 'blue',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'template-comunicacao',
        title: 'Comunicação',
        iconId: 'MessageSquare',
        path: '/dashboard/comunicacao',
        color: 'green',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'template-search',
        title: 'Pesquisa Rápida',
        iconId: 'Search',
        path: '',
        color: 'gray-light',
        width: '100',
        height: '1',
        type: 'smart_search',
        isSearch: true
      },
      {
        id: 'template-notas',
        title: 'Notas Oficiais',
        iconId: 'FileText',
        path: '/dashboard/comunicacao/consultar-notas',
        color: 'orange',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'template-pendentes',
        title: 'Tarefas Pendentes',
        iconId: 'AlertTriangle',
        path: '',
        color: 'orange-light',
        width: '25',
        height: '1',
        type: 'special',
        isPendingActions: true
      },
      {
        id: 'template-relatorios',
        title: 'Relatórios',
        iconId: 'BarChart2',
        path: '/dashboard/relatorios',
        color: 'purple-light',
        width: '25',
        height: '1',
        type: 'standard'
      }
    ];
    
    setAvailableCards(templateCards);
  }, []);
  
  return { availableCards };
};
