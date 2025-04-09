import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem } from '@/types/dashboard';
import ActionCard from './ActionCard';

export interface SortableActionCardProps {
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onDelete: (cardId: string) => void;
  isDraggable?: boolean;
  isMobileView?: boolean;
  specialContent?: React.ReactNode;
  disableWiggleEffect?: boolean;
  onSearchSubmit?: (query: string) => void;
  specialData?: any;
  showSpecialFeatures?: boolean;
}

const SortableActionCard: React.FC<SortableActionCardProps> = ({
  card,
  onEdit,
  onDelete,
  isDraggable = false,
  isMobileView = false,
  specialContent,
  disableWiggleEffect,
  onSearchSubmit,
  specialData,
  showSpecialFeatures
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const shouldWiggle = isDraggable && !disableWiggleEffect;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`${shouldWiggle ? 'animate-wiggle' : ''}`}
    >
      <ActionCard
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        isMobileView={isMobileView}
        specialContent={specialContent}
        onSearchSubmit={onSearchSubmit}
        specialData={specialData}
        showSpecialFeatures={showSpecialFeatures}
      />
    </div>
  );
};

export default SortableActionCard;
