
import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon } from 'lucide-react';
import { getColorClasses, getTextColorClass } from './utils/cardColorUtils';

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
  const bgColorClass = getColorClasses(color);
  const IconComponent = getIconComponentFromId(iconId);
  const iconSizeClass = getIconSize();
  const textColorClass = getTextColorClass(color);

  return <div className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${bgColorClass} group relative`}>
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
            <div className={`mb-3 ${textColorClass}`}>
              {IconComponent && <IconComponent className={iconSizeClass} />}
            </div>
            <div className="line-clamp-2 max-w-[90%]">
              <h3 className={`font-semibold ${textColorClass} text-lg leading-tight break-words text-balance`}>
                {title}
              </h3>
            </div>
          </>}
      </div>
    </div>;
};

export default ActionCard;
