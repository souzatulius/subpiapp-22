
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { getDefaultCards, getCommunicationActionCards } from './defaultCards';

export const useDefaultDashboardCards = (dashboardType: 'main' | 'communication' = 'main') => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const tableName = dashboardType === 'main' 
          ? 'department_dashboard' 
          : 'department_dashboard_comunicacao';
          
        const department = dashboardType === 'main' ? 'main' : 'comunicacao';

        const { data, error } = await supabase
          .from(tableName)
          .select('cards_config')
          .eq('department', department)
          .single();

        if (error) {
          console.error(`Error fetching ${dashboardType} dashboard default cards:`, error);
          // Use hardcoded defaults if DB query fails
          setCards(dashboardType === 'main' ? getDefaultCards() : getCommunicationActionCards());
        } else if (data && data.cards_config) {
          try {
            const parsedCards = JSON.parse(data.cards_config);
            setCards(parsedCards);
          } catch (parseError) {
            console.error('Error parsing cards JSON:', parseError);
            // Use hardcoded defaults if JSON parsing fails
            setCards(dashboardType === 'main' ? getDefaultCards() : getCommunicationActionCards());
          }
        } else {
          // Use hardcoded defaults if no data
          setCards(dashboardType === 'main' ? getDefaultCards() : getCommunicationActionCards());
        }
      } catch (error) {
        console.error('Error in useDefaultDashboardCards:', error);
        // Use hardcoded defaults on any error
        setCards(dashboardType === 'main' ? getDefaultCards() : getCommunicationActionCards());
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [dashboardType]);

  return { cards, isLoading };
};

export default useDefaultDashboardCards;
