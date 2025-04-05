import { ReactNode } from 'react';

export type CardColor =
  | 'blue-vivid' // #0066FF - Azul Vivo
  | 'blue-light' // #66B2FF - Azul Claro
  | 'blue-dark' // #1D4ED8 - Azul Escuro
  | 'green-neon' // #66FF66 - Verde Neon
  | 'green-dark' // #00CC00 - Verde Escuro
  | 'gray-light' // #F5F5F5 - Cinza Claro
  | 'gray-lighter' // #FAFAFA - Cinza Mais Claro
  | 'gray-medium' // #D4D4D4 - Cinza Médio
  | 'orange-dark' // #F25C05 - Laranja Escuro
  | 'orange-light' // #F89E66 - Laranja Claro
  | 'navy-dark'; // #051A2C - Azul Marinho Escuro

export type CardWidth = '25' | '33' | '50' | '75' | '100';
export type CardHeight = '1' | '2';
export type CardType = 'standard' | 'data_dynamic' | 'special' | 'smart_search' | 'action' | 
  'in_progress_demands' | 'recent_notes' | 'origin_selection';
export type DataSourceKey = string;

export interface ActionCardItem {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor;
  width?: CardWidth;
  height?: CardHeight;
  isCustom?: boolean;
  type: CardType;
  dataSourceKey?: DataSourceKey;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  isStandard?: boolean;
  hasSubmenu?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  isHidden?: boolean;
}

export interface Department {
  id: string;
  nome: string;
  sigla?: string;
  descricao?: string;
}
