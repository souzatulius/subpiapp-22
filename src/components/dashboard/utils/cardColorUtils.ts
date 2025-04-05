
import { CardColor } from '@/types/dashboard';

export const getColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'bg-[#0066FF] text-white'; // Azul 
    case 'green-neon': return 'bg-[#66FF66] text-gray-800'; // Verde Neon - dark text
    case 'gray-light': return 'bg-[#F5F5F5] text-gray-800'; // Cinza Claro - dark text
    case 'orange-dark': return 'bg-[#F25C05] text-white'; // Laranja Escuro
    case 'gray-dark': return 'bg-[#4B5563] text-white'; // Cinza Escuro
    case 'orange-light': return 'bg-[#F89E66] text-gray-800'; // Laranja Claro - dark text
    case 'lime-green': return 'bg-[#84cc16] text-gray-800'; // Verde Limão - dark text
    case 'blue-dark': return 'bg-[#1D4ED8] text-white'; // Azul Escuro
    default: return 'bg-[#0066FF] text-white'; // Default to Azul Vivo
  }
};

export const getHoverColorClasses = (color: CardColor): string => {
  switch (color) {
    case 'blue-vivid': return 'hover:bg-[#66B2FF]'; // Lighter Azul
    case 'green-neon': return 'hover:bg-[#00CC00]'; // Darker Verde Neon
    case 'gray-light': return 'hover:bg-[#FAFAFA]'; // Lighter Cinza Claro
    case 'orange-dark': return 'hover:bg-[#F89E66]'; // Lighter Laranja Escuro
    case 'gray-dark': return 'hover:bg-[#6B7280]'; // Lighter Cinza Escuro
    case 'orange-light': return 'hover:bg-[#FDBA74]'; // Lighter Laranja Claro
    case 'lime-green': return 'hover:bg-[#a3e635]'; // Lighter Verde Limão
    case 'blue-dark': return 'hover:bg-blue-900'; // Slightly darker Azul Escuro
    default: return 'hover:bg-[#66B2FF]'; // Default to lighter Azul
  }
};

export const getTextColorClass = (color: CardColor): string => {
  switch (color) {
    case 'gray-light':
    case 'green-neon':
    case 'orange-light':
    case 'lime-green':
      return 'text-gray-800'; // Dark text on light backgrounds
    default:
      return 'text-white'; // White text on dark backgrounds
  }
};
