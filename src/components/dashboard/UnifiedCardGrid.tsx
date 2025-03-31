
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ActionCardItem, CardType, DashboardState, CardDimensions } from '@/types/dashboard';
import SortableActionCard from '@/components/dashboard/SortableActionCard';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';

const UnifiedCardGrid: React.FC<DashboardState> = ({
  cards,
  setCards,
  loading,
  handleDeleteCard,
  handleEditCard,
  handleAddNewCard,
  saveDashboard,
  isEditMode,
  setIsEditMode
}) => {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate grid occupancy
  const cardDimensions = cards.map(card => ({
    id: card.id,
    width: card.width || '25',
    height: card.height || '1',
    type: card.type
  })) as CardDimensions[];
  
  const { gridMap } = useGridOccupancy({ cards: cardDimensions });
  
  // Handle drag events
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any) => {
    setIsDragging(false);
    
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const activeIndex = cards.findIndex(item => item.id === active.id);
      const overIndex = cards.findIndex(item => item.id === over?.id);
      
      const newItems = [...cards];
      const [reorderedItem] = newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, reorderedItem);
      
      setCards(newItems);
    }
  };

  // Determine card size for mobile
  const getCardWidthForMobile = (card: ActionCardItem) => {
    return isMobile ? '50' : card.width || '25';
  };
  
  // Filter out cards that shouldn't be displayed on mobile
  const displayCards = isMobile 
    ? cards.filter(card => card.displayMobile !== false)
    : cards;
  
  // Sort cards for mobile view based on mobileOrder
  const sortedCards = isMobile
    ? [...displayCards].sort((a, b) => {
        const orderA = a.mobileOrder !== undefined ? a.mobileOrder : 999;
        const orderB = b.mobileOrder !== undefined ? b.mobileOrder : 999;
        return orderA - orderB;
      })
    : displayCards;

  return (
    <div className="relative">
      {setIsEditMode && (
        <DashboardActions 
          isEditMode={Boolean(isEditMode)} 
          setIsEditMode={setIsEditMode} 
          onSave={saveDashboard} 
          onAddNew={handleAddNewCard} 
        />
      )}
      
      <div className={`grid grid-cols-4 gap-4 pb-4 ${isMobile ? 'grid-cols-2' : ''}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToWindowEdges]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {loading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-gray-100 rounded-lg animate-pulse h-32" />
            ))
          ) : (
            // Render actual cards
            sortedCards.map((card) => (
              <SortableActionCard
                key={card.id}
                card={{
                  ...card,
                  width: getCardWidthForMobile(card)
                }}
                isEditMode={Boolean(isEditMode)}
                onDelete={handleDeleteCard}
                onEdit={handleEditCard}
                isDraggable={Boolean(isEditMode)}
              />
            ))
          )}
        </DndContext>
      </div>
    </div>
  );
};

export default UnifiedCardGrid;
