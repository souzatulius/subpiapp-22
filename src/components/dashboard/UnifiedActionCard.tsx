
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem, CardWidth, CardHeight, CardColor, CardType } from '@/types/dashboard';
import ActionCard from './ActionCard';
import { PencilLine, Trash2, EyeOff } from 'lucide-react';

export interface Controls {
  cardId: string;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
}

export const Controls: React.FC<Controls> = ({ cardId, onEdit, onDelete, onHide, isCustom = false }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(cardId);
        }}
        className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 hover:text-blue-800 transition-all"
        title="Editar card"
      >
        <PencilLine className="h-3.5 w-3.5" />
      </button>

      {onHide && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHide(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-orange-600 hover:text-orange-800 transition-all"
          title="Ocultar card"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      )}
      
      {isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 hover:text-red-600 transition-all"
          title="Excluir card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export interface UnifiedActionCardProps extends ActionCardItem {
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
}

export function SortableUnifiedActionCard(props: UnifiedActionCardProps) {
  const {
    id,
    isDraggable = false,
    isEditing = false,
    disableWiggleEffect = false,
    ...rest
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animation: disableWiggleEffect ? 'none' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <UnifiedActionCard 
        id={id} 
        sortableProps={isDraggable ? { attributes, listeners } : undefined} 
        isEditing={isEditing}
        {...rest} 
      />
    </div>
  );
}

export interface SortableProps {
  attributes: ReturnType<typeof useSortable>['attributes']; 
  listeners: ReturnType<typeof useSortable>['listeners'];
}

export function UnifiedActionCard({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  width,
  height,
  type = 'standard',
  isEditing = false,
  onEdit,
  onDelete,
  onHide,
  sortableProps,
  iconSize,
  isCustom,
  isQuickDemand,
  isSearch,
  isMobileView = false,
  showSpecialFeatures,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  hasBadge,
  badgeValue,
  hasSubtitle,
}: UnifiedActionCardProps & { sortableProps?: SortableProps }) {
  
  return (
    <div
      className="h-full"
      {...(sortableProps ? { ...sortableProps.attributes, ...sortableProps.listeners } : {})}
    >
      <ActionCard
        id={id}
        title={title}
        iconId={iconId}
        path={path}
        color={color}
        isDraggable={isEditing}
        onEdit={onEdit}
        onDelete={onDelete}
        onHide={onHide}
        isCustom={isCustom}
        iconSize={iconSize}
        isMobileView={isMobileView}
      />
    </div>
  );
}
