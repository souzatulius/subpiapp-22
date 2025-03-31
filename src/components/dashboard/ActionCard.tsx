import { useNavigate } from 'react-router-dom';
import { Controls } from './SortableActionCard';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

export interface ActionCardProps {
  id: string;
  title: string;
  iconId: string; // ✅ Alterado
  path: string;
  color: CardColor;
  isDraggable?: boolean;
  width?: CardWidth;
  height?: CardHeight;
  type?: CardType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isCustom?: boolean;
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  children?: React.ReactNode;
}

// Function to get background color based on the color prop
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

const ActionCard = ({
  id,
  title,
  iconId,
  path,
  color,
  isDraggable = false,
  onEdit,
  onDelete,
  isCustom = false,
  children
}: ActionCardProps) => {
  const navigate = useNavigate();
  const bgColor = getBackgroundColor(color);

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  const Icon = getIconComponentFromId(iconId);

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bgColor}`}
      onClick={path ? handleClick : undefined}
    >
      <div className="relative p-6 h-full flex flex-col group">
        {isDraggable && onEdit && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Controls 
              cardId={id} 
              onEdit={() => onEdit(id)} 
              onDelete={onDelete} 
              isCustom={isCustom}
            />
          </div>
        )}
        
        {children ? (
          <>{children}</>
        ) : (
          <>
            <div className="text-white mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
