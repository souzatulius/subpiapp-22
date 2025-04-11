
import { useState, useEffect } from 'react';
import { CardType } from '@/types/dashboard';

// Type for card dimensions
export interface CardDimensions {
  width: string; // '25', '50', '75', '100'
  height: string; // '1', '2'
  type?: CardType | string; // Accept all card types
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
    case '0.5': return 1;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
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
  
  if (type === 'press_request_card') {
    return '100'; // Press request card takes full width
  }
  
  return '25'; // Default minimum width (1 column)
};

// Get minimum height for a card based on its type
export const getMinimumHeight = (type?: string): string => {
  if (type === 'data_dynamic' || type === 'in_progress_demands') {
    return '2'; // Dynamic cards need 2 rows
  }
  
  if (type === 'press_request_card') {
    return '2'; // Press request card needs 2 rows
  }
  
  if (type === 'origin_demand_chart') {
    return '2'; // Chart needs 2 rows
  }
  
  return '1'; // Default height (1 row)
};

export const useGridOccupancy = (cards: CardDimensions[], isMobileView: boolean) => {
  // Initialize state with empty array - this will always be called
  const [occupiedSlots, setOccupiedSlots] = useState<boolean[][]>([]);
  
  // Total columns for the grid
  const totalColumns = isMobileView ? 2 : 4;
  
  // Update occupied slots when cards change
  useEffect(() => {
    // Initialize a new empty grid
    const newOccupiedSlots: boolean[][] = [];
    
    // Handle empty cards array gracefully
    if (!cards || cards.length === 0) {
      setOccupiedSlots([]);
      return;
    }
    
    // First pass: place special cards that need particular positions
    const specialCards = cards.filter(card => 
      card.type === 'press_request_card' || 
      card.type === 'origin_demand_chart' || 
      card.type === 'in_progress_demands'
    );
    
    const regularCards = cards.filter(card => 
      card.type !== 'press_request_card' && 
      card.type !== 'origin_demand_chart' && 
      card.type !== 'in_progress_demands'
    );
    
    // Sort remaining cards by height (descending) to place taller cards first
    const sortedCards = [
      ...specialCards,
      ...regularCards.sort((a, b) => {
        const heightA = parseInt(a.height || '1');
        const heightB = parseInt(b.height || '1');
        return heightB - heightA;
      })
    ];
    
    // Place each card in the grid
    sortedCards.forEach(card => {
      const cardWidth = widthToSlots(card.width || '25', isMobileView);
      const cardHeight = heightToSlots(card.height || '1');
      
      // Find first available slot for the card
      let placed = false;
      let rowIndex = 0;
      
      // Special handling for press request card - always place it at the top
      if (card.type === 'press_request_card') {
        while (newOccupiedSlots.length < cardHeight) {
          newOccupiedSlots.push(Array(totalColumns).fill(false));
        }
        
        // Place it at the top
        placeCard(newOccupiedSlots, 0, 0, totalColumns, cardHeight);
        placed = true;
      } else {
        // Standard placement algorithm
        while (!placed) {
          // Ensure we have enough rows
          while (rowIndex + cardHeight > newOccupiedSlots.length) {
            newOccupiedSlots.push(Array(totalColumns).fill(false));
          }
          
          // Try to place the card at each column position
          for (let colIndex = 0; colIndex <= totalColumns - cardWidth; colIndex++) {
            if (canPlaceCard(newOccupiedSlots, rowIndex, colIndex, cardWidth, cardHeight)) {
              // Special handling for height-1 cards that could fit beside height-2 cards
              if (cardHeight === 1 && cardWidth === 1) {
                // Look for adjacent height-2 card slots
                const adjacentSlot = findAdjacentToHeightTwoSlot(newOccupiedSlots, rowIndex);
                if (adjacentSlot !== -1) {
                  placeCard(newOccupiedSlots, rowIndex, adjacentSlot, cardWidth, cardHeight);
                  placed = true;
                  break;
                }
              }
              
              // Standard placement
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
      }
    });
    
    setOccupiedSlots(newOccupiedSlots);
  }, [cards, isMobileView, totalColumns]);
  
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
  
  // Find a slot adjacent to a height-2 card if available
  const findAdjacentToHeightTwoSlot = (
    grid: boolean[][],
    rowIndex: number
  ): number => {
    if (grid.length <= rowIndex || rowIndex + 1 >= grid.length) return -1;
    
    for (let col = 0; col < totalColumns; col++) {
      // Check if this column is free in current row
      if (!grid[rowIndex][col]) {
        // Check if the same column one row below is occupied
        // This would indicate a height-2 card is present
        if (grid[rowIndex + 1] && grid[rowIndex + 1][col]) {
          return col;
        }
      }
    }
    return -1;
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
        // Ensure the grid has enough rows
        while (grid.length <= row) {
          grid.push(Array(totalColumns).fill(false));
        }
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
