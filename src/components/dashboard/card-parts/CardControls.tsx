
import React from 'react';
import { X, Pencil } from 'lucide-react';

interface CardControlsProps {
  onDelete?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
}

const CardControls: React.FC<CardControlsProps> = ({ onDelete, onEdit }) => {
  return (
    <>
      {onDelete && (
        <button 
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={onDelete}
          aria-label="Remover card"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button 
          className="absolute top-2 right-8 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={onEdit}
          aria-label="Editar card"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </>
  );
};

export default CardControls;
