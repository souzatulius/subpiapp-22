
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
      return 'h-20'; // Reduced from h-24 to h-20 (5rem instead of 6rem)
    case '2':
      return 'h-40'; // Reduced from h-52 to h-40 (10rem instead of 13rem)
    default:
      return 'h-20'; // Default height also reduced
  }
};
