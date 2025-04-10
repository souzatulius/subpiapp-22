
import React from 'react';
import { PencilLine, Trash2, EyeOff } from 'lucide-react';

export interface ControlsProps {
  cardId: string;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ cardId, onEdit, onDelete, onHide, isCustom = false }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(cardId);
        }}
        className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 hover:text-blue-800 transition-all"
        title="Editar card"
      >
        <PencilLine className="h-3.5 w-3.5" />
      </button>

      {onHide && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHide(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-orange-600 hover:text-orange-800 transition-all"
          title="Ocultar card"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      )}
      
      {isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 hover:text-red-600 transition-all"
          title="Excluir card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default Controls;
