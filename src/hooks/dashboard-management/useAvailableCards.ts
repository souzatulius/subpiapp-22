
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  
  useEffect(() => {
    // Define all cards that can be added to dashboards
    const cardTemplates: ActionCardItem[] = [
      // Generic cards
      {
        id: `template-${uuidv4()}`,
        title: 'Consultar Demandas',
        iconId: 'Search',
        path: '/dashboard/demandas',
        color: 'blue-dark',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Consultar Notas',
        iconId: 'FileText',
        path: '/dashboard/notas',
        color: 'green',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Pesquisa Rápida',
        subtitle: 'Busca global',
        iconId: 'Search',
        path: '',
        color: 'gray-light',
        width: '100',
        height: '1',
        isCustom: false,
        isSearch: true,
        type: 'smart_search',
        displayMobile: true
      },
      
      // Communication specific cards
      {
        id: `template-${uuidv4()}`,
        title: 'Cadastrar Demanda',
        subtitle: 'Registre novas solicitações',
        iconId: 'PlusCircle',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Responder Demanda',
        subtitle: 'Responda às solicitações',
        iconId: 'MessageSquare',
        path: '/dashboard/comunicacao/responder',
        color: 'green',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Criar Nota Oficial',
        subtitle: 'Elabore notas oficiais',
        iconId: 'FileText',
        path: '/dashboard/comunicacao/criar-nota',
        color: 'orange',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Aprovar Notas',
        subtitle: 'Revise e aprove notas',
        iconId: 'CheckCircle',
        path: '/dashboard/comunicacao/aprovar-nota',
        color: 'purple-light',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true
      },
      
      // Dynamic data cards
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas Pendentes',
        iconId: 'AlertTriangle',
        path: '',
        color: 'orange-light',
        width: '25',
        height: '2',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'pendencias_por_coordenacao',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Notas Para Aprovação',
        iconId: 'FileCheck',
        path: '',
        color: 'blue-light',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'data_dynamic',
        dataSourceKey: 'notas_aguardando_aprovacao',
        displayMobile: true
      },
      {
        id: `template-${uuidv4()}`,
        title: 'Demandas em Andamento',
        iconId: 'Clock',
        path: '/dashboard/comunicacao/consultar-demandas',
        color: 'orange',
        width: '25',
        height: '2',
        isCustom: false,
        isOverdueDemands: true,
        type: 'standard',
        displayMobile: true
      }
    ];
    
    setAvailableCards(cardTemplates);
  }, []);
  
  return { availableCards };
};
