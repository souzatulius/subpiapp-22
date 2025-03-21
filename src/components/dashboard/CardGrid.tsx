
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { toast } from '@/hooks/use-toast';
import CardsContainer from './grid/CardsContainer';
import { ActionCardItem } from '@/hooks/dashboard/types';

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard: () => void;
  // New props for special cards
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  // Special cards data
  specialCardsData?: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  onCardsChange, 
  onEditCard, 
  onDeleteCard,
  onAddNewCard,
  quickDemandTitle = "",
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {},
  specialCardsData = {
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  }
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
      <CardsContainer 
        cards={cards}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        onAddNewCard={onAddNewCard}
        quickDemandTitle={quickDemandTitle}
        onQuickDemandTitleChange={onQuickDemandTitleChange}
        onQuickDemandSubmit={onQuickDemandSubmit}
        onSearchSubmit={onSearchSubmit}
        specialCardsData={specialCardsData}
      />
    </DndContext>
  );
};

export default CardGrid;
