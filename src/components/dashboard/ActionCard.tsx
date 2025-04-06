import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { CardColor, CardWidth, CardHeight } from '@/types/dashboard';
import { CardControls } from './card-parts/CardControls';

export interface ActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor;
  isDraggable?: boolean;
  isCustom?: boolean;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  isMobileView?: boolean;
  showControls?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  children?: React.ReactNode;
}

const ActionCard = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  isDraggable = false,
  isCustom = false,
  onEdit,
  onDelete,
  onHide,
  iconSize = 'md',
  isMobileView = false,
  showControls = true,
  hasBadge = false,
  badgeValue,
  children
}: ActionCardProps) => {
  const navigate = useNavigate();
  
  // Determine if this is the Ranking da Zeladoria card to apply special styling
  const isRankingCard = id === 'ranking-zeladoria' || title.includes('Ranking');
  
  // Apply special text color for Ranking card
  const textColorClass = isRankingCard && color === 'gray-light' 
    ? 'text-gray-950' 
    : color === 'gray-light' || color === 'gray-lighter' 
      ? 'text-gray-800' 
      : 'text-white';
  
  // Apply special icon color for Ranking card
  const iconColorClass = isRankingCard && color === 'gray-light'
    ? 'text-gray-950'
    : color === 'gray-light' || color === 'gray-lighter'
      ? 'text-gray-700'
      : 'text-white';
  
  const handleCardClick = () => {
    if (path) {
      navigate(path);
    }
  };
  
  const IconRenderer = getIconComponentFromId(iconId);
  
  function getIconSizeClass(size: string): string {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      case 'xl': return 'h-8 w-8';
      default: return 'h-5 w-5';
    }
  }
  
  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden transition-all duration-200
        ${color === 'gray-light' || color === 'gray-lighter' ? 'border border-gray-200' : ''}
        ${isDraggable ? 'cursor-move' : path ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={handleCardClick}
    >
      <div
        className={`h-full flex flex-col justify-center p-4 bg-white
          ${getCardColorClass(color)}
        `}
      >
        <div className="flex items-center">
          {iconId && (
            <div className={`mr-3 ${iconColorClass} ${getIconSizeClass(iconSize)}`}>
              <IconRenderer iconId={iconId} className="h-full w-full" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-base font-semibold ${textColorClass} truncate`}
              title={title}
            >
              {title}
            </h3>
            
            {subtitle && (
              <p className={`text-sm mt-1 ${textColorClass} opacity-80 truncate`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {hasBadge && badgeValue && (
            <div className="ml-2 bg-white bg-opacity-25 rounded-full px-2 py-0.5 text-xs font-medium">
              {badgeValue}
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
      
      {showControls && isDraggable && onEdit && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          <CardControls 
            onEdit={onEdit} 
            onDelete={isCustom ? onDelete : undefined} 
            onHide={onHide}
          />
        </div>
      )}
    </div>
  );
};

function getCardColorClass(color: string): string {
  // Map colors to Tailwind CSS classes
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white';
    case 'blue-light': return 'bg-[#66B2FF] text-white';
    case 'blue-dark': return 'bg-[#1D4ED8] text-white';
    case 'green-neon': return 'bg-[#66FF66] text-gray-800';
    case 'green-dark': return 'bg-[#00CC00] text-white';
    case 'gray-light': return 'bg-white text-gray-800';
    case 'gray-lighter': return 'bg-gray-50 text-gray-800';
    case 'gray-medium': return 'bg-gray-200 text-gray-800';
    case 'orange-dark': return 'bg-[#F25C05] text-white';
    case 'orange-light': return 'bg-[#F89E66] text-white';
    case 'deep-blue': return 'bg-gray-950 text-white';  // Using gray-950 for 'deep-blue'
    default: return 'bg-blue-600 text-white';
  }
}

export default ActionCard;
