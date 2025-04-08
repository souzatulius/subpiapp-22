
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
        return 'col-span-2';
      case '75':
        return 'col-span-2';
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
      return 'row-span-1 h-32'; // Fixed height for consistency
    case '2':
      return 'row-span-2 h-64'; // Fixed height for consistency
    default:
      return 'row-span-1 h-32'; // Default fixed height
  }
};

