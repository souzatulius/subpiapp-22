
import React, { useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import UnifiedActionCard from './UnifiedActionCard';
import { useAbsoluteGridLayout } from '@/hooks/dashboard/useAbsoluteGridLayout';

interface AbsoluteGridProps {
  cards: ActionCardItem[];
  onCardsChange: (updatedCards: ActionCardItem[]) => void;
  onEditCard?: (card: ActionCardItem) => void;
  onDeleteCard?: (id: string) => void;
  onHideCard?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  specialCardsData?: any;
  onSearchSubmit?: (query: string) => void;
}

// Helper component to render one card with absolute positioning
const AbsolutePositionedCard: React.FC<{
  card: ActionCardItem;
  onEdit?: (card: ActionCardItem) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isMobileView?: boolean;
  isEditMode?: boolean;
  disableWiggleEffect?: boolean;
  showPreview?: boolean;
  isDraggingActive?: boolean;
  gridCellHeight: number;
  gridCellWidth: number;
  showSpecialFeatures?: boolean;
  specialCardsData?: any;
  onSearchSubmit?: (query: string) => void;
}> = ({
  card,
  onEdit,
  onDelete,
  onHide,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = true,
  showPreview = false,
  isDraggingActive = false,
  gridCellHeight,
  gridCellWidth,
  showSpecialFeatures = true,
  specialCardsData,
  onSearchSubmit
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id });

  // Calculate positioning based on grid coordinates
  const top = (card.gridRow ?? 0) * gridCellHeight;
  const left = (card.gridColumn ?? 0) * gridCellWidth;
  const width = getWidthInColumns(card.width) * gridCellWidth;
  const height = getHeightInRows(card.height) * gridCellHeight;

  // Calculate z-index based on dragging state
  const zIndex = isDragging ? 100 : 10;

  // Apply styles for drag previews
  const style: React.CSSProperties = {
    position: 'absolute',
    top,
    left,
    width,
    height,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex,
    opacity: isDragging ? 0.6 : 1,
    pointerEvents: isDraggingActive && !isDragging ? 'none' : 'auto'
  };

  // Special content class for certain card types
  const getCardContentClass = () => {
    if (card.type === 'origin_selection') {
      return 'p-0';
    }
    return '';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`absolute rounded-lg transition-all duration-300 ${
        showPreview ? 'shadow-lg ring-2 ring-blue-400' : ''
      } ${isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''}`}
    >
      <UnifiedActionCard
        id={card.id}
        title={card.title}
        subtitle={card.subtitle}
        iconId={card.iconId}
        path={card.path}
        color={card.color}
        width={card.width}
        height={card.height}
        isDraggable={true}
        isEditing={isEditMode}
        onEdit={onEdit ? () => onEdit(card) : undefined}
        onDelete={onDelete}
        onHide={onHide}
        iconSize={isMobileView ? 'lg' : 'xl'}
        disableWiggleEffect={disableWiggleEffect}
        type={card.type}
        isQuickDemand={card.isQuickDemand}
        isSearch={card.isSearch}
        showSpecialFeatures={showSpecialFeatures}
        specialCardsData={specialCardsData}
        onSearchSubmit={onSearchSubmit}
        isCustom={card.isCustom}
        hasBadge={card.hasBadge}
        badgeValue={card.badgeValue}
        hasSubtitle={!!card.subtitle}
        isMobileView={isMobileView}
        isPendingActions={card.isPendingActions}
        contentClassname={getCardContentClass()}
      />
    </div>
  );
};

// Helper functions to convert width/height string to column/row count
function getWidthInColumns(width?: string): number {
  switch (width) {
    case '25': return 1;
    case '50': return 2;
    case '75': return 3;
    case '100': return 4;
    default: return 1;
  }
}

function getHeightInRows(height?: string): number {
  switch (height) {
    case '0.5': return 1;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    default: return 1;
  }
}

// Convert grid coordinates to width/height strings
function getCardWidthFromColumns(columns: number): string {
  switch (columns) {
    case 1: return '25';
    case 2: return '50';
    case 3: return '75';
    case 4: return '100';
    default: return '25';
  }
}

function getCardHeightFromRows(rows: number): string {
  switch (rows) {
    case 1: return rows === 0.5 ? '0.5' : '1';
    case 2: return '2';
    case 3: return '3';
    case 4: return '4';
    default: return '1';
  }
}

export const AbsoluteGrid: React.FC<AbsoluteGridProps> = ({
  cards,
  onCardsChange,
  onEditCard,
  onDeleteCard,
  onHideCard,
  isMobileView = false,
  isEditMode = false,
  disableWiggleEffect = true,
  showSpecialFeatures = true,
  specialCardsData,
  onSearchSubmit
}) => {
  // Define grid dimensions
  const columns = isMobileView ? 2 : 4;
  const gridCellWidth = isMobileView ? 100 : 100; // Width in pixels
  const gridCellHeight = 100; // Height in pixels

  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [draggedCard, setDraggedCard] = useState<ActionCardItem | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{row: number; col: number} | null>(null);

  // Filter out hidden cards
  const visibleCards = cards.filter(card => !card.isHidden);

  // Set up grid layout
  const { grid, isValidPosition, findNearestValidPosition } = useAbsoluteGridLayout({
    cards: visibleCards,
    columns,
    rows: 10, // Adjust based on your needs
    autoPlace: true
  });

  // Calculate total grid height
  const gridHeight = grid.length * gridCellHeight;
  const gridWidth = columns * gridCellWidth;

  // Set up sensors for drag n drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Handle starting a drag operation
  const handleDragStart = (event: DragStartEvent) => {
    setIsDraggingActive(true);
    const card = visibleCards.find(c => c.id === event.active.id);
    if (card) {
      setDraggedCard(card);
    }
  };

  // Handle drag over for preview
  const handleDragOver = (event: DragOverEvent) => {
    if (!draggedCard) return;

    // Calculate grid position from pointer coordinates
    const { x, y } = event.over?.rect || { x: 0, y: 0 };
    
    const col = Math.floor(x / gridCellWidth);
    const row = Math.floor(y / gridCellHeight);

    // Find the nearest valid position
    const nearest = findNearestValidPosition(draggedCard, row, col);
    setPreviewPosition(nearest);
  };

  // Handle the end of a drag operation
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDraggingActive(false);
    setDraggedCard(null);
    setPreviewPosition(null);

    if (!event.over || !draggedCard || !previewPosition) return;

    // Update the card with its new position
    const updatedCards = visibleCards.map(card => {
      if (card.id === draggedCard.id) {
        return {
          ...card,
          gridRow: previewPosition.row,
          gridColumn: previewPosition.col,
          isPositionFixed: true
        };
      }
      return card;
    });

    // Call the onCardsChange callback with the updated cards
    onCardsChange(updatedCards);
  };

  return (
    <div 
      className="relative w-full" 
      style={{ 
        height: gridHeight, 
        minHeight: '400px' 
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleCards.map(card => card.id)}>
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ 
              width: gridWidth, 
              height: gridHeight,
              position: 'relative'
            }}
          >
            {/* Grid background - shows grid cells */}
            <div className="absolute top-0 left-0 w-full h-full grid" style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${grid.length}, 1fr)`,
              pointerEvents: 'none'
            }}>
              {grid.flat().map((cell, idx) => (
                <div 
                  key={`cell-${idx}`} 
                  className={`border border-gray-100 ${cell.isOccupied ? 'bg-gray-50' : 'bg-white'}`}
                />
              ))}
            </div>

            {/* Render cards with absolute positioning */}
            {visibleCards.map(card => (
              <AbsolutePositionedCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                onHide={onHideCard}
                isMobileView={isMobileView}
                isEditMode={isEditMode}
                disableWiggleEffect={disableWiggleEffect}
                isDraggingActive={isDraggingActive}
                gridCellHeight={gridCellHeight}
                gridCellWidth={gridCellWidth}
                showSpecialFeatures={showSpecialFeatures}
                specialCardsData={specialCardsData}
                onSearchSubmit={onSearchSubmit}
              />
            ))}

            {/* Drop preview indicator */}
            {isDraggingActive && draggedCard && previewPosition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="absolute bg-blue-200 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none"
                style={{
                  top: previewPosition.row * gridCellHeight,
                  left: previewPosition.col * gridCellWidth,
                  width: getWidthInColumns(draggedCard.width) * gridCellWidth,
                  height: getHeightInRows(draggedCard.height) * gridCellHeight,
                  zIndex: 5
                }}
              />
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AbsoluteGrid;
