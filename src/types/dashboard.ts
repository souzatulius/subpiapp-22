
import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600';

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2';
export type CardType = 'standard' | 'data_dynamic' | 'quickDemand' | 'search' | 'overdueDemands' | 'pendingActions';
export type DataSourceKey = string;

// Interface de dimensões dos cards (específica para ocupação de grid)
export interface CardDimensions {
  id: string;
  width: CardWidth;
  height: CardHeight;
  type: CardType; // Atualizamos para aceitar todos os tipos de card
}

export interface ActionCardItem {
  id: string;
  title: string;
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
  hidden?: boolean;
  version?: string;
}

export interface UnifiedCardItem extends ActionCardItem {
  version: string;
}

export interface DashboardState {
  cards: ActionCardItem[];
  setCards: (cards: ActionCardItem[]) => void;
  loading: boolean;
  handleDeleteCard: (id: string) => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleAddNewCard?: () => void;
  saveDashboard?: () => Promise<boolean>;
  isEditMode?: boolean;
  setIsEditMode?: (value: boolean) => void;
}
