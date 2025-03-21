
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { toast } from '@/hooks/use-toast';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import SortableActionCard from './SortableActionCard';

// Define action card data type
export interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light';
  isCustom?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
}

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  onCardsChange, 
  onEditCard, 
  onDeleteCard 
}) => {
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);
      
      // Create new array with the item moved
      const newCards = [...cards];
      const [movedItem] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedItem);
      
      onCardsChange(newCards);
      
      toast({
        title: "Cards reorganizados",
        description: "A nova ordem dos cards foi salva com sucesso.",
        variant: "success",
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map(card => card.id)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
          {cards.map((card) => (
            <SortableActionCard 
              key={card.id} 
              card={card} 
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
          
          {/* Add NotificationsEnabler after the cards */}
          <NotificationsEnabler />
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default CardGrid;
