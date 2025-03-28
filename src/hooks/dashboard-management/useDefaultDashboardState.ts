
import { useState, useEffect } from 'react';
import { useCardActions } from '../dashboard/useCardActions';
import { useSpecialCardActions } from '../dashboard/useSpecialCardActions';
import { useSpecialCardsData } from '../dashboard/useSpecialCardsData';
import { ActionCardItem } from '../dashboard/types';
import { getDefaultCards } from '../dashboard/defaultCards';
import { supabase } from '@/integrations/supabase/client';

export const useDefaultDashboardState = (department: string = 'default') => {
  // State for department specific cards
  const [cards, setCards] = useState<ActionCardItem[]>(getDefaultCards());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch department specific cards from database
  useEffect(() => {
    const fetchDepartmentCards = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', department)
          .single();

        if (error) {
          console.error('Error fetching dashboard configuration:', error);
          // If there's no specific configuration, use the default
          setCards(getDefaultCards());
          return;
        }

        if (data?.cards_config) {
          try {
            const departmentCards = JSON.parse(data.cards_config);
            if (Array.isArray(departmentCards) && departmentCards.length > 0) {
              setCards(departmentCards);
            } else {
              setCards(getDefaultCards());
            }
          } catch (parseError) {
            console.error('Error processing card configuration:', parseError);
            setCards(getDefaultCards());
          }
        } else {
          // If there's no specific configuration, use the default
          setCards(getDefaultCards());
        }
      } catch (error) {
        console.error('Unknown error:', error);
        setCards(getDefaultCards());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentCards();
  }, [department]);

  // Card manipulation actions
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard
  } = useCardActions(cards, setCards);
  
  // Special card actions (search and quick demand)
  const {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useSpecialCardActions();
  
  // Fetch data for special cards
  const specialCardsData = useSpecialCardsData();

  return {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    specialCardsData,
    isLoading
  };
};
