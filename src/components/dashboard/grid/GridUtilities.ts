
/**
 * Utility functions for the dashboard grid layout
 */

import { CardWidth, CardHeight } from '@/types/dashboard';

/**
 * Returns the appropriate width class based on the card width property
 */
export const getWidthClass = (width?: CardWidth, isMobileView = false): string => {
  if (isMobileView) {
    // Mobile view - simpler grid
    return width === '100' ? 'col-span-2' : 'col-span-1';
  }

  // Desktop view - more precise grid
  switch (width) {
    case '25':
      return 'col-span-1'; // 25% width (1/4 of the grid)
    case '33':
      return 'col-span-1 md:col-span-1 lg:col-span-1'; // ~33% width (1/3 of the grid)
    case '50':
      return 'col-span-2'; // 50% width (2/4 of the grid)
    case '75':
      return 'col-span-3'; // 75% width (3/4 of the grid)
    case '100':
      return 'col-span-4'; // 100% width (full grid width)
    default:
      return 'col-span-1'; // Default to 25% width
  }
};

/**
 * Returns the appropriate height class based on the card height property
 */
export const getHeightClass = (height?: CardHeight): string => {
  switch (height) {
    case '2':
      return 'h-64'; // Double height (16rem / 256px)
    case '1':
    default:
      return 'h-32'; // Standard height (8rem / 128px)
  }
};
