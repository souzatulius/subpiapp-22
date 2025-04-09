
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem } from '@/types/dashboard';
import { getWidthClass, getHeightClass } from './grid/GridUtilities';
import UnifiedActionCard from './UnifiedActionCard';
import UnifiedCardGrid from './UnifiedCardGrid';

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
  useAbsolutePositioning?: boolean; // New prop
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
  
  const specialContent = renderSpecialCardContent && renderSpecialCardContent(card.id);
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
  showSpecialFeatures,
  useAbsolutePositioning = true // Default to using the new absolute positioning
}) => {
  // If using absolute positioning, use the UnifiedCardGrid with absolute positioning
  if (useAbsolutePositioning) {
    return (
      <UnifiedCardGrid
        cards={cards}
        onCardsChange={(updatedCards) => {
          // Handle card changes through the parent components
          // This is a placeholder since we don't modify the cards directly here
        }}
        onEditCard={onEditCard}
        onDeleteCard={(id) => {}} // Not used in this context
        onHideCard={onHideCard}
        isMobileView={isMobileView}
        isEditMode={isEditMode}
        disableWiggleEffect={disableWiggleEffect}
        showSpecialFeatures={showSpecialFeatures}
        onSearchSubmit={onSearchSubmit}
        specialCardsData={specialCardsData}
        useAbsolutePositioning={true}
      />
    );
  }
  
  // For mobile view, use a single column
  const gridClass = isMobileView 
    ? "grid grid-cols-1 gap-4" 
    : "grid grid-cols-4 gap-4";
    
  // Fallback to the traditional grid layout
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
