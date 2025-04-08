
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getColorClasses, getTextColorClass } from './utils/cardColorUtils';
import ChartPreview from './charts/ChartPreview';
import { LucideIcon } from 'lucide-react';

export interface ActionCardProps {
  id: string;
  title: string;
  iconId: string;
  path: string;
  color: CardColor;
  isDraggable?: boolean;
  width?: CardWidth;
  height?: CardHeight;
  type?: CardType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  children?: React.ReactNode;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  isMobileView?: boolean;
  showControls?: boolean;
  subtitle?: string;
  chartId?: string;
  specialContent?: React.ReactNode;
}

const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm': return 'w-6 h-6';
    case 'lg': return 'w-12 h-12';
    case 'xl': return 'w-16 h-16';
    case 'md':
    default: return 'w-10 h-10';
  }
};

const getMinHeight = (type?: CardType, height?: CardHeight): string => {
  if (height) {
    switch (height) {
      case '0.5': return 'min-h-[5rem]';
      case '1': return 'min-h-[10rem]';
      case '2': return 'min-h-[16rem]';
      case '3': return 'min-h-[24rem]';
      case '4': return 'min-h-[32rem]';
      default: return 'min-h-[10rem]';
    }
  }
  
  if (type === 'data_dynamic' || type === 'in_progress_demands') {
    return 'min-h-[16rem]';
  }

  if (type === 'smart_search') {
    return 'min-h-[5rem]';
  }
  
  return 'min-h-[10rem]';
};

const ActionCard = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  isDraggable = false,
  onEdit,
  onDelete,
  onHide,
  isCustom = false,
  iconSize = 'md',
  isMobileView = false,
  children,
  showControls = true,
  chartId,
  type,
  height,
  specialContent
}: ActionCardProps) => {
  const navigate = useNavigate();
  const colorClasses = getColorClasses(color);
  const textColorClass = getTextColorClass(color, id);
  
  const renderIcon = () => {
    if (!iconId) return null;
    
    const LucideIcon = (LucideIcons as any)[iconId] as LucideIcon | undefined;
    if (LucideIcon) {
      const IconComponent = LucideIcon;
      return <IconComponent className={getIconSize(iconSize)} />;
    }
    
    const IconComponent = getIconComponentFromId(iconId);
    if (IconComponent) {
      return <IconComponent className={getIconSize(iconSize)} />;
    }
    
    return null;
  };

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${colorClasses} group relative
        ${getMinHeight(type, height)}`}
    >
      {isDraggable && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="p-1.5 rounded-full bg-white bg-opacity-60 text-gray-600">
            <MoveIcon className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {showControls && (onEdit || onDelete || onHide) && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CardControls 
            onEdit={onEdit ? () => onEdit(id) : undefined} 
            onDelete={onDelete ? () => onDelete(id) : undefined} 
            onHide={onHide ? () => onHide(id) : undefined} 
          />
        </div>
      )}

      <div className="relative h-full flex flex-col items-center justify-center text-center py-6 px-4">
        {specialContent ? (
          <div className="w-full h-full">{specialContent}</div>
        ) : children ? (
          <div className="w-full h-full">{children}</div>
        ) : chartId ? (
          <div className="w-full h-full flex flex-col">
            <ChartPreview chartId={chartId} />
          </div>
        ) : (
          <>
            <div className={`mb-3 ${textColorClass}`}>
              {renderIcon()}
            </div>
            <div className="line-clamp-2 max-w-[90%]">
              <h3 className={`font-semibold ${textColorClass} text-lg leading-tight break-words text-balance`}>
                {title}
              </h3>
              {subtitle && (
                <p className={`text-sm ${textColorClass} opacity-80 mt-2 line-clamp-2`}>
                  {subtitle}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
