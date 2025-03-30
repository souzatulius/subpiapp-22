import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600';

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2';

export interface ActionCardItem {
  id: string;
  title: string;
  icon: ReactNode;
  iconId: string;
  path: string;
  color: CardColor;
  width?: CardWidth;
  height?: CardHeight;
  isCustom?: boolean;
  type: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
}

// Usado para o formulário de edição/criação
export interface FormSchema {
  title: string;
  path: string;
  color: CardColor;
  iconId: string;
  type: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  width?: CardWidth;
  height?: CardHeight;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments: string[];
  allowedRoles: string[];
}
