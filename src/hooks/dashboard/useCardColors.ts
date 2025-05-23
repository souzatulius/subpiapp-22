
import { CardColor } from '@/types/dashboard';

export const getBgColor = (color: string): CardColor => {
  switch (color) {
    case 'blue': return 'blue-vivid' as CardColor;
    case 'blue-light': return 'blue-light' as CardColor;
    case 'green': return 'green-neon' as CardColor;
    case 'green-dark': return 'green-dark' as CardColor;
    case 'green-teal': return 'green-teal' as CardColor; // Nova cor adicionada
    case 'orange': return 'orange-dark' as CardColor;
    case 'orange-light': return 'orange-light' as CardColor;
    case 'gray-light': return 'gray-light' as CardColor;
    case 'gray-medium': return 'gray-medium' as CardColor;
    case 'deep-blue': return 'deep-blue' as CardColor;
    case 'neutral-800': return 'neutral-800' as CardColor;
    // map legacy colors to new palette
    case 'grey-400': 
    case 'gray-400': 
    case 'gray-800': 
    case 'gray-950': return 'gray-medium' as CardColor; // Alterado para cinza mais claro
    case 'blue-700': 
    case 'blue-960': 
    case 'blue-900': return 'blue-dark' as CardColor;
    case 'orange-400': 
    case 'orange-500': 
    case 'orange-600': return 'orange-dark' as CardColor;
    case 'neutral-200':
    case 'gray-200': return 'gray-light' as CardColor;
    case 'lime-500':
    case 'lime': return 'green-neon' as CardColor;
    // Yellow color mapping - map to orange-light como uma substituição
    case 'yellow':
    case 'yellow-400':
    case 'yellow-500': return 'orange-light' as CardColor;
    default: return 'blue-vivid' as CardColor;
  }
};
