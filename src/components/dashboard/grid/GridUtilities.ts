
import { CardWidth, CardHeight } from '@/types/dashboard';

// Get width class based on width
export const getWidthClass = (width?: string, isMobile: boolean = false): string => {
  if (isMobile) {
    // For mobile view, we use a modified grid
    switch (width) {
      case '100':
      case '75':
        return 'col-span-2'; // Full width on mobile (spans both columns)
      case '50':
        return 'col-span-1'; // Half width (1 of 2 columns)
      case '25':
        return 'col-span-1'; // Quarter width (also 1 of 2 columns on mobile)
      default:
        return 'col-span-1'; // Default half width on mobile
    }
  } else {
    // For desktop view
    switch (width) {
      case '100':
        return 'col-span-4'; // Full width
      case '75':
        return 'col-span-3'; // 3/4 width
      case '50':
        return 'col-span-2'; // Half width
      case '25':
        return 'col-span-1'; // Quarter width
      default:
        return 'col-span-1'; // Default to quarter width
    }
  }
};

// Get height class based on height
export const getHeightClass = (height?: string, isMobile: boolean = false): string => {
  const baseClass = isMobile ? 'h-auto ' : 'h-auto ';
  
  switch (height) {
    case '4':
      return `${baseClass}row-span-4`;
    case '3':
      return `${baseClass}row-span-3`;
    case '2':
      return `${baseClass}row-span-2`;
    case '1':
      return `${baseClass}row-span-1`;
    case '0.5':
      return `${baseClass}row-span-1 h-16`;
    default:
      return `${baseClass}row-span-1`;
  }
};

// Get mobile-specific dimensions based on card title or type
export const getMobileSpecificDimensions = (title: string): { width: CardWidth, height: CardHeight } => {
  // Special case for certain cards
  switch (title) {
    case "Busca Rápida":
      return { width: '100', height: '0.5' };
    case "Cadastrar Demanda":
    case "Consultar Demandas":
    case "Ver Notas de Imprensa":
    case "Responder Demanda":
    case "Aprovar Notas":
      return { width: '50', height: '2' };
    case "Nova Solicitação da Imprensa":
      return { width: '100', height: '2' };
    case "Demandas em andamento":
    case "Notas de imprensa":
      return { width: '100', height: '3' };
    case "Atividades Pendentes":
      return { width: '100', height: '3' };
    default:
      return { width: '50', height: '1' };
  }
};
