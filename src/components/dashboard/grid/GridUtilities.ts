import { CardWidth, CardHeight } from '@/types/dashboard';

export const getWidthClass = (width?: CardWidth, isMobileView: boolean = false): string => {
  if (isMobileView) {
    switch (width) {
      case '25':
        return 'col-span-1';
      case '50':
        return 'col-span-1'; // Mobile 50% is just 1 column (2-column grid)
      case '75':
        return 'col-span-2';
      case '100':
        return 'col-span-2'; // Mobile 100% is full width (2 columns)
      default:
        return 'col-span-1';
    }
  }
  
  switch (width) {
    case '25':
      return 'col-span-1';
    case '50':
      return 'col-span-2';
    case '75':
      return 'col-span-3';
    case '100':
      return 'col-span-4';
    default:
      return 'col-span-1';
  }
};

export const getHeightClass = (height?: CardHeight, isMobileView: boolean = false): string => {
  // For specific cards on mobile, we might want different heights
  if (isMobileView) {
    switch (height) {
      case '0.5':
        return 'h-24'; // Half height on mobile
      case '2':
        return 'h-80'; // Double height on mobile
      case '3':
        return 'h-96'; // Triple height on mobile
      case '4':
        return 'h-120'; // Quadruple height on mobile
      case '1':
      default:
        return 'h-40'; // Default height on mobile
    }
  }

  // Regular desktop heights - using row spans instead of fixed heights
  switch (height) {
    case '0.5':
      return 'row-span-1 h-24'; // Half height
    case '2':
      return 'row-span-2';
    case '3':
      return 'row-span-3';
    case '4':
      return 'row-span-4';
    case '1':
    default:
      return 'row-span-1';
  }
};

// Get mobile-specific dimensions for specific cards
export const getMobileSpecificDimensions = (cardTitle: string): { width: CardWidth, height: CardHeight } => {
  switch (cardTitle) {
    case "Busca Rápida":
      return { width: '100' as CardWidth, height: '1' as CardHeight }; // 2 columns, full height on mobile
    case "Ranking Zeladoria":
    case "Relatório Comunicação":
    case "Responder Demanda":
    case "Aprovar Notas":
    case "Notícias do Site":
    case "Processos e-SIC":
      return { width: '50' as CardWidth, height: '1' as CardHeight }; // 1 column, 1 row on mobile
    case "Responder Demanda Dinâmico":
    case "Aprovar Nota Dinâmico":
    case "Ajustes de Notificação":
      return { width: '100' as CardWidth, height: '1' as CardHeight }; // 2 columns, 1 row on mobile
    case "Perfil do Usuário":
      return { width: '50' as CardWidth, height: '1' as CardHeight }; // 1 column, 1 row on mobile
    case "Ações Pendentes":
      return { width: '100' as CardWidth, height: '2' as CardHeight }; // 2 columns, 2 rows on mobile
    default:
      return { width: '50' as CardWidth, height: '1' as CardHeight }; // Default size for mobile
  }
};

// Function to determine if a card can be placed next to a height-2 card
export const canPlaceNextToHeightTwo = (occupiedSpace: boolean[][], startRow: number, startCol: number): boolean => {
  // Check if the specified position is available for a height-1 card
  if (startRow >= occupiedSpace.length) return false;
  if (startCol >= 4) return false; // Grid has 4 columns max
  
  // Check if this specific position is free
  return !occupiedSpace[startRow][startCol];
};
