
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue': return 'bg-blue-500 text-white';
    case 'green': return 'bg-green-500 text-white';
    case 'orange': return 'bg-orange-500 text-white';
    case 'gray-light': return 'bg-gray-200 text-gray-800';
    case 'gray-dark': return 'bg-gray-700 text-white';
    case 'blue-dark': return 'bg-blue-700 text-white';
    case 'orange-light': return 'bg-orange-300 text-gray-800';
    case 'gray-ultra-light': return 'bg-gray-100 text-gray-800';
    case 'lime': return 'bg-lime-500 text-white';
    case 'orange-600': return 'bg-orange-600 text-white';
    case 'blue-light': return 'bg-blue-300 text-gray-800';
    case 'green-light': return 'bg-green-300 text-gray-800';
    case 'purple-light': return 'bg-purple-300 text-gray-800';
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
    default: return 'hover:bg-blue-600';
  }
};

export const getTextColorClass = (color: CardColor): string => {
  switch (color) {
    case 'gray-light':
    case 'gray-ultra-light':
    case 'blue-light':
    case 'green-light':
    case 'orange-light':
    case 'purple-light':
      return 'text-gray-800';
    default:
      return 'text-white';
  }
};
