import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
    case 'blue-vivid':
      return 'bg-[#0066FF]'; // Azul Vivo
    case 'blue-light':
      return 'bg-[#66B2FF]'; // Azul Claro
    case 'blue-dark':
      return 'bg-[#1D4ED8]'; // Azul Escuro
    case 'green-neon':
      return 'bg-[#66FF66]'; // Verde Neon
    case 'green-dark':
      return 'bg-[#00CC00]'; // Verde Escuro
    case 'gray-light':
      return 'bg-[#F5F5F5]'; // Cinza Claro
    case 'gray-lighter':
      return 'bg-[#FAFAFA]'; // Cinza Mais Claro
    case 'gray-medium':
      return 'bg-[#D4D4D4]'; // Cinza Médio
    case 'orange-dark':
      return 'bg-[#F25C05]'; // Laranja Escuro
    case 'orange-light':
      return 'bg-[#F89E66]'; // Laranja Claro
    default:
      return 'bg-[#0066FF]'; // Default to Azul Vivo
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
  
  const renderIcon = () => {
    if (!iconId) return null;
    
    const LucideIcon = (LucideIcons as any)[iconId];
    if (LucideIcon) {
      return <LucideIcon className={getIconSize(iconSize)} />;
    }
    
    const FallbackIcon = getIconComponentFromId(iconId);
    return FallbackIcon ? <FallbackIcon className={getIconSize(iconSize)} /> : null;
  };
  
  const getTextColor = (bgColor: string): string => {
    if (color === 'gray-light' || color === 'gray-lighter' || color === 'gray-medium' || 
        color === 'green-neon' || color === 'green-dark') {
      return 'text-gray-800'; // Dark text for light backgrounds
    }
    return 'text-white'; // White text for dark backgrounds
  };
  
  const textColor = getTextColor(bgColor);

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        active:scale-95 ${bgColor} group relative`}
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

      <div className="relative h-full flex flex-col items-center justify-center text-center py-2.5 px-2">
        {children ? (
          <>{children}</>
        ) : (
          <>
            <div className={`mb-2.5 ${textColor}`}>
              {renderIcon()}
            </div>
            <div className="line-clamp-2 max-w-[90%]">
              <h3 className={`font-semibold ${textColor} text-lg leading-tight break-words text-balance`}>
                {title}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
