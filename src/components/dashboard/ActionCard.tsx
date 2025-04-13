
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardColor } from '@/types/dashboard';
import { getBgColor } from '@/hooks/dashboard/defaultCards';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface ActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isDraggable?: boolean;
  isCustom?: boolean;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
  hasBadge?: boolean;
  badgeValue?: number;
  isMobileView?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  onEdit,
  onDelete,
  onHide,
  isDraggable = false,
  isCustom = false,
  iconSize = 'md',
  showControls = true,
  hasBadge = false,
  badgeValue = 0,
  isMobileView = false
}) => {
  const navigate = useNavigate();
  const IconComponent = getIconComponentFromId(iconId);
  
  const bgColorClass = color.startsWith('bg-') ? color : getBgColor(color);
  const textColorClass = color === 'bg-white' || color === 'gray-light' ? 'text-gray-800' : 'text-white';
  
  // Calculate icon size based on the iconSize prop
  const getIconSizeClass = (size: string) => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-10 h-10';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-10 h-10';
    }
  };
  
  const iconSizeClass = getIconSizeClass(iconSize);
  
  const handleCardClick = () => {
    if (path && !isDraggable) {
      navigate(path);
    } else if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <div 
      className={`h-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${bgColorClass}`}
      onClick={handleCardClick}
    >
      <div className="h-full w-full py-2.5 px-2 flex flex-col items-center justify-center">
        <div className="relative">
          {hasBadge && badgeValue > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {badgeValue > 99 ? '99+' : badgeValue}
            </div>
          )}
          {IconComponent && (
            <IconComponent className={`${iconSizeClass} ${textColorClass} mb-2`} />
          )}
        </div>
        <h3 className={`text-lg font-semibold text-center ${textColorClass} mt-1`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm text-center ${textColorClass} opacity-80 mt-0.5 px-2`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
