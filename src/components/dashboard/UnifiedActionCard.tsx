
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionCard from './ActionCard';
import DashboardSearchCard from './DashboardSearchCard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { CardColor, CardType, CardWidth, CardHeight } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import PendingActionsCard from './cards/PendingActionsCard';

interface SortableUnifiedActionCardProps {
  id: string;
  title: string;
  iconId: string;
  path: string;
  color: CardColor;
  isDraggable?: boolean;
  isEditing?: boolean;
  width?: CardWidth;
  height?: CardHeight;
  type?: CardType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  disableWiggleEffect?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isOverdueDemands?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  isCustom?: boolean;
  hasBadge?: boolean;
  badgeValue?: number;
  hasSubtitle?: boolean;
  subtitle?: string; 
  isMobileView?: boolean;
  specialContent?: React.ReactNode;
}

export const SortableUnifiedActionCard: React.FC<SortableUnifiedActionCardProps> = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  isDraggable = true,
  isEditing = false,
  width,
  height,
  type,
  onEdit,
  onDelete,
  onHide,
  iconSize = 'md',
  disableWiggleEffect = true,
  isQuickDemand = false,
  isSearch = false,
  isOverdueDemands = false,
  showSpecialFeatures = true,
  quickDemandTitle = '',
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {},
  specialCardsData = null,
  isCustom = false,
  hasBadge = false,
  badgeValue = 0,
  hasSubtitle = false,
  isMobileView = false,
  specialContent
}) => {
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: !isDraggable || isEditing });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };
  
  const handleClick = () => {
    if (isEditing || !path || isDragging || isQuickDemand || isSearch) return;
    navigate(path);
  };
  
  const renderContent = () => {
    if (!showSpecialFeatures) {
      return null;
    }
    
    // Return specialized content if provided
    if (specialContent) {
      return specialContent;
    }
    
    // Search card
    if (isSearch || type === 'smart_search') {
      return <DashboardSearchCard onSearch={onSearchSubmit} isEditMode={isEditing} />;
    }
    
    // Pending Actions card
    if (type === 'in_progress_demands' || id === 'pending-actions-card') {
      return (
        <PendingActionsCard 
          id={id}
          notesToApprove={specialCardsData?.notesToApprove || 0}
          responsesToDo={specialCardsData?.responsesToDo || 0}
          isComunicacao={specialCardsData?.isComunicacao || false}
          userDepartmentId={specialCardsData?.coordenacaoId || ''}
        />
      );
    }
    
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full h-full ${!disableWiggleEffect && !isEditing ? 'hover:wiggle' : ''}`}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <ActionCard
        id={id}
        title={title}
        subtitle={subtitle}
        iconId={iconId}
        path={path}
        color={color}
        isDraggable={isDraggable && !isEditing}
        onEdit={isEditing && onEdit ? () => onEdit(id) : undefined}
        onDelete={isEditing && onDelete ? () => onDelete(id) : undefined}
        onHide={isEditing && onHide ? () => onHide(id) : undefined}
        isCustom={isCustom}
        iconSize={iconSize}
        isMobileView={isMobileView}
        showControls={isEditing}
        specialContent={renderContent()}
      />
    </div>
  );
};
