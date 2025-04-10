
import { CardWidth, CardHeight } from '@/types/dashboard';

export const getWidthClass = (width?: CardWidth, isMobileView: boolean = false): string => {
  if (isMobileView) {
    switch (width) {
      case '25':
        return 'col-span-1';
      case '50':
        return 'col-span-1'; // Em mobile, 50% também ocupa 1 coluna (de um total de 2)
      case '75':
        return 'col-span-2';
      case '100':
        return 'col-span-2'; // Em mobile, 100% ocupa largura total (2 colunas)
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
  // Para specific cards on mobile, we might want different heights
  if (isMobileView) {
    switch (height) {
      case '0.5':
        return 'h-20'; // Half height on mobile
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

  // Regular desktop heights
  switch (height) {
    case '0.5':
      return 'h-20'; // Half height
    case '2':
      return 'h-80';
    case '3':
      return 'h-96';
    case '4':
      return 'h-120';
    case '1':
    default:
      return 'h-40';
  }
};

// Get mobile-specific dimensions for specific cards
export const getMobileSpecificDimensions = (cardTitle: string): { width: CardWidth, height: CardHeight } => {
  switch (cardTitle) {
    case "Busca Rápida":
      return { width: '100' as CardWidth, height: '0.5' as CardHeight }; // 2 columns, half height on mobile
    case "Demandas":
    case "Avisos":
    case "Responder Demandas":
    case "Ranking da Zeladoria":
    case "Nova Solicitação":
    case "Nova Demanda":
    case "Cadastrar Demanda":
    case "Aprovar Nota":
    case "Criar Nota":
    case "Criar Nota de Imprensa":
    case "Consultar Notas":
    case "Cadastrar Release":
    case "Releases e Notícias":
      return { width: '50' as CardWidth, height: '1' as CardHeight }; // 1 column, 1 row on mobile
    case "Origem das Demandas":
    case "Cadastro de nova solicitação de imprensa":
      return { width: '100' as CardWidth, height: '2' as CardHeight }; // 2 columns, 2 rows on mobile
    case "Ações Pendentes":
      return { width: '50' as CardWidth, height: '2' as CardHeight }; // 1 column, 2 rows on mobile
    case "Processos e-SIC":
      return { width: '50' as CardWidth, height: '1' as CardHeight }; // 1 column, 1 row on mobile
    case "Notificações":
      return { width: '50' as CardWidth, height: '0.5' as CardHeight }; // 1 column, half row on mobile
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
