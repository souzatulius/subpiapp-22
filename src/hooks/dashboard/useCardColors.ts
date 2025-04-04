
import { CardColor } from '@/types/dashboard';

export const getBgColor = (color: string): CardColor => {
  switch (color) {
    case 'grey-400': return 'gray-400' as CardColor;
    case 'grey-800': return 'gray-800' as CardColor;
    case 'grey-950': return 'gray-950' as CardColor;
    case 'blue-700': return 'blue-700' as CardColor;
    case 'blue-960': return 'blue-900' as CardColor;
    case 'orange-400': return 'orange-400' as CardColor;
    case 'orange-500': return 'orange-500' as CardColor;
    case 'neutral-200': return 'gray-200' as CardColor;
    case 'lime-500': return 'lime-500' as CardColor;
    default: return 'blue-700' as CardColor;
  }
};
