
import { useState, useEffect } from 'react';

// Type for card dimensions
export interface CardDimensions {
  width: string; // '25', '50', '75', '100'
  height: string; // '1', '2'
  type?: 'standard' | 'data_dynamic';
  id: string;
}

// Convert width string to number of slots
const widthToSlots = (width: string, isMobileView: boolean): number => {
  if (isMobileView) {
    switch (width) {
      case '25': return 1;
      case '50': 
      case '75':
      case '100': return 2;
      default: return 1;
    }
  } else {
    switch (width) {
      case '25': return 1;
      case '50': return 2;
      case '75': return 3;
      case '100': return 4;
      default: return 1;
    }
  }
};

// Convert height string to number of slots
const heightToSlots = (height: string): number => {
  switch (height) {
    case '1': return 1;
    case '2': return 2;
    default: return 1;
  }
};

// Get minimum width for a card based on its type
export const getMinimumWidth = (type?: string, isMobileView: boolean = false): string => {
  if (isMobileView) {
    return '50'; // 1 column in mobile (50%)
  }
  
  // For desktop
  if (type === 'data_dynamic') {
    return '50'; // Dynamic cards need at least 2 columns
  }
  
  // Card "Demandas em Andamento" should be larger
  if (type === 'in_progress_demands') {
    return '50'; // 2 columns
  }
  
  return '25'; // Default minimum width (1 column)
};

// Get minimum height for a card based on its type
export const getMinimumHeight = (type?: string): string => {
  if (type === 'data_dynamic' || type === 'in_progress_demands') {
    return '2'; // Dynamic cards need 2 rows
  }
  return '1'; // Default height (1 row)
};

export const useGridOccupancy = (cards: CardDimensions[], isMobileView: boolean) => {
  const [occupiedSlots, setOccupiedSlots] = useState<boolean[][]>([]);
  
  // Total columns for the grid
  const totalColumns = isMobileView ? 2 : 4;
  
  // Update occupied slots when cards change
  useEffect(() => {
    // Initialize a new empty grid
    const newOccupiedSlots: boolean[][] = [];
    
    // Sort cards to ensure consistent placement
    const sortedCards = [...cards];
    
    // Place each card in the grid
    sortedCards.forEach(card => {
      const cardWidth = widthToSlots(card.width || '25', isMobileView);
      const cardHeight = heightToSlots(card.height || '1');
      
      // Find first available slot for the card
      let placed = false;
      let rowIndex = 0;
      
      while (!placed) {
        // Ensure we have enough rows
        while (rowIndex + cardHeight > newOccupiedSlots.length) {
          newOccupiedSlots.push(Array(totalColumns).fill(false));
        }
        
        // Try to place the card at each column position
        for (let colIndex = 0; colIndex <= totalColumns - cardWidth; colIndex++) {
          if (canPlaceCard(newOccupiedSlots, rowIndex, colIndex, cardWidth, cardHeight)) {
            // Place the card
            placeCard(newOccupiedSlots, rowIndex, colIndex, cardWidth, cardHeight);
            placed = true;
            break;
          }
        }
        
        // If not placed, try next row
        if (!placed) {
          rowIndex++;
        }
      }
    });
    
    setOccupiedSlots(newOccupiedSlots);
  }, [cards, isMobileView]);
  
  // Check if a card can be placed at a specific position
  const canPlaceCard = (
    grid: boolean[][], 
    rowStart: number, 
    colStart: number, 
    width: number, 
    height: number
  ): boolean => {
    for (let row = rowStart; row < rowStart + height; row++) {
      for (let col = colStart; col < colStart + width; col++) {
        if (!grid[row] || grid[row][col]) {
          return false; // Slot is already occupied or doesn't exist
        }
      }
    }
    return true; // All required slots are free
  };
  
  // Mark slots as occupied by a card
  const placeCard = (
    grid: boolean[][], 
    rowStart: number, 
    colStart: number, 
    width: number, 
    height: number
  ) => {
    for (let row = rowStart; row < rowStart + height; row++) {
      for (let col = colStart; col < colStart + width; col++) {
        grid[row][col] = true; // Mark as occupied
      }
    }
  };
  
  // Calculate best position for a new card
  const findBestPosition = (width: string, height: string, type?: string): { row: number, col: number } => {
    const cardWidth = widthToSlots(width || getMinimumWidth(type, isMobileView), isMobileView);
    const cardHeight = heightToSlots(height || getMinimumHeight(type));
    
    let bestRow = 0;
    let bestCol = 0;
    let placed = false;
    
    while (!placed) {
      // Ensure we have enough rows
      while (bestRow + cardHeight > occupiedSlots.length) {
        // Need to create a theoretical new row
        bestRow = occupiedSlots.length;
        bestCol = 0;
        placed = true;
        break;
      }
      
      // Try each column
      for (let col = 0; col <= totalColumns - cardWidth && !placed; col++) {
        if (canPlaceCard(occupiedSlots, bestRow, col, cardWidth, cardHeight)) {
          bestCol = col;
          placed = true;
          break;
        }
      }
      
      if (!placed) {
        bestRow++;
      }
    }
    
    return { row: bestRow, col: bestCol };
  };
  
  return {
    occupiedSlots,
    findBestPosition,
    totalRows: occupiedSlots.length,
    totalColumns
  };
};

export default useGridOccupancy;
