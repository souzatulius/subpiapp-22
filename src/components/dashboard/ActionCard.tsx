import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon } from 'lucide-react';
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
}
const getBackgroundColor = (color: CardColor): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-500';
    case 'green':
      return 'bg-green-500';
    case 'orange':
      return 'bg-orange-500';
    case 'gray-light':
      return 'bg-gray-200';
    case 'gray-dark':
      return 'bg-gray-700';
    case 'blue-dark':
      return 'bg-blue-700';
    case 'orange-light':
      return 'bg-orange-300';
    case 'gray-ultra-light':
      return 'bg-gray-100';
    case 'lime':
      return 'bg-lime-500';
    case 'orange-600':
      return 'bg-orange-600';
    case 'blue-light':
      return 'bg-blue-300';
    case 'green-light':
      return 'bg-green-300';
    case 'purple-light':
      return 'bg-purple-300';
    case 'gray-400':
      return 'bg-gray-400';
    case 'gray-800':
      return 'bg-gray-800';
    case 'gray-950':
      return 'bg-gray-950';
    case 'blue-700':
      return 'bg-blue-700';
    case 'blue-900':
      return 'bg-blue-900';
    case 'blue-960':
      return 'bg-blue-900';
    case 'orange-400':
      return 'bg-orange-400';
    case 'orange-500':
      return 'bg-orange-500';
    case 'gray-200':
      return 'bg-gray-200';
    case 'lime-500':
      return 'bg-lime-500';
    case 'neutral-200':
      return 'bg-gray-200';
    default:
      return 'bg-blue-500';
  }
};
const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  return 'w-10 h-10';
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
  children,
  showControls = true
}: ActionCardProps) => {
  const navigate = useNavigate();
  const bgColor = getBackgroundColor(color);
  const IconComponent = getIconComponentFromId(iconId);
  const iconSizeClass = getIconSize();
  return <div className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${bgColor} group relative`}>
      {isDraggable && <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="p-1.5 rounded-full bg-white bg-opacity-60 text-gray-600">
            <MoveIcon className="h-3.5 w-3.5" />
          </div>
        </div>}

      {showControls && (onEdit || onDelete || onHide) && <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CardControls onEdit={onEdit ? () => onEdit(id) : undefined} onDelete={onDelete ? () => onDelete(id) : undefined} onHide={onHide ? () => onHide(id) : undefined} />
        </div>}

      <div className="relative h-full flex flex-col items-center justify-center text-center py-3 px-2">
        {children ? <>{children}</> : <>
            <div className="text-white mb-3">
              {IconComponent && <IconComponent className={iconSizeClass} />}
            </div>
            <div className="line-clamp-2 max-w-[90%]">
              <h3 className="font-semibold text-white text-lg leading-tight break-words text-balance py-0">
                {title}
              </h3>
            </div>
          </>}
      </div>
    </div>;
};
export default ActionCard;