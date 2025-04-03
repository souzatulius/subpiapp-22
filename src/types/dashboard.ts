
import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600'
  | 'blue-light' | 'green-light' | 'purple-light'
  | 'gray-400' | 'gray-800' | 'gray-950' | 'blue-700'
  | 'blue-900' | 'blue-960' | 'orange-400' | 'orange-500'
  | 'gray-200' | 'lime-500' | 'neutral-200';

export type CardWidth = '25' | '33' | '50' | '75' | '100';
export type CardHeight = '1' | '2';
export type CardType = 'standard' | 'data_dynamic' | 'special' | 'smart_search' | 'action' | 
  'in_progress_demands' | 'recent_notes' | 'origin_selection' | 'dynamic';
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
  canEdit?: boolean;
}

export interface DynamicCardItem extends ActionCardItem {
  widthDesktop?: number;
  widthMobile?: number;
}

export interface Department {
  id: string;
  nome: string;
  sigla?: string;
  descricao?: string;
}
