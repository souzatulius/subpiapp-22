
import { useCallback } from 'react';
import { ActionCardItem, CardWidth, CardHeight } from '@/types/dashboard';
import { getMobileSpecificDimensions } from '../GridUtilities';

export const useCardProcessor = (isMobileView: boolean = false) => {
  const processCardDimensions = useCallback((card: ActionCardItem) => {
    if (isMobileView) {
      const mobileSpecific = getMobileSpecificDimensions(card.title);
      
      if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
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
      if (card.title === "Busca Rápida") {
        return {
          ...card,
          width: '100' as CardWidth,
          height: '0.5' as CardHeight
        };
      } else if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
        return {
          ...card,
          width: '50' as CardWidth,
          height: '2' as CardHeight
        };
      } else if (card.title === "Demandas" || card.title === "Área da Comunicação") {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '1' as CardHeight
        };
      } else if (card.title === "Atividades Pendentes") {
        return {
          ...card,
          width: '25' as CardWidth,
          height: '3' as CardHeight
        };
      }
    }
    return card;
  }, [isMobileView]);

  return { processCardDimensions };
};

export default useCardProcessor;
