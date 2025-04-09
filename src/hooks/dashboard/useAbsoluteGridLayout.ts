
import { useState, useEffect, useMemo } from 'react';
import { ActionCardItem } from '@/types/dashboard';

export interface GridCell {
  isOccupied: boolean;
  cardId?: string;
}

interface AbsoluteGridLayoutProps {
  cards: ActionCardItem[];
  columns: number;
  rows?: number;
  autoPlace?: boolean;
}

/**
 * Hook for managing a grid layout with absolute positioning of cards
 */
export const useAbsoluteGridLayout = ({
  cards,
  columns = 4,
  rows = 10, // Default max rows
  autoPlace = true
}: AbsoluteGridLayoutProps) => {
  // State for the grid cells
  const [grid, setGrid] = useState<GridCell[][]>([]);
  
  // Build the grid based on cards with absolute positions
  useEffect(() => {
    // Initialize empty grid
    const newGrid: GridCell[][] = Array(rows).fill(0).map(() => 
      Array(columns).fill(0).map(() => ({ isOccupied: false }))
    );
    
    // First place cards with fixed positions
    const cardsToPlace = [...cards].filter(card => !card.isHidden);
    const fixedCards = cardsToPlace.filter(card => card.isPositionFixed && card.gridRow !== undefined && card.gridColumn !== undefined);
    
    fixedCards.forEach(card => {
      if (card.gridRow !== undefined && card.gridColumn !== undefined) {
        const rowIndex = card.gridRow;
        const colIndex = card.gridColumn;
        const width = getCardWidth(card.width);
        const height = getCardHeight(card.height);
        
        // Ensure we're not out of bounds
        if (rowIndex >= 0 && rowIndex + height <= rows && 
            colIndex >= 0 && colIndex + width <= columns) {
          // Mark grid cells as occupied
          for (let r = rowIndex; r < rowIndex + height; r++) {
            for (let c = colIndex; c < colIndex + width; c++) {
              if (newGrid[r] && newGrid[r][c]) {
                newGrid[r][c] = { isOccupied: true, cardId: card.id };
              }
            }
          }
        }
      }
    });
    
    // Auto-place remaining cards if enabled
    if (autoPlace) {
      const nonFixedCards = cardsToPlace.filter(card => !card.isPositionFixed || card.gridRow === undefined || card.gridColumn === undefined);
      
      nonFixedCards.forEach(card => {
        const width = getCardWidth(card.width);
        const height = getCardHeight(card.height);
        
        // Find first available position
        let placed = false;
        
        for (let r = 0; r < rows && !placed; r++) {
          for (let c = 0; c < columns - width + 1 && !placed; c++) {
            // Check if the space is available
            let canPlace = true;
            
            for (let rOffset = 0; rOffset < height && canPlace; rOffset++) {
              for (let cOffset = 0; cOffset < width && canPlace; cOffset++) {
                if (!newGrid[r + rOffset] || !newGrid[r + rOffset][c + cOffset] || newGrid[r + rOffset][c + cOffset].isOccupied) {
                  canPlace = false;
                }
              }
            }
            
            if (canPlace) {
              // Place the card here
              for (let rOffset = 0; rOffset < height; rOffset++) {
                for (let cOffset = 0; cOffset < width; cOffset++) {
                  newGrid[r + rOffset][c + cOffset] = { isOccupied: true, cardId: card.id };
                }
              }
              
              // Update the card with its position
              card.gridRow = r;
              card.gridColumn = c;
              placed = true;
            }
          }
        }
      });
    }
    
    setGrid(newGrid);
  }, [cards, columns, rows, autoPlace]);
  
  // Check if a position is valid for a card (for drag previews)
  const isValidPosition = (card: ActionCardItem, newRow: number, newCol: number): boolean => {
    const width = getCardWidth(card.width);
    const height = getCardHeight(card.height);
    
    // Check boundaries
    if (newRow < 0 || newCol < 0 || newRow + height > rows || newCol + width > columns) {
      return false;
    }
    
    // Check for collisions with other cards
    for (let r = newRow; r < newRow + height; r++) {
      for (let c = newCol; c < newCol + width; c++) {
        if (!grid[r] || !grid[r][c]) {
          return false;
        }
        
        if (grid[r][c].isOccupied && grid[r][c].cardId !== card.id) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Calculate the nearest valid position (for snap-to-grid)
  const findNearestValidPosition = (
    card: ActionCardItem, 
    rowHint: number, 
    colHint: number
  ): { row: number; col: number } => {
    // First try the exact position
    if (isValidPosition(card, rowHint, colHint)) {
      return { row: rowHint, col: colHint };
    }
    
    // If not valid, search for the closest valid position
    const maxDistance = Math.max(rows, columns);
    
    for (let distance = 1; distance < maxDistance; distance++) {
      // Check in increasing "rings" around the hint position
      for (let r = Math.max(0, rowHint - distance); r <= Math.min(rows - 1, rowHint + distance); r++) {
        for (let c = Math.max(0, colHint - distance); c <= Math.min(columns - 1, colHint + distance); c++) {
          if (Math.abs(r - rowHint) + Math.abs(c - colHint) <= distance && isValidPosition(card, r, c)) {
            return { row: r, col: c };
          }
        }
      }
    }
    
    // If no valid position found, return the original hint
    return { row: rowHint, col: colHint };
  };
  
  // Locate gaps in the grid that could fit a card of specific dimensions
  const findAvailableGaps = (width: number, height: number): { row: number; col: number }[] => {
    const gaps: { row: number; col: number }[] = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns - width + 1; c++) {
        let isFree = true;
        
        for (let rOffset = 0; rOffset < height && isFree; rOffset++) {
          for (let cOffset = 0; cOffset < width && isFree; cOffset++) {
            if (!grid[r + rOffset] || !grid[r + rOffset][c + cOffset] || grid[r + rOffset][c + cOffset].isOccupied) {
              isFree = false;
            }
          }
        }
        
        if (isFree) {
          gaps.push({ row: r, col: c });
        }
      }
    }
    
    return gaps;
  };

  // Helper to convert card width to column count
  const getCardWidth = (width?: string): number => {
    switch (width) {
      case '25': return 1;
      case '50': return 2;
      case '75': return 3;
      case '100': return 4;
      default: return 1;
    }
  };

  // Helper to convert card height to row count
  const getCardHeight = (height?: string): number => {
    switch (height) {
      case '0.5': return 1;
      case '1': return 1;
      case '2': return 2;
      case '3': return 3;
      case '4': return 4;
      default: return 1;
    }
  };
  
  // Calculate grid metrics
  const metrics = useMemo(() => {
    const totalCells = rows * columns;
    const occupiedCells = grid.flat().filter(cell => cell.isOccupied).length;
    const utilization = totalCells > 0 ? (occupiedCells / totalCells) * 100 : 0;
    
    return {
      totalCells,
      occupiedCells,
      utilization,
      availableGaps: findAvailableGaps(1, 1) // Find single-cell gaps
    };
  }, [grid, rows, columns]);
  
  return {
    grid,
    metrics,
    isValidPosition,
    findNearestValidPosition,
    findAvailableGaps,
    getCardWidth,
    getCardHeight
  };
};

export default useAbsoluteGridLayout;
