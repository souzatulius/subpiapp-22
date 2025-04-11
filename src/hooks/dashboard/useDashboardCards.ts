
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard'; 
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getDefaultCards } from './defaultCards';

export const useDashboardCards = () => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Fetch cards from DB when component mounts
  useEffect(() => {
    fetchCards();
  }, []);

  // Helper function to ensure required cards exist
  const ensureRequiredCards = (cardsList: ActionCardItem[], defaultCardsList: ActionCardItem[]) => {
    const essentialCardIds = ['press-request-card', 'origem-demandas-card', 'acoes-pendentes-card'];
    const updatedCards = [...cardsList];
    
    // For each essential card, check if it exists in the user's cards
    essentialCardIds.forEach(cardId => {
      const cardExists = cardsList.some(card => card.id === cardId);
      
      // If it doesn't exist, find it in the default cards and add it
      if (!cardExists) {
        const defaultCard = defaultCardsList.find(card => card.id === cardId);
        if (defaultCard) {
          updatedCards.push(defaultCard);
        }
      }
    });
    
    return updatedCards;
  };

  // Main function to fetch cards from the database
  const fetchCards = async () => {
    setIsLoading(true);
    try {
      // Try to get from user's specific dashboard first
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user?.id) {
        const { data: userDashboard, error: userDashboardError } = await supabase
          .from('user_dashboard')
          .select('cards_config')
          .eq('user_id', userData.user.id)
          .single();

        if (!userDashboardError && userDashboard?.cards_config) {
          try {
            const defaultCardsList = getDefaultCards();
            const parsedCards = JSON.parse(userDashboard.cards_config);
            const updatedCards = ensureRequiredCards(parsedCards, defaultCardsList);
            setCards(updatedCards);
            setIsLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing user dashboard config:', parseError);
          }
        }
      }
      
      // If no user-specific cards, try to fetch default department dashboard
      const { data: deptDashboard, error: deptError } = await supabase
        .from('department_dashboard')
        .select('cards_config')
        .eq('department', 'main')
        .single();
        
      if (!deptError && deptDashboard?.cards_config) {
        try {
          const defaultCardsList = getDefaultCards();
          const parsedCards = JSON.parse(deptDashboard.cards_config);
          const updatedCards = ensureRequiredCards(parsedCards, defaultCardsList);
          setCards(updatedCards);
          setIsLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing department dashboard config:', parseError);
        }
      }
      
      // If nothing found or errors occurred, use default cards
      setCards(getDefaultCards());

    } catch (error) {
      console.error('Error fetching dashboard cards:', error);
      // Fallback to default cards
      setCards(getDefaultCards());
    } finally {
      setIsLoading(false);
    }
  };

  // Save cards configuration to the database with debouncing
  const saveCardConfig = useCallback(async (updatedCards: ActionCardItem[]) => {
    setIsSaving(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user?.id) {
        const configString = JSON.stringify(updatedCards);
        
        // Try to upsert into user_dashboard
        const { error } = await supabase.from('user_dashboard')
          .upsert({
            user_id: userData.user.id,
            cards_config: configString,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id'
          });
          
        if (error) throw error;
        
        // Update backup
        await supabase.from('backup_user_dashboard')
          .upsert({
            user_id: userData.user.id,
            cards_config: configString,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving dashboard configuration:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Não foi possível salvar as alterações do dashboard.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Function to handle reordering cards
  const handleCardsReorder = useCallback((newCards: ActionCardItem[]) => {
    setCards(newCards);
    saveCardConfig(newCards);
  }, [saveCardConfig]);

  // Function to handle card hiding
  const handleCardHide = useCallback((cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    saveCardConfig(updatedCards);
  }, [cards, saveCardConfig]);

  // Function to handle card editing
  const handleCardEdit = useCallback((updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    setCards(updatedCards);
    saveCardConfig(updatedCards);
  }, [cards, saveCardConfig]);
  
  // Function to reset dashboard to default
  const resetDashboard = useCallback(() => {
    const defaultCards = getDefaultCards();
    setCards(defaultCards);
    saveCardConfig(defaultCards);
    return defaultCards; // Return for potential chaining
  }, [saveCardConfig]);

  return {
    cards,
    isLoading,
    isSaving,
    lastSaved,
    handleCardsReorder,
    handleCardHide,
    handleCardEdit,
    resetDashboard,
    saveCardConfig
  };
};
