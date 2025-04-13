
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';

export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    {
      id: 'cadastrar-demanda-card',
      title: 'Cadastrar Demanda',
      iconId: 'PlusCircle',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'blue-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'responder-demanda-card',
      title: 'Responder Demanda',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'criar-nota-card',
      title: 'Criar Nota Oficial',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'aprovar-notas-card',
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar-nota',
      color: 'blue-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
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
      mobileOrder: 5
    },
    {
      id: 'noticias-releases-card',
      title: 'Notícias e Releases',
      iconId: 'Newspaper',
      path: '/dashboard/releases',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: 'notas-imprensa-card',
      title: 'Notas de Imprensa',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/notas',
      color: 'orange-dark',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 8
    },
    {
      id: 'consultar-demandas-card',
      title: 'Consultar Demandas',
      iconId: 'List',
      path: '/dashboard/comunicacao/demandas',
      color: 'green-teal',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 9
    },
    {
      id: 'esic-processos-card',
      title: 'Processos e-SIC',
      iconId: 'FileSearch',
      path: '/dashboard/esic',
      color: 'gray-light',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: 'press-request-card',
      title: 'Nova Solicitação da Imprensa',
      iconId: 'Newspaper',
      path: '',
      color: 'bg-white',
      width: '25',
      height: '2',
      type: 'press_request_card',
      displayMobile: true,
      mobileOrder: 10
    }
  ];
};

// Helper function to get background color from card color
export const getBgColor = (color: string): string => {
  if (color.startsWith('bg-')) return color;
  
  // Color mapping for custom colors
  switch (color) {
    case 'deep-blue': return 'bg-blue-600';
    case 'blue-light': return 'bg-blue-400';
    case 'blue-dark': return 'bg-blue-800';
    case 'blue-vivid': return 'bg-blue-500';
    case 'gray-light': return 'bg-gray-200';
    case 'gray-medium': return 'bg-gray-400';
    case 'orange-light': return 'bg-orange-300';
    case 'orange-dark': return 'bg-orange-700';
    case 'green-teal': return 'bg-teal-500';
    case 'green-neon': return 'bg-green-400';
    case 'green-dark': return 'bg-green-700';
    default: return 'bg-gray-200';
  }
};
