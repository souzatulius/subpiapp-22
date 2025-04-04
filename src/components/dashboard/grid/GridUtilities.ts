
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
      return 'h-24'; // Reduced from h-32 to h-24 (6rem instead of 8rem)
    case '2':
      return 'h-52'; // Reduced from h-64 to h-52 (13rem instead of 16rem)
    default:
      return 'h-24'; // Default height also reduced
  }
};
