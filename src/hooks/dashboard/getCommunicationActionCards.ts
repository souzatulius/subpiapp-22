
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';

export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'comunicacao-search-card',
      title: 'Busca Comunicação',
      iconId: 'Search',
      path: '',
      color: 'bg-white',
      width: '100',
      height: '0.5',
      type: 'smart_search',
      isSearch: true,
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: uuidv4(),
      title: 'Cadastrar Demanda',
      iconId: 'PlusCircle',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Responder Demanda',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Criar Nota Oficial',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'blue-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'origem-demandas-card',
      title: 'Atividades em Andamento',
      subtitle: 'Demandas da semana por área técnica',
      iconId: 'BarChart2',
      path: '',
      color: 'gray-light',
      width: '50',
      height: '2',
      type: 'origin_demand_chart',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Releases e Notícias',
      iconId: 'Newspaper',
      path: '/dashboard/comunicacao/releases',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    }
  ];
};
