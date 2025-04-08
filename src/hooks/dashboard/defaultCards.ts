import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';

// Get default cards
export const getDefaultCards = (): ActionCardItem[] => {
  return [
    // Add the search card as the first item
    {
      id: 'dashboard-search-card',
      title: 'Busca Rápida',
      iconId: 'search',
      path: '',
      color: 'bg-white',
      width: '100', // Full width
      height: '1', // Half height
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: uuidv4(),
      title: 'Demandas',
      iconId: 'clipboard-list',
      path: '/demandas',
      color: 'bg-blue-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Avisos',
      subtitle: 'Notas da coordenação',
      iconId: 'message-square-reply',
      path: '/dashboard/comunicacao',
      color: 'bg-green-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Aprovações',
      subtitle: 'Notas e documentos',
      iconId: 'file-check',
      path: '/aprovar',
      color: 'bg-red-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Ranking',
      subtitle: 'Produtividade das Subsecretarias',
      iconId: 'bar-chart-2',
      path: '/ranking-subs',
      color: 'bg-purple-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: uuidv4(),
      title: 'Cadastrar Demanda',
      iconId: 'plus-circle',
      path: '/cadastrar-demanda',
      color: 'bg-pink-500',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: 'Relatórios',
      iconId: 'file-text',
      path: '/relatorios',
      color: 'bg-indigo-500',
      width: '50',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Pendências por Coordenação',
      iconId: 'list-filter',
      path: '/demandas',
      color: 'orange-700',
      width: '50',
      height: '1',
      type: 'data_dynamic',
      dataSourceKey: 'pendencias_por_coordenacao',
      displayMobile: true,
      mobileOrder: 8
    }
  ];
};
