
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white'; // Azul Vivo
    case 'blue-light': return 'bg-[#66B2FF] text-white'; // Azul Claro
    case 'blue-dark': return 'bg-[#1D4ED8] text-white'; // Azul Escuro
    case 'green-neon': return 'bg-[#66FF66] text-gray-800'; // Verde Neon - dark text
    case 'green-dark': return 'bg-[#00CC00] text-gray-800'; // Verde Escuro - dark text
    case 'gray-light': return 'bg-[#F5F5F5] text-gray-800'; // Cinza Claro - dark text
    case 'gray-lighter': return 'bg-[#FAFAFA] text-gray-800'; // Cinza Mais Claro - dark text
    case 'gray-medium': return 'bg-[#D4D4D4] text-gray-800'; // Cinza Médio - dark text
    case 'orange-dark': return 'bg-[#F25C05] text-white'; // Laranja Escuro
    case 'orange-light': return 'bg-[#F89E66] text-white'; // Laranja Claro
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
    case 'gray-lighter': return 'hover:bg-[#F0F0F0]'; // Darker Cinza Mais Claro
    case 'gray-medium': return 'hover:bg-[#C0C0C0]'; // Darker Cinza Médio
    case 'orange-dark': return 'hover:bg-[#D94D04]'; // Darker Laranja Escuro
    case 'orange-light': return 'hover:bg-[#F67A33]'; // Darker Laranja Claro
    default: return 'hover:bg-[#0055D4]'; // Default to darker Azul Vivo
  }
};

export const getTextColorClass = (color: CardColor): string => {
  switch (color) {
    case 'gray-light':
    case 'gray-lighter':
    case 'gray-medium':
    case 'green-neon':
    case 'green-dark':
      return 'text-gray-800'; // Dark text on light backgrounds
    default:
      return 'text-white'; // White text on dark backgrounds
  }
};
