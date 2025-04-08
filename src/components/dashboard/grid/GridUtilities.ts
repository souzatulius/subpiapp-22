
import { CardWidth, CardHeight } from '@/types/dashboard';

export const getWidthClass = (width: CardWidth = '25', isMobileView: boolean = false): string => {
  if (isMobileView) {
    // On mobile, all cards should take up full width with 2 columns layout in CardGrid
    return width === '25' || width === '50' ? 'col-span-1' : 'col-span-2';
  }

  // On larger screens
  switch (width) {
    case '100':
      return 'col-span-4';
    case '75':
      return 'col-span-3';
    case '50':
      return 'col-span-2';
    case '25':
    default:
      return 'col-span-1';
  }
};

export const getHeightClass = (height: CardHeight = '1'): string => {
  switch (height) {
    case '4':
      return 'h-full row-span-4'; // 4 rows
    case '3':
      return 'h-full row-span-3'; // 3 rows
    case '2':
      return 'h-full row-span-2'; // 2 rows
    case '1':
      return 'h-full row-span-1'; // 1 row
    case '0.5':
      return 'h-full row-span-1';  // half row (still takes 1 grid row)
    default:
      return 'h-full row-span-1';
  }
};
