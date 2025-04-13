
import { useCallback } from 'react';
import { ActionCardItem } from '@/types/dashboard';

export const useCardProcessor = (isMobileView: boolean = false) => {
  // Process card dimensions based on mobile or desktop view
  const processCardDimensions = useCallback((card: ActionCardItem): ActionCardItem => {
    // For mobile view, ensure cards are appropriately sized
    if (isMobileView) {
      return {
        ...card,
        width: '50', // Force all cards to be 50% width on mobile
        height: card.height || '1'
      };
    }
    
    // For desktop, respect original dimensions or use defaults
    return {
      ...card,
      width: card.width || '25',
      height: card.height || '1'
    };
  }, [isMobileView]);

  return { processCardDimensions };
};
