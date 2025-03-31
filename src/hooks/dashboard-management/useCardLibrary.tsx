
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CardLibraryFilters {
  type: string;
  tag: string;
  dashboard: string;
  department: string;
}

export const useCardLibrary = (onAddCard?: (card: ActionCardItem) => void) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CardLibraryFilters>({
    type: 'all',
    tag: 'all',
    dashboard: 'all',
    department: 'all'
  });

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

  // Filter cards based on selected filters
  const applyFilters = (cards: ActionCardItem[]) => {
    return cards.filter(card => {
      const typeMatch = filters.type === 'all' || card.type === filters.type;
      const dashboardMatch = filters.dashboard === 'all' || card._dashboardType === filters.dashboard;
      const departmentMatch = filters.department === 'all' || card._departmentId === filters.department;
      
      // Tag filter
      let tagMatch = filters.tag === 'all';
      if (filters.tag === 'quickDemand' && card.isQuickDemand) tagMatch = true;
      if (filters.tag === 'search' && card.isSearch) tagMatch = true;
      if (filters.tag === 'overdueDemands' && card.isOverdueDemands) tagMatch = true;
      if (filters.tag === 'pendingActions' && card.isPendingActions) tagMatch = true;
      
      return typeMatch && dashboardMatch && departmentMatch && tagMatch;
    });
  };

  // Create a card from a template
  const createCardFromTemplate = (card: ActionCardItem): ActionCardItem => {
    const newCard: ActionCardItem = {
      ...card,
      id: `card-${uuidv4()}`, // Generate new ID to avoid conflicts
    };
    return newCard;
  };

  // Create a blank card
  const createBlankCard = (): ActionCardItem => {
    return {
      id: `card-${uuidv4()}`,
      title: "Novo Card",
      iconId: "clipboard",
      path: "/",
      color: "blue",
      type: "standard",
      width: "25",
      height: "1",
    };
  };

  const handleAddToLibrary = (card: ActionCardItem) => {
    if (onAddCard) {
      const newCard = createCardFromTemplate(card);
      onAddCard(newCard);
    }
  };

  return {
    cards: applyFilters(filteredCards),
    loading,
    searchQuery,
    setSearchQuery,
    handleAddToLibrary,
    filters,
    setFilters,
    createCardFromTemplate,
    createBlankCard
  };
};
