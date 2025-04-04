
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export interface DashboardConfigResult {
  config: ActionCardItem[];
  isLoading: boolean;
  isSaving: boolean;
  saveConfig: (cards: ActionCardItem[], departmentId?: string) => Promise<boolean>;
}

export const useDashboardConfig = (
  department: string = 'default',
  viewType: 'dashboard' | 'communication' = 'dashboard'
): DashboardConfigResult => {
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDashboardConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching config for department: ${department}, view type: ${viewType}`);
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', department)
        .eq('view_type', viewType)
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
  }, [department, viewType]);

  useEffect(() => {
    fetchDashboardConfig();
  }, [fetchDashboardConfig]);

  const saveConfig = async (cards: ActionCardItem[], departmentId: string = department) => {
    setIsSaving(true);
    console.log(`Saving config for department: ${departmentId}, view type: ${viewType}`, cards);
    
    try {
      // First, check if there's an existing config
      const { data: existingConfig, error: checkError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', departmentId)
        .eq('view_type', viewType)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing dashboard config:', checkError);
        setIsSaving(false);
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
          setIsSaving(false);
          return false;
        }
      } else {
        // Insert new config
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentId,
            view_type: viewType,
            cards_config: cardsJson
          });

        if (insertError) {
          console.error('Error inserting dashboard config:', insertError);
          toast({
            title: "Erro ao criar dashboard",
            description: "Não foi possível criar a configuração do dashboard",
            variant: "destructive"
          });
          setIsSaving(false);
          return false;
        }
      }

      toast({
        title: "Dashboard salvo",
        description: "As configurações do dashboard foram salvas com sucesso"
      });
      
      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('Failed to save dashboard config:', err);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o dashboard",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  };

  return {
    config,
    isLoading,
    isSaving,
    saveConfig
  };
};
