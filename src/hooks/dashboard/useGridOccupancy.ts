
import { useState, useEffect, useMemo } from 'react';
import { CardDimensions, CardType } from '@/types/dashboard';

export const GRID_WIDTH = 100; // Total width of the grid (percentages)
export const GRID_ROWS = 2; // Number of rows in the grid

export interface OccupancyCell {
  id: string;
  occupied: boolean;
}

export type GridMap = OccupancyCell[][];

interface UseGridOccupancyProps {
  cards: CardDimensions[];
}

export const useGridOccupancy = ({ cards }: UseGridOccupancyProps) => {
  const [gridMap, setGridMap] = useState<GridMap>([]);
  const totalColumns = 4; // Adding totalColumns property for grid layout
  
  // Initialize grid with all cells free
  const initializeGrid = () => {
    const grid: GridMap = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      grid[row] = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        grid[row][col] = { id: '', occupied: false };
      }
    }
    return grid;
  };
  
  // Get card width and height in grid units
  const getCardDimensions = (card: CardDimensions) => {
    // Convert width percentage to grid units
    const widthInCells = parseInt(card.width);
    
    // Convert height to grid rows (1 or 2)
    const heightInRows = parseInt(card.height);
    
    return { width: widthInCells, height: heightInRows };
  };
  
  // Place cards on the grid
  const placeCardsOnGrid = (cardsToPlace: CardDimensions[]) => {
    if (!cardsToPlace || cardsToPlace.length === 0) {
      return initializeGrid();
    }
    
    const newGrid = initializeGrid();
    
    for (const card of cardsToPlace) {
      const { width, height } = getCardDimensions(card);
      let placed = false;
      
      // Try to place the card at each position in the grid
      for (let row = 0; row <= GRID_ROWS - height; row++) {
        for (let col = 0; col <= GRID_WIDTH - width; col++) {
          // Check if this position can fit the card
          let canFit = true;
          for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
              if (newGrid[row + r][col + c].occupied) {
                canFit = false;
                break;
              }
            }
            if (!canFit) break;
          }
          
          // If the card can fit, place it
          if (canFit) {
            for (let r = 0; r < height; r++) {
              for (let c = 0; c < width; c++) {
                newGrid[row + r][col + c] = { id: card.id, occupied: true };
              }
            }
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }
    
    return newGrid;
  };
  
  // Memoize the grid calculation to prevent unnecessary re-renders
  const processedGrid = useMemo(() => {
    return placeCardsOnGrid(cards);
  }, [cards]);
  
  // Update the grid whenever the cards change
  useEffect(() => {
    setGridMap(processedGrid);
  }, [processedGrid]);
  
  return { gridMap, totalColumns };
};
