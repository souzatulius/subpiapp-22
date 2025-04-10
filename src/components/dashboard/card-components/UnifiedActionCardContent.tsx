
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveIcon } from 'lucide-react';
import CardControls from '../card-parts/CardControls';
import { getColorClasses, getTextColorClass } from '../utils/cardColorUtils';
import { CardContentProps } from './types';
import CardRenderer from './CardRenderer';
import IconRenderer from './IconRenderer';

export function UnifiedActionCardContent({
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
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  hasBadge,
  badgeValue,
  hasSubtitle,
  contentClassname = '',
  isPendingActions,
  isUserProfile,
  isNotificationSettings,
  specialContent,
  children,
  chartId
}: CardContentProps) {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (path && !isEditing && !isUserProfile && !isNotificationSettings) {
      navigate(path);
    }
  };
  
  const colorClasses = getColorClasses(color);
  const textColorClass = getTextColorClass(color, id);
  
  const renderIcon = () => {
    return <IconRenderer iconId={iconId} iconSize={iconSize} />;
  };

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isEditing ? 'cursor-pointer' : 'cursor-grab'} 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${colorClasses} group relative ${contentClassname} ${
        specialContent ? 'overflow-hidden rounded-xl' : ''
      }`} 
      onClick={isEditing ? undefined : handleCardClick}
    >
      {sortableProps && isEditing && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="p-1.5 rounded-full bg-white bg-opacity-60 text-gray-600">
            <MoveIcon className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      <div className="relative h-full flex flex-col items-center justify-center text-center py-2.5 px-2">
        <CardRenderer
          textColorClass={textColorClass}
          renderIcon={renderIcon}
          title={title}
          subtitle={subtitle}
          specialContent={specialContent}
          children={children}
          chartId={chartId}
        />
      </div>
      
      {(isEditing || onEdit) && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CardControls 
            onEdit={onEdit ? () => onEdit(id) : undefined}
            onDelete={onDelete ? () => onDelete(id) : undefined}
            onHide={onHide ? () => onHide(id) : undefined}
          />
        </div>
      )}
    </div>
  );
}

export default UnifiedActionCardContent;
