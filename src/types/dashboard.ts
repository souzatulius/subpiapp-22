
// Add this to the types file if it doesn't exist
export type CardColor = 
  | 'bg-blue-500' 
  | 'bg-green-500' 
  | 'bg-red-500' 
  | 'bg-purple-500' 
  | 'bg-pink-500' 
  | 'bg-indigo-500' 
  | 'bg-yellow-500'  // Add yellow color
  | 'bg-gray-500';   // Add gray color

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
}

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2' | '3' | '4';
export type CardType = 'standard' | 'special' | 'dynamic' | 'grid';
export type DataSourceKey = 'pendingDemands' | 'pendingNotes' | 'overdueDemands' | 'approvedNotes';
