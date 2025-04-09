
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { getDefaultCards } from './defaultCards';
import { toast } from '@/hooks/use-toast';
import { useCardStorage } from './useCardStorage';

// Helper function to initialize or update grid positions for cards
const ensureGridPositions = (cards: ActionCardItem[]): ActionCardItem[] => {
  // First, filter out visible cards and sort them if they have positions
  const visibleCards = cards.filter(card => !card.isHidden);
  
  // Separate cards with and without positions
  const positionedCards = visibleCards.filter(
    card => card.isPositionFixed && card.gridRow !== undefined && card.gridColumn !== undefined
  );
  
  const unpositionedCards = visibleCards.filter(
    card => !card.isPositionFixed || card.gridRow === undefined || card.gridColumn === undefined
  );
  
  // Auto-assign positions to cards without them
  const columns = 4; // Standard desktop grid columns
  let currentRow = 0;
  let currentCol = 0;
  
  const positionedUnpositionedCards = unpositionedCards.map(card => {
    // Calculate width and height in grid cells
    const width = getCardWidthInColumns(card.width);
    const height = getCardHeightInRows(card.height);
    
    // Check if card would overflow current row
    if (currentCol + width > columns) {
      currentCol = 0;
      currentRow++;
    }
    
    // Assign position
    const positioned = {
      ...card,
      gridRow: currentRow,
      gridColumn: currentCol,
      isPositionFixed: false // Not manually positioned
    };
    
    // Move current position for next card
    currentCol += width;
    
    // Move to next row if end of row
    if (currentCol >= columns) {
      currentCol = 0;
      currentRow++;
    }
    
    return positioned;
  });
  
  // Combine positioned and newly positioned cards
  return [...positionedCards, ...positionedUnpositionedCards, ...cards.filter(card => card.isHidden)];
};

// Helper functions to convert width/height strings to column/row counts
function getCardWidthInColumns(width?: string): number {
  switch (width) {
    case '25': return 1;
    case '50': return 2;
    case '75': return 3;
    case '100': return 4;
    default: return 1;
  }
}

function getCardHeightInRows(height?: string): number {
  switch (height) {
    case '0.5': return 1;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    default: return 1;
  }
}

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { saveCardConfig, isSaving } = useCardStorage(user, null);

  // Load cards from database or default configuration
  useEffect(() => {
    const fetchUserCards = async () => {
      setIsLoading(true);
      
      if (!user) {
        const defaultCards = getDefaultCards();
        const positionedCards = ensureGridPositions(defaultCards);
        setCards(positionedCards);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', user.id)
          .single();
        
        if (error || !data || !data.cards_config) {
          console.log('Fallback to default cards');
          // Fallback to default cards
          const defaultCards = getDefaultCards();
          const positionedCards = ensureGridPositions(defaultCards);
          setCards(positionedCards);
        } else {
          console.log('Using user cards from DB');
          // Parse JSON if needed
          let userCards = typeof data.cards_config === 'string' 
            ? JSON.parse(data.cards_config) 
            : data.cards_config;
            
          // Ensure all cards have grid positions
          userCards = ensureGridPositions(userCards);
          setCards(userCards);
        }
      } catch (error) {
        console.error('Error fetching user dashboard settings:', error);
        // Fallback to default cards
        const defaultCards = getDefaultCards();
        const positionedCards = ensureGridPositions(defaultCards);
        setCards(positionedCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCards();
  }, [user]);

  // Handle card reordering with auto-save
  const handleCardsReorder = (updatedCards: ActionCardItem[]) => {
    // Determine if we are in mobile view by checking the window width
    const isMobileView = window.innerWidth < 768;
    
    // If in mobile view, update mobileOrder for all cards
    if (isMobileView) {
      updatedCards.forEach((card, index) => {
        card.mobileOrder = index;
      });
    }
    
    // Ensure all cards have grid positions
    const positionedCards = ensureGridPositions(updatedCards);
    setCards(positionedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(positionedCards);
    }
    
    return positionedCards;
  };

  // Handle card edit with auto-save
  const handleCardEdit = (updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(updatedCards);
    }
    
    return updatedCard;
  };

  // Handle card hide with auto-save
  const handleCardHide = (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(updatedCards);
    }
    
    return updatedCards;
  };

  // Reset dashboard to default configuration
  const resetDashboard = () => {
    const defaultCards = getDefaultCards();
    const positionedCards = ensureGridPositions(defaultCards);
    setCards(positionedCards);
    
    // Auto-save configuration to database
    if (user) {
      saveCardConfig(positionedCards);
    }
    
    return positionedCards;
  };

  return {
    cards,
    isLoading,
    isSaving,
    handleCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  };
};
