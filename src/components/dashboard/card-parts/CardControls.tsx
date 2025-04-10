import React from 'react';
import { Pencil, X, EyeOff } from 'lucide-react';
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
  return <div className="flex space-x-1 my-[10px] py-[10px] px-[10px]">
      {onEdit && <button className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors" onClick={e => {
      e.stopPropagation();
      onEdit();
    }} aria-label="Editar card">
          <Pencil className="h-4 w-4" />
        </button>}
      
      {onHide && <button className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 transition-colors" onClick={e => {
      e.stopPropagation();
      onHide();
    }} aria-label="Ocultar card">
          <EyeOff className="h-4 w-4" />
        </button>}
      
      {onDelete && <button className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors" onClick={e => {
      e.stopPropagation();
      onDelete();
    }} aria-label="Remover card">
          <X className="h-4 w-4" />
        </button>}
    </div>;
};
export default CardControls;