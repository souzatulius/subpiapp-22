import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Pencil, X, Eye } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { getBackgroundColorClass, getCardHeightClass } from './CardStyles';
import { QuickDemandForm } from './quick-demand/QuickDemandForm';
import SearchDemandForm from './search/SearchDemandForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface DragHandleProps {
  attributes: any;
  listeners: any;
}

interface UnifiedActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: string;
  width: string;
  height: string;
  isDraggable: boolean;
  isEditing: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  disableWiggleEffect?: boolean;
  children?: React.ReactNode;
  type?: string;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  isCustom?: boolean;
  hasBadge?: boolean;
  badgeValue?: string;
  hasSubtitle?: boolean;
  isMobileView?: boolean;
  textColor?: string;
  dragHandleProps?: DragHandleProps;
}

interface SortableUnifiedActionCardProps extends UnifiedActionCardProps {
  dragHandleProps?: DragHandleProps;
}

const UnifiedActionCard = React.forwardRef<HTMLDivElement, UnifiedActionCardProps>(
  (
    {
      id,
      title,
      subtitle,
      iconId,
      path,
      color,
      width,
      height,
      isDraggable,
      isEditing,
      onEdit,
      onDelete,
      onHide,
      iconSize,
      disableWiggleEffect,
      children,
      type,
      isQuickDemand,
      isSearch,
      showSpecialFeatures,
      quickDemandTitle,
      onQuickDemandTitleChange,
      onQuickDemandSubmit,
      onSearchSubmit,
      specialCardsData,
      isCustom,
      hasBadge,
      badgeValue,
      hasSubtitle,
      isMobileView,
      textColor,
      dragHandleProps
    },
    ref
  ) => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const IconComponent = iconId ? getIconComponentFromId(iconId) : null;
    const backgroundColorClass = getBackgroundColorClass(color);
    const cardHeightClass = getCardHeightClass(height);
    const cardContentPadding = isMobileView ? 'p-3' : 'p-4';
    const titleFontSize = isMobileView ? 'text-sm' : 'text-base';
    const subtitleFontSize = isMobileView ? 'text-xs' : 'text-sm';
    const iconSizeClass = isMobileView ? 'w-5 h-5' : 'w-6 h-6';

    // Get icon component from ID
    function getIconComponentFromId(iconId: string) {
      const IconMap = {
        'clipboard-list': () => import('lucide-react').then(mod => mod.ClipboardList),
        'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
        'file-check': () => import('lucide-react').then(mod => mod.FileCheck),
        'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
        'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
        'search': () => import('lucide-react').then(mod => mod.Search),
        'clock': () => import('lucide-react').then(mod => mod.Clock),
        'alert-triangle': () => import('lucide-react').then(mod => mod.AlertTriangle),
        'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
        'file-text': () => import('lucide-react').then(mod => mod.FileText),
        'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
        'communication': () => import('lucide-react').then(mod => mod.MessageSquare),
        'list-bullet': () => import('lucide-react').then(mod => mod.List),
        'chat-bubble-left-right': () => import('lucide-react').then(mod => mod.MessageCircle),
        'document-plus': () => import('lucide-react').then(mod => mod.FileText),
        'document-text': () => import('lucide-react').then(mod => mod.FileText),
        'trophy': () => import('lucide-react').then(mod => mod.Trophy)
        // Add more icons as needed
      };

      const LoadedIcon = React.lazy(() =>
        IconMap[iconId]?.() || import('lucide-react').then(mod => ({ default: mod.ClipboardList }))
      );

      return (props: any) => (
        <React.Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
          <LoadedIcon {...props} />
        </React.Suspense>
      );
    }

    const cardContent = (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {IconComponent && (
              <IconComponent className={cn(iconSizeClass, "mr-2", textColor)} />
            )}
            <div className="flex flex-col">
              <h3 className={cn("font-medium line-clamp-1", titleFontSize, textColor)}>{title}</h3>
              {hasSubtitle && subtitle && (
                <p className={cn("text-gray-500 line-clamp-1", subtitleFontSize)}>{subtitle}</p>
              )}
            </div>
          </div>
          {hasBadge && badgeValue && (
            <span className="px-2 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-full whitespace-nowrap">
              {badgeValue}
            </span>
          )}
        </div>
        <div className="flex-grow flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    );

    const renderCardContent = () => {
      if (isQuickDemand) {
        return (
          <QuickDemandForm
            title={quickDemandTitle}
            onChange={onQuickDemandTitleChange}
            onSubmit={onQuickDemandSubmit}
          />
        );
      }

      if (isSearch) {
        return (
          <SearchDemandForm
            onSearchSubmit={onSearchSubmit}
          />
        );
      }

      return cardContent;
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "relative flex flex-col justify-between overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md",
          backgroundColorClass,
          cardHeightClass,
          isDraggable ? 'cursor-grab active:cursor-grabbing' : '',
          isEditing && !disableWiggleEffect ? 'animate-wiggle' : ''
        )}
      >
        {showSpecialFeatures && isEditing && (
          <div className="absolute top-2 right-2 z-10 flex space-x-1.5">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onHide && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHide(id);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Esconder"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onDelete && isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                aria-label="Excluir"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        <div
          className={cn(
            "h-full flex flex-col justify-center",
            cardContentPadding,
            isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
          )}
          {...(dragHandleProps?.attributes || {})}
          {...(dragHandleProps?.listeners || {})}
          onClick={() => {
            if (path && !isEditing && !isQuickDemand && !isSearch) {
              navigate(path);
            }
          }}
        >
          {renderCardContent()}
        </div>
      </Card>
    );
  }
);

UnifiedActionCard.displayName = "UnifiedActionCard";

export const SortableUnifiedActionCard = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  width,
  height,
  isDraggable = true,
  isEditing = false,
  onEdit,
  onDelete,
  onHide,
  iconSize = 'xl',
  disableWiggleEffect = false,
  children,
  type,
  isQuickDemand,
  isSearch,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  isCustom,
  hasBadge,
  badgeValue,
  hasSubtitle,
  isMobileView,
  textColor = ''
}: SortableUnifiedActionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    disabled: !isDraggable || isEditing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    position: isDragging ? 'relative' : 'static',
    opacity: isDragging ? 0.8 : 1
  } as React.CSSProperties;

  return (
    <UnifiedActionCard
      ref={setNodeRef}
      style={style}
      id={id}
      title={title}
      subtitle={subtitle}
      iconId={iconId}
      path={path}
      color={color}
      width={width}
      height={height}
      isDraggable={isDraggable}
      isEditing={isEditing}
      onEdit={onEdit}
      onDelete={onDelete}
      onHide={onHide}
      iconSize={iconSize}
      disableWiggleEffect={disableWiggleEffect}
      type={type}
      isQuickDemand={isQuickDemand}
      isSearch={isSearch}
      showSpecialFeatures={showSpecialFeatures}
      quickDemandTitle={quickDemandTitle}
      onQuickDemandTitleChange={onQuickDemandTitleChange}
      onQuickDemandSubmit={onQuickDemandSubmit}
      onSearchSubmit={onSearchSubmit}
      specialCardsData={specialCardsData}
      isCustom={isCustom}
      hasBadge={hasBadge}
      badgeValue={badgeValue}
      hasSubtitle={hasSubtitle}
      isMobileView={isMobileView}
      textColor={textColor}
      dragHandleProps={{
        ...attributes,
        ...listeners
      }}
    >
      {children}
    </UnifiedActionCard>
  );
};
