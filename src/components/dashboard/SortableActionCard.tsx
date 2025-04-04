
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionCard from '@/components/dashboard/ActionCard';
import { ActionCardItem } from '@/types/dashboard';
import { X, Pencil, EyeOff } from 'lucide-react';

interface SortableActionCardProps {
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  children?: React.ReactNode;
  isMobileView?: boolean;
}

// Control buttons component for card actions
export const Controls = ({
  cardId,
  onEdit,
  onDelete,
  onHide,
  isCustom,
}: {
  cardId: string;
  onEdit: () => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
}) => {
  return (
    <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
      <button 
        className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Editar card"
      >
        <Pencil className="h-4 w-4" />
      </button>
      {onHide && (
        <button 
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-orange-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onHide(cardId);
          }}
          aria-label="Ocultar card"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      )}
      {onDelete && isCustom && (
        <button 
          className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId);
          }}
          aria-label="Remover card"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const SortableActionCard: React.FC<SortableActionCardProps> = ({ 
  card, 
  onEdit, 
  onDelete,
  onHide,
  isMobileView = false,
  children
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    height: '100%',
  };

  const handleEdit = () => {
    onEdit(card);
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="w-full h-full"
    >
      {children ? (
        <div className="w-full h-full relative group cursor-pointer">
          <div 
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Controls 
              cardId={card.id} 
              onEdit={handleEdit} 
              onDelete={onDelete}
              onHide={onHide}
              isCustom={card.isCustom}
            />
          </div>
          {children}
        </div>
      ) : (
        <ActionCard
          id={card.id}
          title={card.title}
          iconId={card.iconId}
          path={card.path}
          color={card.color}
          isDraggable={true}
          onDelete={onDelete}
          onEdit={handleEdit}
          onHide={onHide}
          width={card.width}
          height={card.height}
          isCustom={card.isCustom}
          type={card.type}
          iconSize={isMobileView ? 'lg' : 'xl'}
          isMobileView={isMobileView}
        />
      )}
    </div>
  );
};

export default SortableActionCard;
