
export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '0.5' | '1' | '2' | '3' | '4';
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
  | 'blue-light'
  | 'blue-vivid'
  | 'blue-dark'
  | 'green-neon'
  | 'green-dark'
  | 'green-teal'
  | 'orange-dark'
  | 'neutral-800'
  | 'orange-700';

export type CardType = 
  | 'standard' 
  | 'data_dynamic' 
  | 'in_progress_demands' 
  | 'recent_notes' 
  | 'origin_selection' 
  | 'smart_search'
  | 'origin_demand_chart'
  | 'communications'
  | 'pending_actions'
  | 'pending_tasks'
  | 'user_profile'
  | 'notification_settings'
  | 'press_request_card';

export type DataSourceKey = 
  | 'pendencias_por_coordenacao' 
  | 'notas_aguardando_aprovacao' 
  | 'respostas_atrasadas' 
  | 'demandas_aguardando_nota' 
  | 'ultimas_acoes_coordenacao'
  | 'comunicados_por_cargo'
  | string;

export interface OriginOption {
  id: string;
  title: string;
  icon: React.ReactNode | string;
  path?: string;
}

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
  dataSourceKey?: DataSourceKey;
  displayMobile?: boolean;
  mobileOrder?: number;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  isNewCardButton?: boolean;
  isStandard?: boolean;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  hasBadge?: boolean;
  badgeValue?: number;
  subtitle?: string;
  chartId?: string;
  isPendingTasks?: boolean;
  departmentId?: string;
  isComunicacao?: boolean;
  isComunicados?: boolean;
  isUserProfile?: boolean;
  isNotificationSettings?: boolean;
  isVisible?: boolean; // Added isVisible property
}
