
import { CardColor } from '@/types/dashboard';

// This function checks if a card background color is considered "light"
export const isLightBackground = (color: CardColor): boolean => {
  return [
    'gray-light', 
    'gray-ultra-light', 
    'blue-light', 
    'green-light', 
    'orange-light', 
    'purple-light',
    'gray-200',
    'neutral-200',
    'blue-960',
    'gray-200'
  ].includes(color);
};

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue': return 'bg-blue-500 text-white';
    case 'green': return 'bg-green-500 text-white';
    case 'orange': return 'bg-orange-500 text-white';
    case 'gray-light': return 'bg-gray-200 text-gray-500';
    case 'gray-dark': return 'bg-gray-700 text-white';
    case 'blue-dark': return 'bg-blue-700 text-white';
    case 'orange-light': return 'bg-orange-300 text-gray-500';
    case 'gray-ultra-light': return 'bg-gray-100 text-gray-500';
    case 'lime': return 'bg-lime-500 text-white';
    case 'orange-600': return 'bg-orange-600 text-white';
    case 'blue-light': return 'bg-blue-300 text-gray-500';
    case 'green-light': return 'bg-green-300 text-gray-500';
    case 'purple-light': return 'bg-purple-300 text-gray-500';
    // Additional color mappings
    case 'gray-400': return 'bg-gray-400 text-white';
    case 'gray-800': return 'bg-gray-800 text-white';
    case 'gray-950': return 'bg-gray-950 text-white';
    case 'blue-700': return 'bg-blue-700 text-white';
    case 'blue-900': return 'bg-blue-900 text-white';
    case 'blue-960': return 'bg-blue-900 text-gray-500';
    case 'orange-400': return 'bg-orange-400 text-white';
    case 'orange-500': return 'bg-orange-500 text-white';
    case 'gray-200': return 'bg-gray-200 text-gray-500';
    case 'lime-500': return 'bg-lime-500 text-white';
    case 'neutral-200': return 'bg-gray-200 text-gray-500';
    default: return 'bg-blue-500 text-white';
  }
};

export const getHoverColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue': return 'hover:bg-blue-600';
    case 'green': return 'hover:bg-green-600';
    case 'orange': return 'hover:bg-orange-600';
    case 'gray-light': return 'hover:bg-gray-300';
    case 'gray-dark': return 'hover:bg-gray-800';
    case 'blue-dark': return 'hover:bg-blue-800';
    case 'orange-light': return 'hover:bg-orange-400';
    case 'gray-ultra-light': return 'hover:bg-gray-200';
    case 'lime': return 'hover:bg-lime-600';
    case 'orange-600': return 'hover:bg-orange-700';
    case 'blue-light': return 'hover:bg-blue-400';
    case 'green-light': return 'hover:bg-green-400';
    case 'purple-light': return 'hover:bg-purple-400';
    // Additional hover color mappings
    case 'gray-400': return 'hover:bg-gray-500';
    case 'gray-800': return 'hover:bg-gray-900';
    case 'gray-950': return 'hover:bg-black';
    case 'blue-700': return 'hover:bg-blue-800';
    case 'blue-900': return 'hover:bg-blue-950';
    case 'blue-960': return 'hover:bg-blue-950';
    case 'orange-400': return 'hover:bg-orange-500';
    case 'orange-500': return 'hover:bg-orange-600';
    case 'gray-200': return 'hover:bg-gray-300';
    case 'lime-500': return 'hover:bg-lime-600';
    case 'neutral-200': return 'hover:bg-gray-300';
    default: return 'hover:bg-blue-600';
  }
};

export const getTextColorClass = (color: CardColor): string => {
  return isLightBackground(color) ? 'text-gray-500' : 'text-white';
};
