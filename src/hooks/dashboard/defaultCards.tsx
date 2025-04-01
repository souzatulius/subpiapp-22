
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Returns default cards based on department ID
export const getDefaultCards = (coordenacaoId?: string): ActionCardItem[] => {
  // Base cards that will be used as the standard default
  const baseCards: ActionCardItem[] = [
    {
      id: uuidv4(),
      title: 'Pesquisar',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue-dark',
      width: '25',
      height: '1',
      isCustom: false,
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1,
      version: '1.0'
    },
    {
      id: uuidv4(),
      title: 'Consultar Notas',
      iconId: 'FileText',
      path: '/notas',
      color: 'green',
      width: '25',
      height: '1',
      isCustom: false,
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2,
      version: '1.0'
    }
  ];

  // Comunicação department specific cards
  if (coordenacaoId === 'comunicacao') {
    return [
      {
        id: uuidv4(),
        title: 'Nova Solicitação',
        iconId: 'Plus',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'orange-600',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 1,
        version: '1.0'
      },
      {
        id: uuidv4(),
        title: 'Criar Nota Oficial',
        iconId: 'FileEdit',
        path: '/dashboard/notas/criar',
        color: 'lime',
        width: '25',
        height: '1',
        isCustom: false,
        type: 'standard',
        displayMobile: true,
        mobileOrder: 2,
        version: '1.0'
      },
      ...baseCards
    ];
  }

  return baseCards;
};

// Helper function to get icon component from ID
export const getIconComponentFromId = (iconId: string): React.ComponentType<LucideProps> => {
  // @ts-ignore - dynamically access the icon from lucide-react
  const IconComponent = icons[iconId] || icons.Layout;
  return IconComponent;
};
