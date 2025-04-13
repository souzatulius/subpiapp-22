
import { useCallback } from 'react';
import { ActionCardItem, CardWidth, CardHeight } from '@/types/dashboard';
import { getMobileSpecificDimensions } from '../GridUtilities';

export const useCardProcessor = (isMobileView: boolean = false) => {
  // Process card dimensions based on mobile or desktop view
  const processCardDimensions = useCallback((card: ActionCardItem): ActionCardItem => {
    // Always create a new card object to avoid mutation
    const processedCard = { ...card };
    
    // For mobile view, ensure cards are appropriately sized
    if (isMobileView) {
      const mobileSpecific = getMobileSpecificDimensions(card.title);
      
      if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
        processedCard.width = '100' as CardWidth;
        processedCard.height = '2' as CardHeight;
        return processedCard;
      }
      
      processedCard.width = mobileSpecific.width;
      processedCard.height = mobileSpecific.height;
      return processedCard;
    } 
    
    // For desktop, respect original dimensions or use defaults
    if (card.title === "Busca Rápida") {
      processedCard.width = '100' as CardWidth;
      processedCard.height = '0.5' as CardHeight;
    } else if (card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart') {
      processedCard.width = '50' as CardWidth;
      processedCard.height = '2' as CardHeight;
    } else if (card.title === "Demandas" || card.title === "Área da Comunicação") {
      processedCard.width = '25' as CardWidth;
      processedCard.height = '1' as CardHeight;
    } else if (card.title === "Atividades Pendentes") {
      processedCard.width = '25' as CardWidth;
      processedCard.height = '3' as CardHeight;
    } else {
      // Ensure default values are always set
      processedCard.width = processedCard.width || '25' as CardWidth;
      processedCard.height = processedCard.height || '1' as CardHeight;
    }
    
    return processedCard;
  }, [isMobileView]);

  return { processCardDimensions };
};

export default useCardProcessor;
