
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white'; // Azul Vivo
    case 'blue-light': return 'bg-[#66B2FF] text-gray-800'; // Azul Claro - changed to dark text
    case 'blue-dark': return 'bg-[#1D4ED8] text-white'; // Azul Escuro
    case 'green-neon': return 'bg-[#66FF66] text-white'; // Verde Neon - updated to white text
    case 'green-dark': return 'bg-[#00CC00] text-white'; // Verde Escuro - updated to white text
    case 'gray-light': return 'bg-[#F5F5F5] text-gray-800'; // Cinza Claro - dark text
    case 'gray-medium': return 'bg-[#D4D4D4] text-gray-800'; // Cinza Médio - dark text
    case 'orange-dark': return 'bg-[#F25C05] text-white'; // Laranja Escuro
    case 'orange-light': return 'bg-[#F89E66] text-white'; // Laranja Claro
    case 'deep-blue': return 'bg-[#051A2C] text-white'; // Azul Profundo
    case 'neutral-800': return 'bg-neutral-800 text-white'; // Cinza Escuro
    default: return 'bg-[#0066FF] text-white'; // Default to Azul Vivo
  }
};

export const getHoverColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'hover:bg-[#0055D4]'; // Darker Azul Vivo
    case 'blue-light': return 'hover:bg-[#3399FF]'; // Darker Azul Claro
    case 'blue-dark': return 'hover:bg-[#1A3EBF]'; // Darker Azul Escuro
    case 'green-neon': return 'hover:bg-[#33FF33]'; // Darker Verde Neon
    case 'green-dark': return 'hover:bg-[#00AA00]'; // Darker Verde Escuro
    case 'gray-light': return 'hover:bg-[#EBEBEB]'; // Darker Cinza Claro
    case 'gray-medium': return 'hover:bg-[#C0C0C0]'; // Darker Cinza Médio
    case 'orange-dark': return 'hover:bg-[#D94D04]'; // Darker Laranja Escuro
    case 'orange-light': return 'hover:bg-[#F67A33]'; // Darker Laranja Claro
    case 'deep-blue': return 'hover:bg-[#03111D]'; // Darker Azul Profundo
    case 'neutral-800': return 'hover:bg-neutral-900'; // Darker Cinza Escuro
    default: return 'hover:bg-[#0055D4]'; // Default to darker Azul Vivo
  }
};

export const getTextColorClass = (color: CardColor, cardId?: string): string => {
  // Special case for Ranking Zeladoria card - always use gray-950 text
  if (cardId === 'ranking-zeladoria') {
    return 'text-gray-950';
  }
  
  switch (color) {
    case 'gray-light':
    case 'gray-medium':
      return 'text-gray-800'; // Dark text on light backgrounds
    case 'green-neon':
    case 'green-dark':
    case 'blue-light': // Added blue-light to get dark text
      return 'text-white'; // Changed to white text for green backgrounds
    default:
      return 'text-white'; // White text on dark backgrounds
  }
};
