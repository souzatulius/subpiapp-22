export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2' | '3' | '4';
export type CardColor = 
  | 'bg-white' 
  | 'bg-blue-500' 
  | 'bg-orange-500' 
  | 'bg-gray-500' 
  | 'bg-yellow-500' 
  | 'bg-teal-500'
  | 'bg-green-500'
  | 'bg-red-500'
  | 'bg-purple-500'
  | 'deep-blue'
  | 'gray-light'
  | 'gray-medium'
  | 'orange-light'
  | 'blue-light';
export type CardType = 'standard' | 'data_dynamic' | 'in_progress_demands' | 'recent_notes' | 'origin_selection' | 'smart_search';

export interface ActionCardItem {
  id: string;
  title: string;
  iconId: string;
  path: string;
  color: CardColor;
  width?: CardWidth;
  height?: CardHeight;
  type?: CardType;
  isHidden?: boolean;
  isCustom?: boolean;
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  isNewCardButton?: boolean;
  isStandard?: boolean;
  allowedDepartments?: string[];
  hasBadge?: boolean;
  badgeValue?: number;
  subtitle?: string;
  chartId?: string; // Add this new property
}
