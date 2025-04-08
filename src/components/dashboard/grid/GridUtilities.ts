
/**
 * Utility functions for the grid layout
 */

/**
 * Returns the appropriate width class based on the card width and mobile view status
 */
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

/**
 * Returns the appropriate height class based on the card height
 */
export const getHeightClass = (height?: string): string => {
  switch (height) {
    case '1':
      return 'h-20'; // 5rem or 80px
    case '2':
      return 'h-40 row-span-2'; // 10rem or 160px and span 2 rows in the grid
    default:
      return 'h-20'; // Default height
  }
};
