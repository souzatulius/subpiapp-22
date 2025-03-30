
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import CardsContainer from './grid/CardsContainer';
import { ActionCardItem } from '@/types/dashboard';
import DynamicDataCard from './DynamicDataCard';

interface CardGridProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  onEditCard: (card: ActionCardItem) => void;
  onDeleteCard: (id: string) => void;
  onAddNewCard?: () => void;
  isMobileView?: boolean;
  specialCardsData?: any;
  usuarioId?: string;
  coordenacaoId?: string;
  modoAdmin?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards = [],
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  isMobileView = false,
  specialCardsData = {
    overdueCount: 0,
    overdueItems: [],
    notesToApprove: 0,
    responsesToDo: 0,
    isLoading: false
  },
  usuarioId = '',
  coordenacaoId = '',
  modoAdmin = true,
  quickDemandTitle = '',
  onQuickDemandTitleChange = () => {},
  onQuickDemandSubmit = () => {},
  onSearchSubmit = () => {}
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((item) => item.id === active.id);
      const newIndex = cards.findIndex((item) => item.id === over.id);
      const newCards = [...cards];
      const [movedItem] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedItem);
      onCardsChange(newCards);
    }
  };

  // Filter cards for mobile view
  const displayedCards = isMobileView
    ? cards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : cards;

  if (!displayedCards || displayedCards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

  // Separate cards into dynamic data cards and regular cards
  const dynamicDataCards = displayedCards.filter(
    (card) => card.type === 'data_dynamic' && card.dataSourceKey
  );
  
  const regularCards = displayedCards.filter(
    (card) => card.type !== 'data_dynamic' || !card.dataSourceKey
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={modoAdmin ? handleDragEnd : undefined}
    >
      <div className={`w-full grid gap-4 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {/* Special search cards should appear first */}
        {regularCards
          .filter(card => card.isSearch)
          .map(card => (
            <div 
              key={card.id}
              className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
            >
              <CardsContainer
                cards={[card]}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
                onAddNewCard={onAddNewCard}
                specialCardsData={specialCardsData}
                quickDemandTitle={quickDemandTitle}
                onQuickDemandTitleChange={onQuickDemandTitleChange}
                onQuickDemandSubmit={onQuickDemandSubmit}
                onSearchSubmit={onSearchSubmit}
              />
            </div>
          ))}
          
        {/* Dynamic data cards */}
        {dynamicDataCards.map(card => (
          <div 
            key={card.id}
            className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
          >
            <DynamicDataCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              color={card.color}
              dataSourceKey={card.dataSourceKey as any}
              coordenacaoId={coordenacaoId}
              usuarioId={usuarioId}
            />
          </div>
        ))}
        
        {/* Regular cards */}
        {regularCards
          .filter(card => !card.isSearch)
          .map(card => (
            <div 
              key={card.id}
              className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
            >
              <CardsContainer
                cards={[card]}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
                onAddNewCard={onAddNewCard}
                specialCardsData={specialCardsData}
                quickDemandTitle={quickDemandTitle}
                onQuickDemandTitleChange={onQuickDemandTitleChange}
                onQuickDemandSubmit={onQuickDemandSubmit}
                onSearchSubmit={onSearchSubmit}
              />
            </div>
          ))}
      </div>
    </DndContext>
  );
};

// Utility functions for determining class names based on card dimensions
export const getWidthClass = (width?: string, isMobileView: boolean = false): string => {
  if (isMobileView) {
    // In mobile view, we have only 2 columns
    switch (width) {
      case '25':
        return 'col-span-1'; // 1/2 of mobile width
      case '50':
      case '75':
      case '100':
        return 'col-span-2'; // Full mobile width
      default:
        return 'col-span-1';
    }
  } else {
    // In desktop view, we have 4 columns
    switch (width) {
      case '25':
        return 'col-span-1'; // 1/4 of desktop width
      case '50':
        return 'col-span-2'; // 2/4 of desktop width
      case '75':
        return 'col-span-3'; // 3/4 of desktop width
      case '100':
        return 'col-span-4'; // Full desktop width
      default:
        return 'col-span-1';
    }
  }
};

export const getHeightClass = (height?: string): string => {
  switch (height) {
    case '1':
      return 'h-40'; // Standard height
    case '2':
      return 'h-80'; // Double height
    default:
      return 'h-40';
  }
};

export default CardGrid;
