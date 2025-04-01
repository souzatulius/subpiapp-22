
import { useNavigate } from 'react-router-dom';
import { Controls } from './SortableActionCard';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

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
    default: return 'bg-blue-500';
  }
};

const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm': return 'w-6 h-6';
    case 'md': return 'w-8 h-8';
    case 'lg': return 'w-12 h-12'; // Mobile size
    case 'xl': return 'w-16 h-16'; // Desktop size
    default: return 'w-16 h-16';
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
  iconSize = 'xl',
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
      className={`w-full h-full rounded-xl shadow-md overflow-hidden cursor-pointer 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${bgColor}`}
      onClick={path ? handleClick : undefined}
    >
      <div className="relative p-6 h-full flex flex-col items-center justify-center text-center group">
        {isDraggable && (onEdit || onHide) && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Controls 
              cardId={id} 
              onEdit={() => onEdit ? onEdit(id) : undefined} 
              onDelete={onDelete}
              onHide={onHide}
              isCustom={isCustom}
            />
          </div>
        )}
        
        {children ? (
          <>{children}</>
        ) : (
          <>
            <div className="text-white mb-4">
              {IconComponent && <IconComponent className={iconSizeClass} />}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
