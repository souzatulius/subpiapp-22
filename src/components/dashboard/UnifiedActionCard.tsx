import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem, CardColor, CardWidth, CardHeight } from '@/types/dashboard';
import { getColorClasses } from './utils/cardColorUtils';
import { X, Pencil, Eye, EyeOff } from 'lucide-react';

export interface UnifiedActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor;
  width?: CardWidth;
  height?: CardHeight;
  isDraggable?: boolean;
  isEditing?: boolean;
  showControls?: boolean;
  disableWiggleEffect?: boolean;
  hasSubtitle?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isHidden?: boolean;
  isCustom?: boolean;
}

// Card Controls Component
const CardControls: React.FC<{
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
}> = ({ id, onEdit, onDelete, onHide, isCustom }) => {
  return (
    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      {onEdit && (
        <button
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          aria-label="Editar card"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onHide && (
        <button
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onHide(id);
          }}
          aria-label="Ocultar card"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      )}
      {onDelete && isCustom && (
        <button
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          aria-label="Remover card"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const SortableUnifiedActionCard: React.FC<UnifiedActionCardProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
      <UnifiedActionCard {...props} />
    </div>
  );
};

const UnifiedActionCard: React.FC<UnifiedActionCardProps> = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  isDraggable = false,
  isEditing = false,
  showControls = true,
  disableWiggleEffect = false,
  hasSubtitle = false,
  hasBadge = false,
  badgeValue,
  iconSize = 'xl',
  onEdit,
  onDelete,
  onHide,
  isCustom = false
}) => {
  const navigate = (e: React.MouseEvent) => {
    if (!isEditing && path) {
      window.location.href = path;
    }
  };

  // Get the icon component based on iconId
  let IconComponent;
  try {
    const icons = require('lucide-react');
    IconComponent = icons[iconId as keyof typeof icons];
  } catch (error) {
    console.warn(`Icon '${iconId}' not found`, error);
  }

  const getIconSizeClass = () => {
    switch (iconSize) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-6 w-6';
      case 'lg': return 'h-8 w-8';
      case 'xl': return 'h-10 w-10';
      default: return 'h-10 w-10';
    }
  };

  const colorClasses = getColorClasses(color);

  const wiggleClass = !disableWiggleEffect && isEditing
    ? 'hover:animate-wiggle cursor-move'
    : '';

  return (
    <div
      onClick={navigate}
      className={`group relative flex flex-col h-full rounded-xl transition-all duration-200 
        ${colorClasses} ${isEditing ? 'cursor-move' : 'cursor-pointer'} ${wiggleClass}`}
    >
      {isEditing && showControls && (
        <CardControls
          id={id}
          onEdit={onEdit}
          onDelete={onDelete}
          onHide={onHide}
          isCustom={isCustom}
        />
      )}

      <div className="flex flex-col items-center justify-center p-4 h-full text-center">
        {hasBadge && badgeValue && (
          <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded-full">
            {badgeValue}
          </div>
        )}

        {IconComponent && (
          <div className="mb-3">
            <IconComponent className={getIconSizeClass()} />
          </div>
        )}

        <h3 className="font-medium leading-tight">{title}</h3>
        
        {hasSubtitle && subtitle && (
          <p className="text-sm opacity-90 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default UnifiedActionCard;
