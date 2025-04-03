
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getCommunicationActionCards } from '@/hooks/dashboard/defaultCards';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from API or other source
    const loadCards = async () => {
      setIsLoading(true);
      try {
        // Get the new action cards
        const actionCards = getCommunicationActionCards();
        
        // Here you could merge with cards from other sources if needed
        setAvailableCards(actionCards);
      } catch (error) {
        console.error('Error loading available cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, []);

  return { availableCards, isLoading };
};
