
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white'; // Azul Vivo
    case 'green-neon': return 'bg-[#00FF00] text-gray-800'; // Verde Neon - dark text
    case 'gray-light': return 'bg-[#F5F5F5] text-gray-800'; // Cinza Claro - dark text
    case 'orange-dark': return 'bg-[#F25C05] text-white'; // Laranja Escuro
    case 'yellow': return 'bg-yellow-400 text-gray-800'; // Amarelo - dark text
    case 'blue-dark': return 'bg-blue-800 text-white'; // Azul Escuro
    default: return 'bg-[#0066FF] text-white'; // Default to Azul Vivo
  }
};

export const getHoverColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'hover:bg-blue-600'; // Slightly darker Azul Vivo
    case 'green-neon': return 'hover:bg-green-400'; // Slightly darker Verde Neon
    case 'gray-light': return 'hover:bg-gray-200'; // Slightly darker Cinza Claro
    case 'orange-dark': return 'hover:bg-orange-600'; // Slightly darker Laranja Escuro
    case 'yellow': return 'hover:bg-yellow-500'; // Slightly darker Amarelo
    case 'blue-dark': return 'hover:bg-blue-900'; // Slightly darker Azul Escuro
    default: return 'hover:bg-blue-600'; // Default to darker Azul Vivo
  }
};

export const getTextColorClass = (color: CardColor): string => {
  switch (color) {
    case 'gray-light':
    case 'green-neon':
    case 'yellow':
      return 'text-gray-800'; // Dark text on light backgrounds
    default:
      return 'text-white'; // White text on dark backgrounds
  }
};
