
import React, { useState } from 'react';
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
import { useGridOccupancy } from '@/hooks/dashboard/useGridOccupancy';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

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

  // Always initialize this state regardless of card presence
  const { totalColumns } = useGridOccupancy(
    cards.map(card => ({ 
      id: card.id,
      width: card.width || '25', 
      height: card.height || '1',
      type: card.type
    })), 
    isMobileView
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

  if (!cards || cards.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum card disponível para exibir.
      </div>
    );
  }

  // Filter cards based on mobile view
  const displayedCards = isMobileView
    ? cards
        .filter((card) => card.displayMobile !== false)
        .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999))
    : cards;

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
                isMobileView={isMobileView}
              />
            </div>
          ))}
          
        {dynamicDataCards.map(card => {
          const IconComponent = getIconComponentFromId(card.iconId);
          return (
            <div 
              key={card.id}
              className={`${getWidthClass(card.width, isMobileView)} ${getHeightClass(card.height)}`}
            >
              <DynamicDataCard
                key={card.id}
                title={card.title}
                icon={IconComponent ? <IconComponent className={isMobileView ? "w-12 h-12" : "w-16 h-16"} /> : null}
                color={card.color}
                dataSourceKey={card.dataSourceKey as any}
                coordenacaoId={coordenacaoId}
                usuarioId={usuarioId}
              />
            </div>
          );
        })}
        
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
                isMobileView={isMobileView}
              />
            </div>
          ))}
      </div>
    </DndContext>
  );
};

export const getWidthClass = (width?: string, isMobileView: boolean = false): string => {
  if (isMobileView) {
    switch (width) {
      case '25':
        return 'col-span-1';
      case '50':
      case '75':
      case '100':
        return 'col-span-2';
      default:
        return 'col-span-1';
    }
  } else {
    switch (width) {
      case '25':
        return 'col-span-1';
      case '50':
        return 'col-span-2';
      case '75':
        return 'col-span-3';
      case '100':
        return 'col-span-4';
      default:
        return 'col-span-1';
    }
  }
};

export const getHeightClass = (height?: string): string => {
  switch (height) {
    case '1':
      return 'h-40'; // Keep height consistent at 40 (10rem)
    case '2':
      return 'h-40'; // Changed from h-80 to h-40 to be consistent with height "1"
    default:
      return 'h-40';
  }
};

export default CardGrid;
