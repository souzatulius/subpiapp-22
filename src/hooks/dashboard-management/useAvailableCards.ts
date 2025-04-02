
import { useState, useEffect } from 'react';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';
import { ActionCardItem } from '@/types/dashboard';

export const useAvailableCards = () => {
  const [availableCards, setAvailableCards] = useState<ActionCardItem[]>([]);
  const [dynamicCards, setDynamicCards] = useState<ActionCardItem[]>([]);
  const [standardCards, setStandardCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all default cards
    const allCards = getDefaultCards(true);
    
    // Separate dynamic and standard cards
    const dynamic = allCards.filter(card => card.type === 'data_dynamic');
    const standard = allCards.filter(card => card.type !== 'data_dynamic');
    
    setAvailableCards(allCards);
    setDynamicCards(dynamic);
    setStandardCards(standard);
    setLoading(false);
  }, []);

  return {
    availableCards,
    dynamicCards,
    standardCards,
    loading
  };
};
