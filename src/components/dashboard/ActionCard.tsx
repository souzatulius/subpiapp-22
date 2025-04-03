import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';

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
    case 'blue-light': return 'bg-blue-300';
    case 'green-light': return 'bg-green-300';
    case 'purple-light': return 'bg-purple-300';
    // New color mappings
    case 'gray-400': return 'bg-gray-400';
    case 'gray-800': return 'bg-gray-800';
    case 'gray-950': return 'bg-gray-950';
    case 'blue-700': return 'bg-blue-700';
    case 'blue-900': return 'bg-blue-900';
    case 'blue-960': return 'bg-blue-900';
    case 'orange-400': return 'bg-orange-400';
    case 'orange-500': return 'bg-orange-500';
    case 'gray-200': return 'bg-gray-200';
    case 'lime-500': return 'bg-lime-500';
    case 'neutral-200': return 'bg-gray-200';
    default: return 'bg-blue-500';
  }
};

const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm': return 'w-5 h-5';
    case 'md': return 'w-6 h-6';
    case 'lg': return 'w-8 h-8';
    case 'xl': return 'w-8 h-8';
    default: return 'w-6 h-6';  // Adjusted default size to be more compact
  }
};

const ActionCard = ({
  id,
  title,
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
  children
}: ActionCardProps) => {
  const navigate = useNavigate();
  const bgColor = getBackgroundColor(color);
  const IconComponent = getIconComponentFromId(iconId);
  const iconSizeClass = getIconSize(isMobileView ? 'lg' : iconSize);

  const handleClick = () => {
    if (path) navigate(path);
  };

  return (
    <div 
      className={`w-full h-[160px] rounded-xl shadow-md overflow-hidden cursor-pointer 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${bgColor} group`}
      onClick={path ? handleClick : undefined}
    >
      <div className="relative h-full flex flex-col items-center justify-center text-center py-4">
        {isDraggable && (
          <CardControls 
            onEdit={onEdit ? (e) => { 
              e.stopPropagation();
              if (onEdit) onEdit(id); 
            } : undefined} 
            onDelete={onDelete ? (e) => { 
              e.stopPropagation();
              if (onDelete) onDelete(id); 
            } : undefined}
          />
        )}
        
        {children ? (
          <>{children}</>
        ) : (
          <>
            <div className="text-white mb-2">
              {IconComponent && <IconComponent className={iconSizeClass} />}
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
