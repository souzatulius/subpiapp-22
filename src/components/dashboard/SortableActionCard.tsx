
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionCard from '@/components/dashboard/ActionCard';
import { ActionCardItem } from './CardGrid';

interface SortableActionCardProps {
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

// Function to get width classes
export const getWidthClasses = (width: string = '25') => {
  switch (width) {
    case '25':
      return 'col-span-1';
    case '50':
      return 'col-span-1 md:col-span-2';
    case '75':
      return 'col-span-1 md:col-span-3';
    case '100':
      return 'col-span-1 md:col-span-4';
    default:
      return 'col-span-1';
  }
};

const SortableActionCard: React.FC<SortableActionCardProps> = ({ 
  card, 
  onEdit, 
  onDelete,
  children
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
    >
      {children ? (
        <div className="w-full h-full relative group">
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionCard.Controls 
              cardId={card.id} 
              onEdit={handleEdit} 
              onDelete={onDelete} 
              isCustom={card.isCustom}
            />
          </div>
          {children}
        </div>
      ) : (
        <ActionCard
          id={card.id}
          title={card.title}
          icon={card.icon}
          path={card.path}
          color={card.color}
          isDraggable={true}
          onDelete={onDelete}
          onEdit={handleEdit}
          width={card.width}
          height={card.height}
          isCustom={card.isCustom}
        />
      )}
    </div>
  );
};

export default SortableActionCard;
