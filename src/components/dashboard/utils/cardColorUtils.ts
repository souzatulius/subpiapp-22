
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white'; // Azul Vivo
    case 'blue-light': return 'bg-[#66B2FF] text-gray-900'; // Azul Claro - changed to dark text
    case 'blue-dark': return 'bg-[#1D4ED8] text-white'; // Azul Escuro
    case 'green-neon': return 'bg-[#66FF66] text-white'; // Verde Neon
    case 'green-dark': return 'bg-[#00CC00] text-white'; // Verde Escuro
    case 'gray-light': return 'bg-[#F5F5F5] text-gray-800'; // Cinza Claro - dark text
    case 'gray-medium': return 'bg-[#999999] text-white'; // Cinza Médio - Updated to be more medium gray
    case 'orange-dark': return 'bg-[#F25C05] text-white'; // Laranja Escuro
    case 'orange-light': return 'bg-[#F89E66] text-white'; // Laranja Claro
    case 'deep-blue': return 'bg-[#051A2C] text-white'; // Azul Profundo
    case 'neutral-800': return 'bg-neutral-800 text-white'; // Cinza Escuro
    case 'orange-700': return 'bg-orange-700 text-white'; // Nova cor laranja escuro
    case 'bg-orange-500': return 'bg-orange-500 text-white'; // Orange 500
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
    case 'gray-medium': return 'hover:bg-[#777777]'; // Darker Cinza Médio - Updated
    case 'orange-dark': return 'hover:bg-[#D94D04]'; // Darker Laranja Escuro
    case 'orange-light': return 'hover:bg-[#F67A33]'; // Darker Laranja Claro
    case 'deep-blue': return 'hover:bg-[#03111D]'; // Darker Azul Profundo
    case 'neutral-800': return 'hover:bg-neutral-900'; // Darker Cinza Escuro
    case 'orange-700': return 'hover:bg-orange-800'; // Darker Orange-700
    case 'bg-orange-500': return 'hover:bg-orange-600'; // Darker Orange-500
    default: return 'hover:bg-[#0055D4]'; // Default to darker Azul Vivo
  }
};

export const getTextColorClass = (color: CardColor, cardId?: string): string => {
  // Special cases for ranking related cards - always use white text
  if (cardId === 'ranking-zeladoria' || cardId === 'relatorios-comunicacao' || 
      (cardId && cardId.includes('ranking'))) {
    return 'text-white';
  }
  
  switch (color) {
    case 'gray-light':
      return 'text-gray-800'; // Dark text on light backgrounds
    case 'blue-light':
      return 'text-gray-900'; // Dark text on light blue background
    case 'gray-medium':
      return 'text-white'; // White text for medium gray (since we darkened it)
    case 'green-neon':
    case 'green-dark':
      return 'text-white'; // White text for green backgrounds
    case 'bg-orange-500':
      return 'text-white'; // White text on orange background
    default:
      return 'text-white'; // White text on dark backgrounds
  }
};
