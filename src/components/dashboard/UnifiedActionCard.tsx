
import { useState } from 'react';
import { CardColor } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { Controls } from './SortableActionCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface UnifiedActionCardProps {
  id: string;
  title: string;
  iconId: string;
  path?: string;
  color: CardColor;
  iconSize?: 'sm' | 'md' | 'lg';
  badgeCount?: number;
  isEditing?: boolean;
  isDraggable?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isCustom?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const getBackgroundColor = (color: CardColor): string => {
  switch (color) {
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-green-500';
    case 'orange': return 'bg-orange-500';
    case 'gray-light': return 'bg-gray-200';
    case 'gray-dark': return 'bg-gray-700';
    case 'blue-dark': return 'bg-blue-700';
    case 'orange-light': return 'bg-orange-300';
    case 'gray-ultra-light': return 'bg-gray-100';
    case 'lime': return 'bg-lime-500';
    case 'orange-600': return 'bg-orange-600';
    default: return 'bg-blue-500';
  }
};

const getIconSize = (size?: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm': return 'w-6 h-6';
    case 'md': return 'w-8 h-8';
    case 'lg': return 'w-10 h-10';
    default: return 'w-8 h-8'; // default to medium
  }
};

export const UnifiedActionCard: React.FC<UnifiedActionCardProps> = ({
  id,
  title,
  iconId,
  path,
  color,
  iconSize = 'md',
  badgeCount,
  isEditing = false,
  isDraggable = false,
  onEdit,
  onDelete,
  isCustom = false,
  onClick,
  children
}) => {
  const bgColor = getBackgroundColor(color);
  const Icon = getIconComponentFromId(iconId);
  const iconSizeClass = getIconSize(iconSize);
  
  // Handle click events
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const cardContent = (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden cursor-pointer 
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 
      ${bgColor} ${isEditing ? 'animate-wiggle' : ''}`}
      onClick={handleClick}
    >
      <div className="relative p-6 h-full flex flex-col items-center justify-center text-center group">
        {isDraggable && onEdit && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Controls 
              cardId={id} 
              onEdit={() => onEdit(id)} 
              onDelete={onDelete} 
              isCustom={isCustom}
            />
          </div>
        )}
        
        {badgeCount !== undefined && badgeCount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badgeCount > 99 ? '99+' : badgeCount}
          </div>
        )}
        
        {children ? (
          <>{children}</>
        ) : (
          <>
            <div className="text-white mb-4">
              {Icon && <Icon className={iconSizeClass} />}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </>
        )}
      </div>
    </div>
  );

  return cardContent;
};

// Sortable version of the UnifiedActionCard
export const SortableUnifiedActionCard: React.FC<UnifiedActionCardProps & { index?: number }> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    height: '100%',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="w-full h-full"
    >
      <UnifiedActionCard {...props} />
    </div>
  );
};

export default UnifiedActionCard;
