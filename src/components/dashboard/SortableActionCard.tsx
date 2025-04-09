
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionCard, { ActionCardProps } from './ActionCard';
import { ActionCardItem } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

type SortableActionCardProps = {
  card: ActionCardItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDraggable?: boolean;
  isMobileView?: boolean;
  children?: React.ReactNode;
  specialContent?: React.ReactNode;
};

const SortableActionCard: React.FC<SortableActionCardProps> = ({
  card,
  onEdit,
  onDelete,
  isDraggable = false,
  isMobileView = false,
  children,
  specialContent
}) => {
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (isDraggable || !card.path) return; // No navigation in edit mode
    navigate(card.path);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
      className="w-full h-full"
    >
      <ActionCard
        id={card.id}
        title={card.title}
        subtitle={card.subtitle}
        iconId={card.iconId}
        path={card.path}
        color={card.color}
        isDraggable={isDraggable}
        onEdit={onEdit ? () => onEdit(card.id) : undefined}
        onDelete={onDelete ? () => onDelete(card.id) : undefined}
        isCustom={card.isCustom}
        isMobileView={isMobileView}
        chartId={card.chartId}
        specialContent={specialContent}
      >
        {children}
      </ActionCard>
    </div>
  );
};

export default SortableActionCard;
