
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controls } from './SortableActionCard';

export interface ActionCardProps {
  id: string;
  title: string;
  icon: ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light' | 'lime' | 'orange-600';
  isDraggable?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2'; 
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isCustom?: boolean;
  type?: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  children?: ReactNode;
}

// Function to get background color based on the color prop
const getBackgroundColor = (color: string): string => {
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
    default:
      return 'bg-blue-500';
  }
};

const ActionCard = ({
  id,
  title,
  icon,
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

  return (
    <div 
      className={`w-full h-full rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bgColor}`}
      onClick={path ? handleClick : undefined}
    >
      <div className="relative p-6 h-full flex flex-col">
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
          children
        ) : (
          <>
            <div className="text-white mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
