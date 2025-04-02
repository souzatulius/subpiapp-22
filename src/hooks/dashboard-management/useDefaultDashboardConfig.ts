
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export const useDefaultDashboardConfig = (initialDepartment: string = 'default') => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching config for department: ${selectedDepartment}, view type: ${selectedViewType}`);
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
          console.log('Loaded config:', parsedCards);
          setConfig(parsedCards);
        } catch (parseError) {
          console.error('Error parsing cards config JSON:', parseError);
          setConfig([]);
        }
      } else {
        console.log('No config found, using empty array');
        setConfig([]);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard config:', err);
      setConfig([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepartment, selectedViewType]);

  useEffect(() => {
    fetchDashboardConfig();
  }, [fetchDashboardConfig]);

  const saveConfig = async (cards: ActionCardItem[], departmentId: string = selectedDepartment) => {
    setIsSaving(true);
    console.log(`Saving config for department: ${departmentId}, view type: ${selectedViewType}`, cards);
    
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
          toast({
            title: "Erro ao salvar dashboard",
            description: "Não foi possível salvar a configuração do dashboard",
            variant: "destructive"
          });
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
          toast({
            title: "Erro ao criar dashboard",
            description: "Não foi possível criar a configuração do dashboard",
            variant: "destructive"
          });
          return false;
        }
      }

      // If this is the default dashboard, also update the system_default flag
      if (departmentId === 'default') {
        await saveDefaultDashboard(cards);
      }

      toast({
        title: "Dashboard salvo",
        description: "As configurações do dashboard foram salvas com sucesso",
        variant: "success"
      });
      
      return true;
    } catch (err) {
      console.error('Failed to save dashboard config:', err);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar as configurações do dashboard",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveDefaultDashboard = async (cards: ActionCardItem[] = config) => {
    try {
      // Usando uma chamada direta para a tabela ao invés da função RPC
      const { error } = await supabase
        .from('department_dashboards')
        .update({ cards_config: JSON.stringify(cards) })
        .eq('department', 'default')
        .eq('view_type', selectedViewType);

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
      // Buscar a configuração padrão
      const { data: defaultConfig, error: fetchError } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', 'default')
        .eq('view_type', selectedViewType)
        .single();

      if (fetchError) {
        console.error('Error fetching default configuration:', fetchError);
        return false;
      }

      // Atualizar todos os dashboards com a configuração padrão
      const { error: updateError } = await supabase
        .from('department_dashboards')
        .update({ cards_config: defaultConfig.cards_config })
        .neq('department', 'default')
        .eq('view_type', selectedViewType);

      if (updateError) {
        console.error('Error resetting dashboards:', updateError);
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
    setConfig,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveConfig,
    saveDefaultDashboard,
    resetAllDashboards,
    fetchDashboardConfig
  };
};
