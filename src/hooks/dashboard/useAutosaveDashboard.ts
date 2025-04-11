
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { DashboardType } from './useDashboardType';
import { toast } from '@/components/ui/use-toast';

export const useAutosaveDashboard = (
  userId: string | undefined,
  departmentId: string = 'main',
  defaultCards: ActionCardItem[],
  dashboardType: DashboardType = 'main'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine which tables to use based on dashboard type
  const userTableName = dashboardType === 'main' 
    ? 'user_dashboard' 
    : 'user_dashboard_comunicacao';
  
  const departmentTableName = dashboardType === 'main'
    ? 'department_dashboard'
    : 'department_dashboard_comunicacao';

  // Load cards - first from user config, then from department config, then defaults
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      
      try {
        if (!userId) {
          setCards(defaultCards);
          return;
        }

        // Step 1: Try to get user's personal config
        const { data: userData, error: userError } = await supabase
          .from(userTableName)
          .select('cards_config, updated_at')
          .eq('user_id', userId)
          .single();

        if (!userError && userData) {
          try {
            setCards(JSON.parse(userData.cards_config));
            setLastSaved(new Date(userData.updated_at));
            console.log('Loaded user dashboard config');
            return;
          } catch (parseError) {
            console.error('Error parsing user dashboard config:', parseError);
          }
        }

        // Step 2: Try to get department config
        const { data: deptData, error: deptError } = await supabase
          .from(departmentTableName)
          .select('cards_config, updated_at')
          .eq('department', departmentId)
          .single();

        if (!deptError && deptData) {
          try {
            setCards(JSON.parse(deptData.cards_config));
            setLastSaved(new Date(deptData.updated_at));
            console.log('Loaded department dashboard config');
            return;
          } catch (parseError) {
            console.error('Error parsing department dashboard config:', parseError);
          }
        }

        // Step 3: Try to get default config
        const { data: defaultData, error: defaultError } = await supabase
          .from(departmentTableName)
          .select('cards_config')
          .eq('department', dashboardType === 'main' ? 'main' : 'comunicacao')
          .single();

        if (!defaultError && defaultData) {
          try {
            setCards(JSON.parse(defaultData.cards_config));
            console.log('Loaded default dashboard config');
            return;
          } catch (parseError) {
            console.error('Error parsing default dashboard config:', parseError);
          }
        }

        // Step 4: Fall back to hardcoded defaults
        console.log('Using default hardcoded dashboard config');
        setCards(defaultCards);
        
      } catch (error) {
        console.error('Error loading dashboard config:', error);
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [userId, departmentId, userTableName, departmentTableName, defaultCards, dashboardType]);

  const saveUserCards = useCallback(async (updatedCards: ActionCardItem[]) => {
    if (!userId) return false;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from(userTableName)
        .upsert({
          user_id: userId,
          cards_config: JSON.stringify(updatedCards),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      toast({
        title: "Erro ao salvar o dashboard",
        description: "Não foi possível salvar suas alterações. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId, userTableName]);

  const handleCardsReorder = useCallback((updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    saveUserCards(updatedCards);
  }, [saveUserCards]);

  const handleSaveCardEdit = useCallback((updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    saveUserCards(updatedCards);
  }, [cards, saveUserCards]);

  const handleCardHide = useCallback((cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    saveUserCards(updatedCards);
  }, [cards, saveUserCards]);

  const resetDashboard = useCallback(() => {
    if (userId) {
      // First try to get department config
      supabase
        .from(departmentTableName)
        .select('cards_config')
        .eq('department', departmentId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            try {
              const parsedConfig = JSON.parse(data.cards_config);
              setCards(parsedConfig);
              saveUserCards(parsedConfig);
              return;
            } catch (parseError) {
              console.error('Error parsing department config during reset:', parseError);
            }
          }
          
          // If no department config or error, try default config
          supabase
            .from(departmentTableName)
            .select('cards_config')
            .eq('department', dashboardType === 'main' ? 'main' : 'comunicacao')
            .single()
            .then(({ data: defaultData, error: defaultError }) => {
              if (!defaultError && defaultData) {
                try {
                  const parsedConfig = JSON.parse(defaultData.cards_config);
                  setCards(parsedConfig);
                  saveUserCards(parsedConfig);
                } catch (parseError) {
                  console.error('Error parsing default config during reset:', parseError);
                  setCards(defaultCards);
                  saveUserCards(defaultCards);
                }
              } else {
                setCards(defaultCards);
                saveUserCards(defaultCards);
              }
            });
        });
    } else {
      setCards(defaultCards);
    }
    
    return defaultCards;
  }, [userId, departmentId, departmentTableName, defaultCards, dashboardType, saveUserCards]);

  return {
    cards,
    isLoading,
    isSaving,
    lastSaved,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard
  };
};
