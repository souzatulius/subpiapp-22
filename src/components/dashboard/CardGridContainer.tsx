
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from './UnifiedCardGrid';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';
import { useDepartmentData } from './grid/hooks/useDepartmentData';

interface CardGridContainerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  onSearchSubmit?: (query: string) => void;
}

const CardGridContainer: React.FC<CardGridContainerProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  onSearchSubmit
}) => {
  // Custom hook to fetch data for special cards like overdue demands, etc.
  const specialCardsData = useSpecialCardsData();
  
  // Get user department info to determine if origin selection card should be shown
  const { isComunicacao } = useDepartmentData();
  
  // Start with existing cards
  let displayCards = [...cards];
  
  // Ensure we have a search card if not present
  const hasSearchCard = displayCards.some(card => 
    card.type === 'smart_search' || card.isSearch === true
  );
  
  if (!hasSearchCard) {
    // Add search card at the beginning
    displayCards.unshift({
      id: 'search-card',
      title: 'O que vamos fazer?',
      subtitle: 'Faça uma busca rápida',
      iconId: 'search',
      path: '',
      color: 'blue-light',
      width: '100',
      height: '1',
      type: 'smart_search',
      displayMobile: true,
      mobileOrder: 0,
    });
  }
  
  // If user is from comunicacao department, add origin selection card if not already present
  if (isComunicacao && !displayCards.some(card => card.type === 'origin_selection')) {
    const hasOriginCard = displayCards.some(card => card.id === 'origin-selection');
    
    if (!hasOriginCard) {
      displayCards.push({
        id: 'origin-selection',
        title: 'Cadastro de Demandas',
        subtitle: 'Selecione a origem da demanda',
        iconId: 'file-plus',
        path: '',
        color: 'blue-vivid',
        width: '50',
        height: '2',
        type: 'origin_selection',
        displayMobile: true,
        mobileOrder: displayCards.length,
      });
    }
  }
  
  return (
    <div className="w-full">
      <UnifiedCardGrid
        cards={displayCards}
        onCardsChange={onCardsChange}
        onEditCard={onEditCard}
        onHideCard={onHideCard}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        specialCardsData={specialCardsData}
        onSearchSubmit={onSearchSubmit}
      />
    </div>
  );
};

export default CardGridContainer;
