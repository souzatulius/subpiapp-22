
import { getDefaultCards } from './defaultCards';
import { ActionCardItem } from '@/types/dashboard';

// Get the default dashboard card configuration
export const getDefaultDashboardConfig = (): ActionCardItem[] => {
  return getDefaultCards();
};

// Check if a card is a default card by its ID
export const isDefaultCard = (cardId: string): boolean => {
  return getDefaultCards().some(card => card.id === cardId);
};

// Get a specific card by its ID from the defaults
export const getCardById = (cardId: string): ActionCardItem | undefined => {
  return getDefaultCards().find(card => card.id === cardId);
};
