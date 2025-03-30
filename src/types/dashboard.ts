
import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600';

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2';
export type CardType = 'standard' | 'data_dynamic';
export type DataSourceKey = 
  | 'pendencias_por_coordenacao' 
  | 'notas_aguardando_aprovacao' 
  | 'respostas_atrasadas' 
  | 'demandas_aguardando_nota'
  | 'ultimas_acoes_coordenacao'
  | 'comunicados_por_cargo';

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
}
