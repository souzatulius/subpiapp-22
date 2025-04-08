
// Add this to the types file if it doesn't exist
export type CardColor = 
  | 'bg-blue-500' 
  | 'bg-green-500' 
  | 'bg-red-500' 
  | 'bg-purple-500' 
  | 'bg-pink-500' 
  | 'bg-indigo-500' 
  | 'bg-yellow-500'  
  | 'bg-gray-500'   
  | 'blue-vivid'
  | 'blue-light'
  | 'blue-dark'
  | 'green-neon'
  | 'green-dark'
  | 'gray-light'
  | 'gray-medium'
  | 'orange-dark'
  | 'orange-light'
  | 'deep-blue'
  | 'neutral-800'
  | 'orange-700';

// Additional type definitions needed
export interface ActionCardItem {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor | string;
  width: CardWidth;
  height: CardHeight;
  type: CardType;
  displayMobile?: boolean;
  mobileOrder?: number;
  hasBadge?: boolean;
  badgeValue?: string;
  isHidden?: boolean;
  isSearch?: boolean;
  isQuickDemand?: boolean;
  isCustom?: boolean;
  allowedDepartments?: string[];
  dataSourceKey?: DataSourceKey;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  isNewCardButton?: boolean;
  isStandard?: boolean;
}

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2' | '3' | '4';
export type CardType = 
  | 'standard' 
  | 'special' 
  | 'dynamic' 
  | 'grid'
  | 'data_dynamic'
  | 'in_progress_demands'
  | 'recent_notes'
  | 'origin_selection'
  | 'smart_search';

export type DataSourceKey = 
  | 'pendingDemands' 
  | 'pendingNotes' 
  | 'overdueDemands' 
  | 'approvedNotes'
  | 'pendencias_por_coordenacao'
  | 'notas_aguardando_aprovacao'
  | 'respostas_atrasadas'
  | 'demandas_aguardando_nota'
  | 'ultimas_acoes_coordenacao'
  | 'comunicados_por_cargo';
