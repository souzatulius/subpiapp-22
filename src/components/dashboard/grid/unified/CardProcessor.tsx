
import { useCallback } from 'react';
import { ActionCardItem, CardWidth, CardHeight } from '@/types/dashboard';
import { getMobileSpecificDimensions } from '../GridUtilities';

export const useCardProcessor = (isMobileView: boolean = false) => {
  const processCardDimensions = useCallback((card: ActionCardItem) => {
    if (isMobileView) {
      // Apply mobile-specific dimensions from the mapping function
      const mobileSpecific = getMobileSpecificDimensions(card.title);
      
      // Special cases for specific cards
      if (card.id === 'dashboard-search-card' || card.isSearch) {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '1' as CardHeight
        };
      }
      
      if (card.id === 'responder-demanda-dinamico-card' || card.id === 'aprovar-nota-dinamico-card' || 
          card.id === 'ajustes-notificacao-card') {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '1' as CardHeight
        };
      }
      
      if (card.id === 'acoes-pendentes-card' || card.isPendingTasks) {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '2' as CardHeight
        };
      }
      
      return {
        ...card,
        width: mobileSpecific.width,
        height: mobileSpecific.height
      };
    } else {
      // Desktop view processing
      if (card.id === 'dashboard-search-card' || card.isSearch) {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '0.5' as CardHeight
        };
      } 
      
      if (card.id === 'responder-demanda-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '0.5' as CardHeight
        };
      }
      
      if (card.id === 'aprovar-notas-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '0.5' as CardHeight
        };
      }
      
      if (card.id === 'noticias-site-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '0.5' as CardHeight
        };
      }
      
      if (card.id === 'esic-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '0.5' as CardHeight
        };
      }
      
      if (card.id === 'responder-demanda-dinamico-card' || 
          card.id === 'aprovar-nota-dinamico-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '2' as CardHeight
        };
      }
      
      if (card.id === 'ranking-zeladoria-card' || 
          card.id === 'relatorio-comunicacao-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '1' as CardHeight
        };
      }
      
      if (card.id === 'perfil-usuario-card' || 
          card.id === 'ajustes-notificacao-card') {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '1' as CardHeight
        };
      }
      
      if (card.id === 'acoes-pendentes-card' || card.isPendingTasks) {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '2' as CardHeight
        };
      }
    }
    return card;
  }, [isMobileView]);

  return { processCardDimensions };
};

export default useCardProcessor;
