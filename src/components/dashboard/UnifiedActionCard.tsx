import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import CardControls from './card-parts/CardControls';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface ActionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  iconId: string;
  path: string;
  color: CardColor;
  width?: string;
  height?: string;
  type?: string;
  isStandard?: boolean;
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
  isUserProfile?: boolean;
  isNotificationSettings?: boolean;
  isTaskCard?: boolean;
  isNewCardButton?: boolean;
  isCustom?: boolean;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  contentPadding?: string;
  contentClassname?: string;
  children?: React.ReactNode;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDraggable?: boolean;
  isEditing?: boolean;
  showSpecialFeatures?: boolean;
  disableWiggleEffect?: boolean;
  specialCardsData?: any;
  hasBadge?: boolean;
  badgeValue?: number;
  hasSubtitle?: boolean;
  isMobileView?: boolean;
  specialContent?: React.ReactNode;
}

export const UnifiedActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  subtitle,
  iconId,
  path,
  color = "blue-vivid",
  width,
  height,
  type = "standard",
  isStandard = true,
  isQuickDemand = false,
  isSearch = false,
  isPendingActions = false,
  isUserProfile = false,
  isNotificationSettings = false,
  isTaskCard = false,
  isNewCardButton = false,
  isCustom = false,
  iconSize = 'xl',
  contentPadding = 'p-4',
  contentClassname = '',
  children,
  quickDemandTitle = '',
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  onEdit,
  onDelete,
  onHide,
  onDragStart,
  onDragEnd,
  isDraggable = false,
  isEditing = false,
  showSpecialFeatures = true,
  disableWiggleEffect = false,
  specialCardsData,
  hasBadge = false,
  badgeValue = 0,
  hasSubtitle = false,
  isMobileView = false,
  specialContent
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const iconSizeClass = {
    'sm': 'h-5 w-5',
    'md': 'h-6 w-6',
    'lg': 'h-8 w-8',
    'xl': 'h-10 w-10',
    '2xl': 'h-12 w-12'
  }[iconSize] || 'h-10 w-10';
  const handleCardClick = () => {
    if (!path || isEditing) return;
    navigate(path);
  };

  let IconComponent: React.ElementType | null = null;
  if (iconId && (LucideIcons as any)[iconId]) {
    IconComponent = (LucideIcons as any)[iconId];
  } else if (iconId) {
    console.log('No icon found for:', iconId);
    IconComponent = (LucideIcons as any)['Layout']; // Default icon
  }

  const colorClasses: Record<string, {
    bg: string;
    text: string;
    hover: string;
  }> = {
    'blue-vivid': {
      bg: 'bg-[#0066FF]',
      text: 'text-white',
      hover: 'hover:bg-[#0055dd]'
    },
    'blue-light': {
      bg: 'bg-[#66B2FF]',
      text: 'text-white',
      hover: 'hover:bg-[#55a1ee]'
    },
    'blue-dark': {
      bg: 'bg-[#1D4ED8]',
      text: 'text-white',
      hover: 'hover:bg-[#1c3dc7]'
    },
    'green-neon': {
      bg: 'bg-[#66FF66]',
      text: 'text-gray-900',
      hover: 'hover:bg-[#55ee55]'
    },
    'green-dark': {
      bg: 'bg-[#00CC00]',
      text: 'text-white',
      hover: 'hover:bg-[#00bb00]'
    },
    'gray-light': {
      bg: 'bg-[#F5F5F5]',
      text: 'text-gray-900',
      hover: 'hover:bg-[#e5e5e5]'
    },
    'gray-medium': {
      bg: 'bg-[#D4D4D4]',
      text: 'text-gray-900',
      hover: 'hover:bg-[#c4c4c4]'
    },
    'orange-dark': {
      bg: 'bg-[#F25C05]',
      text: 'text-white',
      hover: 'hover:bg-[#e24b04]'
    },
    'orange-light': {
      bg: 'bg-[#F89E66]',
      text: 'text-white',
      hover: 'hover:bg-[#e78d55]'
    },
    'deep-blue': {
      bg: 'bg-[#051A2C]',
      text: 'text-white',
      hover: 'hover:bg-[#04162a]'
    },
    'neutral-800': {
      bg: 'bg-neutral-800',
      text: 'text-white',
      hover: 'hover:bg-neutral-700'
    }
  };

  const {
    bg = 'bg-blue-500',
    text = 'text-white',
    hover = 'hover:bg-blue-600'
  } = colorClasses[color as string] || {};
  const cardBodyClassNames = cn("h-full w-full rounded-xl transition-all border border-gray-200 relative overflow-hidden group", contentClassname, bg, text, hover);

  const renderCardContent = () => {
    if (children) {
      return children;
    }

    if (specialContent) {
      return specialContent;
    }

    return <div className="flex flex-col items-center justify-center h-full py-10">
      {IconComponent && <div className="mb-4">
        <IconComponent className={iconSizeClass} />
      </div>}
      
      <div className="text-center">
        <h3 className="text-lg font-bold">{title}</h3>
        {hasSubtitle && subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
      </div>
    </div>;
  };

  return <div className="h-full w-full cursor-pointer" onClick={handleCardClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    <div className={cardBodyClassNames}>
      {(isHovered || isEditing) && !isMobileView && onEdit && <div className="absolute top-2 right-2 z-10 bg-white/10 backdrop-blur-sm rounded-full px-1 py-1 flex gap-1">
        <CardControls onEdit={() => onEdit(id)} onHide={onHide ? () => onHide(id) : undefined} />
      </div>}
      
      {hasBadge && badgeValue > 0 && <div className="absolute top-2 left-2">
        <Badge variant="destructive" className="rounded-full px-2">
          {badgeValue}
        </Badge>
      </div>}
      
      {renderCardContent()}
    </div>
  </div>;
};

export const SortableUnifiedActionCard: React.FC<ActionCardProps> = props => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props.id,
    disabled: !props.isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };

  const dragEffectClass = !props.disableWiggleEffect && props.isDraggable ? "hover:-rotate-1 hover:-translate-y-1" : "";

  return <div ref={setNodeRef} style={style} className={`h-full transition-all duration-200 ${dragEffectClass}`} {...attributes} {...listeners}>
    <UnifiedActionCard {...props} />
  </div>;
};

export default UnifiedActionCard;
