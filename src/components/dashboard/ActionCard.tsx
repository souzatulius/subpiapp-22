
import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getColorClasses, getTextColorClass } from './utils/cardColorUtils';
import ChartPreview from './charts/ChartPreview';
import { memo } from 'react';
import NotesApprovalCard from './cards/NotesApprovalCard';
import PendingDemandsCard from './cards/PendingDemandsCard';

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
    case 'sm':
      return 'w-6 h-6';
    case 'lg':
      return 'w-10 h-10';
    case 'xl':
      return 'w-10 h-10';
    case 'md':
    default:
      return 'w-10 h-10';
  }
};

const ActionCard = memo(({
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
  specialContent
}: ActionCardProps) => {
  const navigate = useNavigate();
  const colorClasses = getColorClasses(color);
  const textColorClass = getTextColorClass(color, id);
  
  // Function to check if title has more than 2 words for line break
  const hasMultipleWords = (text: string) => {
    const words = text?.trim().split(/\s+/) || [];
    return words.length > 2;
  };
  
  const renderIcon = () => {
    if (!iconId) return null;
    
    // Special case for search icon in busca-rapida card
    if (id === 'busca-rapida') {
      return <Search className="h-10 w-10 text-white" />;
    }
    
    // All these cards should use white icons
    const useWhiteIcon = ['comunicacao', 'perfil-usuario', 'ajustes-notificacao', 'ajustes-notificacoes'].includes(id);
    const iconColorClass = useWhiteIcon ? "text-white" : textColorClass;
    
    const LucideIcon = (LucideIcons as any)[iconId];
    if (LucideIcon) {
      return <LucideIcon className={`${getIconSize(iconSize)} ${iconColorClass}`} />;
    }
    
    const FallbackIcon = getIconComponentFromId(iconId);
    return FallbackIcon ? <FallbackIcon className={`${getIconSize(iconSize)} ${iconColorClass}`} /> : null;
  };

  // Special treatment for specific cards
  const isNotesApprovalCard = id === 'aprovar-notas';
  const isPendingDemandsCard = id === 'responder-demandas';
  
  // Update text color for specific cards
  let titleTextClass = textColorClass;
  if (id === 'aprovar-notas-imprensa' || id === 'aprovar-notas') {
    titleTextClass = textColorClass; // Match text color to icon color
  }
  if (id === 'noticias-site') {
    titleTextClass = textColorClass; // Match text color to icon color
  }

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        hover:shadow-lg ${colorClasses} group relative`}
    >
      {isDraggable && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="p-1.5 rounded-full bg-white bg-opacity-60 text-gray-600">
            <MoveIcon className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {showControls && (onEdit || onDelete || onHide) && (
        <div className="absolute top-2 right-2 z-10">
          <CardControls
            id={id}
            onEdit={onEdit}
            onDelete={onDelete}
            onHide={onHide}
          />
        </div>
      )}

      {/* If this is a special card, render it differently */}
      {isNotesApprovalCard && type === 'special' ? (
        <NotesApprovalCard />
      ) : isPendingDemandsCard && type === 'special' ? (
        <PendingDemandsCard />
      ) : chartId ? (
        <ChartPreview chartId={chartId} />
      ) : specialContent ? (
        <div className="h-full w-full">
          {specialContent}
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center p-6 text-center h-full"
          onClick={() => {
            if (path && !isDraggable) {
              navigate(path);
            }
          }}
        >
          {renderIcon()}
          
          <div className="mt-4 flex-1 flex flex-col justify-center">
            <h3 className={`font-semibold text-lg ${hasMultipleWords(title) ? 'line-clamp-2' : ''} ${titleTextClass}`}>
              {title}
            </h3>
            
            {subtitle && (
              <p className={`mt-1 text-sm ${textColorClass} opacity-80`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {children}
        </div>
      )}
    </div>
  );
});

export default ActionCard;
