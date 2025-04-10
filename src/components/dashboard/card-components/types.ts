
import { ActionCardItem, CardWidth, CardHeight, CardColor, CardType } from '@/types/dashboard';
import { ReturnType } from '@dnd-kit/sortable/dist/types';
import { useSortable } from '@dnd-kit/sortable';

export interface SortableProps {
  attributes: ReturnType<typeof useSortable>['attributes']; 
  listeners: ReturnType<typeof useSortable>['listeners'];
}

export interface CardContentProps extends ActionCardItem {
  isDraggable?: boolean;
  isEditing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  hasSubtitle?: boolean;
  isMobileView?: boolean;
  contentClassname?: string;
  isPendingActions?: boolean;
  isUserProfile?: boolean;
  isNotificationSettings?: boolean;
  specialContent?: React.ReactNode;
  children?: React.ReactNode;
  sortableProps?: SortableProps;
}

export interface CardRendererProps {
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  textColorClass: string;
  renderIcon: () => React.ReactNode | null;
  title: string;
  subtitle?: string;
  specialContent?: React.ReactNode;
  children?: React.ReactNode;
  chartId?: string;
}
