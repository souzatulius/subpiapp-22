
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';

export const useDefaultDashboardConfig = (initialDepartment: string = 'default') => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDashboardConfig();
  }, [selectedDepartment, selectedViewType]);

  const fetchDashboardConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching dashboard config:', error);
        setConfig([]);
      } else if (data && data.cards_config) {
        try {
          const parsedCards = JSON.parse(data.cards_config);
          setConfig(parsedCards);
        } catch (parseError) {
          console.error('Error parsing cards config JSON:', parseError);
          setConfig([]);
        }
      } else {
        setConfig([]);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard config:', err);
      setConfig([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (cards: ActionCardItem[], departmentId: string = selectedDepartment) => {
    setIsSaving(true);
    try {
      // First, check if there's an existing config
      const { data: existingConfig, error: checkError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', departmentId)
        .eq('view_type', selectedViewType)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing dashboard config:', checkError);
        return false;
      }

      const cardsJson = JSON.stringify(cards);

      if (existingConfig) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({ cards_config: cardsJson })
          .eq('id', existingConfig.id);

        if (updateError) {
          console.error('Error updating dashboard config:', updateError);
          return false;
        }
      } else {
        // Insert new config
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentId,
            view_type: selectedViewType,
            cards_config: cardsJson
          });

        if (insertError) {
          console.error('Error inserting dashboard config:', insertError);
          return false;
        }
      }

      // If this is the default dashboard, also update the system_default flag
      if (departmentId === 'default') {
        await saveDefaultDashboard(cards);
      }

      return true;
    } catch (err) {
      console.error('Failed to save dashboard config:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveDefaultDashboard = async (cards: ActionCardItem[] = config) => {
    try {
      // Use RPC function instead of direct table access
      const { error } = await supabase
        .rpc('save_default_dashboard', {
          view_type: selectedViewType,
          cards_config: JSON.stringify(cards)
        });

      if (error) {
        console.error('Error saving default dashboard:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Failed to save default dashboard:', err);
      return false;
    }
  };

  const resetAllDashboards = async () => {
    setIsSaving(true);
    try {
      // Use RPC function to reset all dashboards
      const { error } = await supabase
        .rpc('reset_all_dashboards', {
          view_type_param: selectedViewType
        });

      if (error) {
        console.error('Error resetting dashboards:', error);
        return false;
      }

      // Refresh the config after reset
      await fetchDashboardConfig();
      return true;
    } catch (err) {
      console.error('Failed to reset dashboards:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveConfig,
    saveDefaultDashboard,
    resetAllDashboards,
  };
};
