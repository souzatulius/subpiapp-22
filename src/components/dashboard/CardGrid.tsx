
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { toast } from '@/hooks/use-toast';
import NotificationsEnabler from '@/components/notifications/NotificationsEnabler';
import SortableActionCard from './SortableActionCard';
import QuickDemandCard from './QuickDemandCard';
import SmartSearchCard from './SmartSearchCard';
import OverdueDemandsCard from './cards/OverdueDemandsCard';
import PendingActionsCard from './cards/PendingActionsCard';

// Define action card data type
export interface ActionCardItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light';
  isCustom?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
}

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
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
      <SortableContext items={cards.map(card => card.id)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
          {cards.map((card) => {
            // Check for special card types
            if (card.isQuickDemand) {
              return (
                <div 
                  key={card.id}
                  className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
                >
                  <QuickDemandCard 
                    title={card.title}
                    value={quickDemandTitle}
                    onChange={onQuickDemandTitleChange}
                    onSubmit={onQuickDemandSubmit}
                  />
                </div>
              );
            }
            
            if (card.isSearch) {
              return (
                <div 
                  key={card.id}
                  className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
                >
                  <SmartSearchCard
                    placeholder={card.title}
                    onSearch={onSearchSubmit}
                  />
                </div>
              );
            }
            
            if (card.isOverdueDemands) {
              return (
                <div 
                  key={card.id}
                  className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
                >
                  <OverdueDemandsCard
                    id={card.id}
                    overdueCount={specialCardsData.overdueCount}
                    overdueItems={specialCardsData.overdueItems}
                  />
                </div>
              );
            }
            
            if (card.isPendingActions) {
              return (
                <div 
                  key={card.id}
                  className={`${card.width ? getWidthClasses(card.width) : 'col-span-1'} ${card.height === '2' ? 'row-span-2' : ''}`}
                >
                  <PendingActionsCard
                    id={card.id}
                    notesToApprove={specialCardsData.notesToApprove}
                    responsesToDo={specialCardsData.responsesToDo}
                  />
                </div>
              );
            }
            
            return (
              <SortableActionCard 
                key={card.id} 
                card={card} 
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            );
          })}
          
          {/* Add NotificationsEnabler after the cards */}
          <NotificationsEnabler />
        </div>
      </SortableContext>
    </DndContext>
  );
};

// Function to get width classes
const getWidthClasses = (width: string = '25') => {
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

export default CardGrid;
