import { ReactNode } from 'react';

// Cores disponíveis para cards
export type CardColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'gray-light'
  | 'gray-dark'
  | 'blue-dark'
  | 'orange-light'
  | 'gray-ultra-light'
  | 'lime'
  | 'orange-600';

// Tipos de card
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
  path?: string;
  color: CardColor;
  iconId?: string;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isCustom?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  type?: CardType;
  dataSourceKey?: DataSourceKey;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
}
