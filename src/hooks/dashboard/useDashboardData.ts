
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserDashboard, ActionCardItem, SerializableCard } from './types';
import { getDefaultCards, getIconComponentFromId, getIconIdFromComponent } from './defaultCards';

export const useDashboardData = (userId?: string) => {
  const [firstName, setFirstName] = useState('');
  const [actionCards, setActionCards] = useState<ActionCardItem[]>(getDefaultCards());

  // Load user name and saved cards
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          // Fetch user name
          const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .eq('id', userId)
            .single();
            
          if (userError) throw userError;

          // Get the first name only
          const fullName = userData?.nome_completo || '';
          const firstNameOnly = fullName.split(' ')[0];
          setFirstName(firstNameOnly);

          // Fetch saved dashboard configuration
          const { data: dashboardData, error: dashboardError } = await supabase
            .from('user_dashboard')
            .select('cards_config')
            .eq('user_id', userId)
            .maybeSingle();

          if (dashboardError) {
            // Only log if it's not just a "no rows returned" error
            if (dashboardError.code !== 'PGRST116') {
              console.error('Error fetching dashboard data:', dashboardError);
            }
          }

          // If user has saved configuration, use it; otherwise use default
          if (dashboardData?.cards_config) {
            try {
              const savedCards = JSON.parse(dashboardData.cards_config);
              
              // Transform string icon references back into React components
              const processedCards = savedCards.map((card: SerializableCard) => {
                // Process icon based on string reference
                const iconComponent = getIconComponentFromId(card.iconId);
                
                return {
                  ...card,
                  icon: iconComponent
                };
              });
              
              setActionCards(processedCards);
            } catch (error) {
              console.error('Error parsing saved dashboard config:', error);
              setActionCards(getDefaultCards());
            }
          }
        } catch (error) {
          console.error('Error in fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [userId]);

  // Save cards configuration whenever it changes
  useEffect(() => {
    if (userId && actionCards.length > 0) {
      const saveConfiguration = async () => {
        try {
          // Transform React components to string references for storage
          const serializableCards = actionCards.map(card => {
            // Determine icon type from component
            const iconId = getIconIdFromComponent(card.icon);
            
            // Return a serializable version of the card
            return {
              ...card,
              icon: undefined, // Remove React component
              iconId: iconId // Store string reference instead
            };
          });
          
          // Convert to JSON string to store in the database
          const cardsConfigString = JSON.stringify(serializableCards);
          
          // Upsert the configuration
          const { error } = await supabase
            .from('user_dashboard')
            .upsert({ 
              user_id: userId, 
              cards_config: cardsConfigString 
            }, 
            { 
              onConflict: 'user_id'
            });
            
          if (error) throw error;
          
        } catch (error) {
          console.error('Error saving dashboard configuration:', error);
        }
      };
      
      // Debounce to avoid too many save operations
      const timeoutId = setTimeout(saveConfiguration, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [actionCards, userId]);

  return {
    firstName,
    actionCards,
    setActionCards
  };
};
