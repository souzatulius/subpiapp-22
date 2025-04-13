
import React from 'react';
import { Pencil, EyeOff } from 'lucide-react';

interface CardControlsProps {
  onDelete?: () => void;
  onEdit?: () => void;
  onHide?: () => void;
}

const CardControls: React.FC<CardControlsProps> = ({
  onDelete,
  onEdit,
  onHide
}) => {
  return (
    <div className="flex space-x-1 px-[10px] my-0 py-0">
      {onEdit && (
        <button 
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors" 
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Editar card"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      
      {onHide && (
        <button 
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 transition-colors" 
          onClick={e => {
            e.stopPropagation();
            onHide();
          }}
          aria-label="Ocultar card"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CardControls;
