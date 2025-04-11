import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { DashboardType } from './useDashboardType';
import { useAutosave } from './useAutosave';
import { toast } from '@/components/ui/use-toast';

export const useAutosaveDashboard = (
  userId: string | undefined,
  departmentId: string = 'main',
  defaultCards: ActionCardItem[],
  dashboardType: DashboardType = 'main'
) => {
  const [cards, setCards] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine which tables to use based on dashboard type
  const userTableName = dashboardType === 'main' 
    ? 'user_dashboard' 
    : 'user_dashboard_comunicacao';
  
  const departmentTableName = dashboardType === 'main'
    ? 'department_dashboard'
    : 'department_dashboard_comunicacao';

  // Function to save cards configuration - with check-before-save logic
  const saveCardConfiguration = async (triggerType: 'navigation' | 'timeout' | 'visibility' | 'manual'): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      console.log(`[${dashboardType}] Saving dashboard config - trigger: ${triggerType}`);
      
      // First check if a record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from(userTableName)
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected if no record exists yet
        console.error('Error checking for existing record:', checkError);
      }
      
      let result;
      
      if (existingRecord) {
        // Record exists, use UPDATE
        result = await supabase
          .from(userTableName)
          .update({
            cards_config: JSON.stringify(cards),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // No record exists, use INSERT
        result = await supabase
          .from(userTableName)
          .insert({
            user_id: userId,
            cards_config: JSON.stringify(cards),
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
      }
      
      if (result.error) throw result.error;
      
      // Only show success toast for manual saves
      if (triggerType === 'manual') {
        toast({
          title: "Configurações salvas",
          description: "As personalizações do dashboard foram salvas com sucesso.",
          variant: "default"
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving ${dashboardType} dashboard config:`, error);
      
      // Only show error toast for manual saves
      if (triggerType === 'manual') {
        toast({
          title: "Erro ao salvar configurações",
          description: "Não foi possível salvar as personalizações do dashboard.",
          variant: "destructive"
        });
      }
      
      return false;
    }
  };

  // Use the autosave hook
  const { 
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setUnsaved,
    saveNow
  } = useAutosave({
    onSave: saveCardConfiguration,
    debounceMs: 3000,
    saveOnUnmount: true,
    saveOnVisibilityChange: true,
    enabled: !!userId
  });

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
          .maybeSingle(); // Using maybeSingle instead of single to avoid errors

        if (!userError && userData && userData.cards_config) {
          try {
            setCards(JSON.parse(userData.cards_config));
            console.log(`Loaded user ${dashboardType} dashboard config`);
            return;
          } catch (parseError) {
            console.error(`Error parsing user ${dashboardType} dashboard config:`, parseError);
          }
        }

        // Step 2: Try to get department config
        const { data: deptData, error: deptError } = await supabase
          .from(departmentTableName)
          .select('cards_config, updated_at')
          .eq('department', departmentId)
          .maybeSingle(); // Using maybeSingle instead of single

        if (!deptError && deptData && deptData.cards_config) {
          try {
            setCards(JSON.parse(deptData.cards_config));
            console.log(`Loaded department ${dashboardType} dashboard config`);
            return;
          } catch (parseError) {
            console.error(`Error parsing department ${dashboardType} dashboard config:`, parseError);
          }
        }

        // Step 3: Try to get default config
        const { data: defaultData, error: defaultError } = await supabase
          .from(departmentTableName)
          .select('cards_config')
          .eq('department', dashboardType === 'main' ? 'main' : 'comunicacao')
          .maybeSingle(); // Using maybeSingle instead of single

        if (!defaultError && defaultData && defaultData.cards_config) {
          try {
            setCards(JSON.parse(defaultData.cards_config));
            console.log(`Loaded default ${dashboardType} dashboard config`);
            return;
          } catch (parseError) {
            console.error(`Error parsing default ${dashboardType} dashboard config:`, parseError);
          }
        }

        // Step 4: Fall back to hardcoded defaults
        console.log(`Using default hardcoded ${dashboardType} dashboard config`);
        setCards(defaultCards);
        
      } catch (error) {
        console.error(`Error loading ${dashboardType} dashboard config:`, error);
        setCards(defaultCards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [userId, departmentId, userTableName, departmentTableName, defaultCards, dashboardType]);

  const handleCardsReorder = useCallback((updatedCards: ActionCardItem[]) => {
    setCards(updatedCards);
    setUnsaved(); // Mark as having unsaved changes
  }, [setUnsaved]);

  const handleSaveCardEdit = useCallback((updatedCard: ActionCardItem) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? { ...card, ...updatedCard } : card
    );
    
    setCards(updatedCards);
    setUnsaved(); // Mark as having unsaved changes
  }, [cards, setUnsaved]);

  const handleCardHide = useCallback((cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isHidden: true } : card
    );
    
    setCards(updatedCards);
    setUnsaved(); // Mark as having unsaved changes
  }, [cards, setUnsaved]);

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
              setUnsaved(); // Mark as having unsaved changes
              return;
            } catch (parseError) {
              console.error(`Error parsing department config during reset (${dashboardType}):`, parseError);
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
                  setUnsaved(); // Mark as having unsaved changes
                } catch (parseError) {
                  console.error(`Error parsing default config during reset (${dashboardType}):`, parseError);
                  setCards(defaultCards);
                  setUnsaved(); // Mark as having unsaved changes
                }
              } else {
                setCards(defaultCards);
                setUnsaved(); // Mark as having unsaved changes
              }
            });
        });
    } else {
      setCards(defaultCards);
    }
    
    return defaultCards;
  }, [userId, departmentId, departmentTableName, defaultCards, dashboardType, setUnsaved]);

  return {
    cards,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    handleCardsReorder,
    handleSaveCardEdit,
    handleCardHide,
    resetDashboard,
    saveNow
  };
};
