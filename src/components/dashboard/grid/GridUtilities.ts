
import { CardWidth, CardHeight } from '@/types/dashboard';

export const getWidthClass = (width?: CardWidth, isMobileView: boolean = false): string => {
  if (isMobileView) {
    return 'col-span-1'; // Mobile always uses full width
  }
  
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
};

export const getHeightClass = (height?: CardHeight): string => {
  switch (height) {
    case '0.5':
      return 'h-20'; // Half height
    case '2':
      return 'h-80';
    case '3':
      return 'h-96';
    case '4':
      return 'h-120';
    case '1':
    default:
      return 'h-40';
  }
};
