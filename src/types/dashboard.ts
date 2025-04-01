
import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600'
  | 'blue-light' | 'green-light' | 'purple-light';

export type CardWidth = '25' | '33' | '50' | '75' | '100';
export type CardHeight = '1' | '2';
export type CardType = 'standard' | 'data_dynamic' | 'special';
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
  hasSubmenu?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  isHidden?: boolean;
}
