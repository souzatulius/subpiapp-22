
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';
import PendingTasksCard from './cards/PendingTasksCard';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false
}) => {
  // Custom hook to fetch data for special cards like overdue demands, etc.
  const specialCardsData = useSpecialCardsData();
  
  // Find special cards that need custom rendering
  const pendingTasksCard = cards.find(card => card.id === 'pending-tasks');
  
  // Filter out special cards that will be rendered separately
  const regularCards = cards.filter(card => card.id !== 'pending-tasks');
  
  // Special rendering for the pending tasks card
  const renderPendingTasksCard = () => {
    if (!pendingTasksCard) return null;
    
    // Use the width class based on mobile view, but force height to row-span-2
    return (
      <div 
        className={`${getWidthClass(pendingTasksCard.width, isMobileView)} row-span-2`}
      >
        <PendingTasksCard />
      </div>
    );
  };
  
  // Helper functions to determine CSS classes for card dimensions
  const getWidthClass = (width: string = '25', isMobile: boolean = false) => {
    if (isMobile) {
      // On mobile, we want cards to be either half-width or full-width
      return width === '25' || width === '33' ? 'col-span-1' : 'col-span-2';
    }
    
    switch (width) {
      case '25':
        return 'col-span-1'; // 1/4 width (1 out of 4 columns)
      case '33':
        return 'col-span-1 md:col-span-2 lg:col-span-1'; // 1/3 width
      case '50':
        return 'col-span-2'; // 1/2 width (2 out of 4 columns)
      case '75':
        return 'col-span-3'; // 3/4 width (3 out of 4 columns)
      case '100':
        return 'col-span-4'; // Full width (all 4 columns)
      default:
        return 'col-span-1';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-flow-row-dense">
      {/* Render special cards */}
      {pendingTasksCard && renderPendingTasksCard()}
      
      {/* Render regular cards with the unified grid */}
      <div className={isMobileView ? 'col-span-2' : 'col-span-4'}>
        <UnifiedCardGrid
          cards={regularCards}
          onCardsChange={onCardsChange}
          onEditCard={onEditCard}
          onHideCard={onHideCard}
          isMobileView={isMobileView}
          isEditMode={isEditMode}
          specialCardsData={specialCardsData}
        />
      </div>
    </div>
  );
};

export default CardGridContainer;
