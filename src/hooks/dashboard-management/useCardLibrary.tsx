
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem, CardType, CardColor } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export interface CardLibraryFilters {
  type?: CardType | 'all';
  tag?: string | 'all';
  dashboard?: 'dashboard' | 'communication' | 'all';
  department?: string | 'all';
}

export const useCardLibrary = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CardLibraryFilters>({
    type: 'all',
    tag: 'all',
    dashboard: 'all',
    department: 'all'
  });

  // Load all available cards from all departments
  const loadAllCards = async () => {
    setLoading(true);
    try {
      // Get all department dashboards
      const { data: departmentDashboards, error } = await supabase
        .from('department_dashboards')
        .select('*');
      
      if (error) throw error;
      
      // Extract and deduplicate all cards
      const allCards: ActionCardItem[] = [];
      const cardIds = new Set<string>();
      
      departmentDashboards?.forEach(dashboard => {
        if (dashboard.cards_config) {
          try {
            const dashboardCards = JSON.parse(dashboard.cards_config);
            if (Array.isArray(dashboardCards)) {
              dashboardCards.forEach(card => {
                // Store department and dashboard information with the card
                // Handle both view_type and dashboard_type (backward compatibility)
                const dashboardType = dashboard.view_type || 'dashboard';
                const cardWithMeta = {
                  ...card,
                  _departmentId: dashboard.department,
                  _dashboardType: dashboardType
                };
                
                // Only add if not already added (based on title + type + icon)
                const cardSignature = `${card.title}-${card.type}-${card.iconId}`;
                if (!cardIds.has(cardSignature)) {
                  cardIds.add(cardSignature);
                  allCards.push(cardWithMeta);
                }
              });
            }
          } catch (parseError) {
            console.error("Error parsing cards_config:", parseError);
          }
        }
      });
      
      setCards(allCards);
    } catch (error) {
      console.error("Error loading card library:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadAllCards();
  }, []);
  
  // Filter cards based on current filters
  const filteredCards = cards.filter(card => {
    // Filter by type
    if (filters.type !== 'all' && card.type !== filters.type) {
      return false;
    }
    
    // Filter by tag
    if (filters.tag !== 'all') {
      if (filters.tag === 'quickDemand' && !card.isQuickDemand) return false;
      if (filters.tag === 'search' && !card.isSearch) return false;
      if (filters.tag === 'overdueDemands' && !card.isOverdueDemands) return false;
      if (filters.tag === 'pendingActions' && !card.isPendingActions) return false;
    }
    
    // Filter by dashboard type
    if (filters.dashboard !== 'all' && card._dashboardType !== filters.dashboard) {
      return false;
    }
    
    // Filter by department
    if (filters.department !== 'all' && card._departmentId !== filters.department) {
      return false;
    }
    
    return true;
  });
  
  // Create a new card from a template
  const createCardFromTemplate = (template: ActionCardItem): ActionCardItem => {
    return {
      ...template,
      id: `card-${uuidv4()}`,
      isCustom: true,
      version: '1.0'
    };
  };
  
  // Create a blank card
  const createBlankCard = (): ActionCardItem => {
    return {
      id: `card-${uuidv4()}`,
      title: 'Novo Card',
      iconId: 'clipboard-list',
      path: '/dashboard',
      color: 'blue' as CardColor,
      width: '25',
      height: '1',
      isCustom: true,
      type: 'standard',
      version: '1.0'
    };
  };
  
  return {
    cards: filteredCards,
    loading,
    filters,
    setFilters,
    createCardFromTemplate,
    createBlankCard,
    refreshCards: loadAllCards
  };
};
