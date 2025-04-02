
import React from 'react';
import { Card } from '@/components/ui/card';
import { ActionCardItem } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: ActionCardItem;
  className?: string;
  isDynamic?: boolean;
  children: React.ReactNode;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  className,
  isDynamic = false,
  children
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    // Add a visual indicator for drag
    e.currentTarget.classList.add('opacity-50');
    
    // If it's a dynamic card, add that info to the dataTransfer
    if (isDynamic) {
      e.dataTransfer.setData('card/type', 'dynamic');
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remove the visual indicator
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <Card className="border border-gray-200 h-full hover:border-blue-300">
        {children}
      </Card>
    </div>
  );
};

export default DraggableCard;
