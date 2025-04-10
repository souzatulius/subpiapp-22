
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContentProps } from './types';
import UnifiedActionCardContent from './UnifiedActionCardContent';

export interface SortableCardWrapperProps extends CardContentProps {
  disableWiggleEffect?: boolean;
}

export function SortableCardWrapper(props: SortableCardWrapperProps) {
  const {
    id,
    isDraggable = false,
    isEditing = false,
    disableWiggleEffect = true,
    ...rest
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animation: disableWiggleEffect ? 'none' : undefined,
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`h-full ${isDragging ? 'opacity-80' : ''}`}
      {...attributes}
      {...listeners}
    >
      <UnifiedActionCardContent 
        id={id} 
        sortableProps={isDraggable ? { attributes, listeners } : undefined} 
        isEditing={isEditing}
        disableWiggleEffect={disableWiggleEffect}
        {...rest} 
      />
    </div>
  );
}

export default SortableCardWrapper;
