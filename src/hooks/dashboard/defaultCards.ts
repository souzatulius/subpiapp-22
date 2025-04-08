
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Function to get a Lucide icon component by its ID string
export const getIconComponentFromId = (iconId: string | undefined) => {
  if (!iconId) {
    return LucideIcons.FileText;
  }
  
  // First try to access the icon directly from LucideIcons
  if (LucideIcons[iconId as keyof typeof LucideIcons]) {
    return LucideIcons[iconId as keyof typeof LucideIcons];
  }
  
  // If not found, use a standardized format to match our naming convention
  const formattedIconId = iconId.charAt(0).toUpperCase() + iconId.slice(1);
  if (LucideIcons[formattedIconId as keyof typeof LucideIcons]) {
    return LucideIcons[formattedIconId as keyof typeof LucideIcons];
  }
  
  // Return a default icon as fallback
  return LucideIcons.FileText;
};

// Get default cards
export const getDefaultCards = (): ActionCardItem[] => {
  return [
    // Add the search card as the first item
    {
      id: 'dashboard-search-card',
      title: 'Busca Rápida',
      iconId: 'Search',
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
      iconId: 'FileText',
      path: '/dashboard/comunicacao/demandas',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Avisos',
      subtitle: 'Notas da coordenação',
      iconId: 'Bell',
      path: '/dashboard/comunicacao',
      color: 'deep-blue',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Responder Demandas',
      subtitle: 'Pendências',
      iconId: 'MessageSquare',
      path: '/dashboard/comunicacao/responder',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Ranking',
      subtitle: 'Produtividade das Subsecretarias',
      iconId: 'TrendingUp',
      path: '/dashboard/zeladoria/ranking-subs',
      color: 'bg-orange-500',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: uuidv4(),
      title: 'Nova Solicitação',
      iconId: 'Pencil',
      path: '/dashboard/comunicacao/cadastrar',
      color: 'gray-medium',
      width: '25',
      height: '2',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: 'Relatórios da Comunicação',
      subtitle: 'Estatísticas e análises',
      iconId: 'PieChart',
      path: '/dashboard/comunicacao/relatorios',
      color: 'orange-light',
      width: '50',
      height: '1',
      type: 'standard',
      chartId: 'origemDemandas',
      displayMobile: true,
      mobileOrder: 7
    },
    {
      id: uuidv4(),
      title: 'Ações Pendentes',
      iconId: 'AlertTriangle',
      path: '/dashboard/comunicacao/responder',
      color: 'bg-orange-500',
      width: '50',
      height: '1',
      type: 'in_progress_demands',
      isPendingActions: true,
      displayMobile: true,
      mobileOrder: 8
    }
  ];
};

// Get communication action cards 
export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    // Add the search card as the first item
    {
      id: 'dashboard-search-card',
      title: 'Busca Rápida',
      iconId: 'Search',
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
      title: 'Nova Demanda',
      iconId: 'Pencil', // Updated to match the new icon scheme
      path: '/dashboard/comunicacao/nova-demanda',
      color: 'gray-medium', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: 'Demandas em Andamento',
      iconId: 'FileText', // Updated to match the new icon scheme
      path: '/dashboard/comunicacao/demandas',
      color: 'deep-blue', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Aprovar Notas',
      iconId: 'CheckCircle',
      path: '/dashboard/comunicacao/aprovar',
      color: 'bg-orange-500', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: uuidv4(),
      title: 'Criar Nota',
      iconId: 'FileText',
      path: '/dashboard/comunicacao/criar-nota',
      color: 'orange-light', // Updated to match the new color scheme
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 5
    }
  ];
};
