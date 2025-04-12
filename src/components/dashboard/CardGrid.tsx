
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem } from '@/types/dashboard';
import { getWidthClass, getHeightClass } from './grid/GridUtilities';
import UnifiedActionCard from './UnifiedActionCard';

interface CardGridProps {
  cards: ActionCardItem[];
  onEditCard: (card: ActionCardItem) => void;
  onHideCard: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
}

const SortableActionCard = ({ 
  card, 
  onEdit, 
  onHide, 
  isMobileView,
  isEditMode,
  renderSpecialCardContent,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  showSpecialFeatures
}: { 
  card: ActionCardItem;
  onEdit: (card: ActionCardItem) => void;
  onHide: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  
  // Get special content if renderer is provided
  const specialContent = renderSpecialCardContent ? renderSpecialCardContent(card.id) : null;
  const width = card.width || '25';
  const height = card.height || '1';
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${getWidthClass(width, isMobileView)} ${getHeightClass(height, isMobileView)} relative group`}
    >
      {specialContent ? (
        <div className="h-full w-full rounded-lg shadow-sm bg-white">{specialContent}</div>
      ) : (
        <UnifiedActionCard
          id={card.id}
          title={card.title}
          subtitle={card.subtitle}
          iconId={card.iconId}
          path={card.path}
          color={card.color}
          width={width}
          height={height}
          type={card.type}
          onEdit={() => onEdit(card)}
          onHide={() => onHide(card.id)}
          isEditing={isEditMode}
          isDraggable={true}
          iconSize={isMobileView ? 'lg' : 'xl'}
          hasSubtitle={!!card.subtitle}
          isSearch={card.isSearch}
          isCustom={card.isCustom}
          showSpecialFeatures={showSpecialFeatures}
          specialCardsData={specialCardsData}
          onSearchSubmit={onSearchSubmit}
          disableWiggleEffect={disableWiggleEffect}
          contentClassname={card.type === 'origin_selection' ? 'p-0' : ''}
        />
      )}
    </div>
  );
};

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onEditCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  renderSpecialCardContent,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  showSpecialFeatures
}) => {
  // For mobile view, use two columns instead of one
  const gridClass = isMobileView 
    ? "grid grid-cols-2 gap-4" 
    : "grid grid-cols-4 gap-4";
    
  return (
    <div className={gridClass}>
      {cards.map((card) => (
        <SortableActionCard
          key={card.id}
          card={card}
          onEdit={onEditCard}
          onHide={onHideCard}
          isMobileView={isMobileView}
          isEditMode={isEditMode}
          renderSpecialCardContent={renderSpecialCardContent}
          onSearchSubmit={onSearchSubmit}
          specialCardsData={specialCardsData}
          disableWiggleEffect={disableWiggleEffect}
          showSpecialFeatures={showSpecialFeatures}
        />
      ))}
    </div>
  );
};

export default CardGrid;
