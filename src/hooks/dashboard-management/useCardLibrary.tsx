
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useCardLibrary = (onAddCard: (card: ActionCardItem) => void) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLibraryCards();
  }, []);

  const fetchLibraryCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config, department, view_type');

      if (error) throw error;

      const libraryCards: ActionCardItem[] = [];

      // Process all department dashboards to extract cards
      if (data) {
        data.forEach((dashboard) => {
          if (dashboard.cards_config) {
            try {
              const parsedCards = JSON.parse(dashboard.cards_config) as ActionCardItem[];
              
              // Add department and view_type info to each card for context
              parsedCards.forEach((card) => {
                libraryCards.push({
                  ...card,
                  _departmentId: dashboard.department,
                  _dashboardType: dashboard.view_type as 'dashboard' | 'communication'
                });
              });
            } catch (e) {
              console.error('Error parsing cards config:', e);
            }
          }
        });
      }

      // Remove duplicates based on a combination of title and iconId
      const uniqueCards = libraryCards.filter((card, index, self) => {
        // Skip special card types to avoid duplicating them in the library
        if (card.isQuickDemand || card.isSearch || card.isOverdueDemands || card.isPendingActions || card.isNewCardButton) {
          return false;
        }
        
        return index === self.findIndex((c) => (c.title === card.title && c.iconId === card.iconId));
      });

      setCards(uniqueCards);
    } catch (error) {
      console.error('Error fetching card library:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch card library.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = searchQuery
    ? cards.filter((card) => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.path?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const handleAddToLibrary = (card: ActionCardItem) => {
    const newCard: ActionCardItem = {
      ...card,
      id: `card-${uuidv4()}`, // Generate new ID to avoid conflicts
    };
    
    onAddCard(newCard);
  };

  return {
    cards: filteredCards,
    loading,
    searchQuery,
    setSearchQuery,
    handleAddToLibrary,
  };
};
