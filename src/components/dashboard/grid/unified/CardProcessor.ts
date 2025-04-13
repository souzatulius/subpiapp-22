
import { useCallback } from 'react';
import { ActionCardItem, CardWidth, CardHeight, CardColor } from '@/types/dashboard';
import { getMobileSpecificDimensions } from '../GridUtilities';

// Define extended type to support the additional properties
interface ExtendedCardItem extends ActionCardItem {
  iconColor?: string;
  padding?: string;
}

export const useCardProcessor = (isMobileView: boolean = false) => {
  // Process card dimensions based on mobile or desktop view
  const processCardDimensions = useCallback((card: ActionCardItem): ActionCardItem => {
    // Always create a new card object to avoid mutation
    const processedCard = { ...card } as ExtendedCardItem;
    
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
    } else if (card.title === "Relatórios da Comunicação") {
      // Apply requested styles
      processedCard.color = "bg-gray-500" as CardColor; // Using valid CardColor value
      (processedCard as ExtendedCardItem).iconColor = "text-orange-500";
    } else if (card.title === "Processos e-SIC") {
      // Apply requested styles
      (processedCard as ExtendedCardItem).iconColor = "text-white";
    } else if (card.title === "Notícias do Site") {
      // Apply requested styles
      (processedCard as ExtendedCardItem).iconColor = "text-blue-900";
    } else if (card.title === "Perfil do Usuário") {
      // Apply requested styles
      processedCard.color = "bg-gray-500" as CardColor; // Using valid CardColor value
      (processedCard as ExtendedCardItem).iconColor = "text-blue-500";
    } else if (card.title === "Últimas Notas") {
      // Apply requested styles
      (processedCard as ExtendedCardItem).iconColor = "text-blue-900";
      processedCard.color = "bg-blue-500" as CardColor; // Using valid CardColor value
      (processedCard as ExtendedCardItem).padding = "pb-4";
    } else if (card.title === "Últimas Demandas") {
      // Apply requested styles
      (processedCard as ExtendedCardItem).iconColor = "text-gray-800";
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
