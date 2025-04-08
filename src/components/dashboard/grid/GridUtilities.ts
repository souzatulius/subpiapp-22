
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
      return 'h-[32rem] row-span-4'; // 512px
    case '3':
      return 'h-[24rem] row-span-3'; // 384px
    case '2':
      return 'h-[16rem] row-span-2'; // 256px (adjusted from 20rem)
    case '1':
      return 'h-[10rem] row-span-1'; // 160px
    case '0.5':
      return 'h-[5rem] row-span-1';  // 80px (adjusted from 4rem)
    default:
      return 'h-[10rem] row-span-1'; // 160px default
  }
};
