
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDefaultDashboardState } from './useDefaultDashboardState';
import { ActionCardItem } from '@/types/dashboard';

export const useDefaultDashboardConfig = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('default');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [defaultDashboards, setDefaultDashboards] = useState<Record<string, ActionCardItem[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { user } = useAuth();

  // Break the deep type inference chain by explicitly typing the result
  const dashboardState = useDefaultDashboardState(selectedDepartment);
  // Extract cards with explicit typing to avoid excessive type inference
  const cards: ActionCardItem[] = dashboardState.cards;

  useEffect(() => {
    const fetchDashboardConfigs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*');

        if (error) throw error;

        const configs: Record<string, ActionCardItem[]> = {};
        for (const item of data) {
          try {
            configs[`${item.department}_${item.view_type}`] = JSON.parse(item.cards_config);
          } catch (e) {
            console.error('Erro ao parsear cards_config:', e);
          }
        }

        setDefaultDashboards(configs);
      } catch (err) {
        console.error('Erro ao buscar dashboards:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardConfigs();
  }, []);

  const saveDefaultDashboard = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Explicitly cast cards to ActionCardItem[] to prevent deep type inference
      const cardsString = JSON.stringify(cards as ActionCardItem[]);

      const { data: existingConfig, error: fetchError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingConfig) {
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: selectedDepartment,
            view_type: selectedViewType,
            cards_config: cardsString,
            updated_by: user.id
          });

        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: cardsString,
            updated_by: user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);

        if (updateError) throw updateError;
      }

      await supabase
        .from('user_dashboard')
        .delete()
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType);

      toast({
        title: 'Salvo com sucesso',
        description: 'Dashboard atualizado e usuários resetados.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar dashboard:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique a conexão e tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    defaultDashboards,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveDefaultDashboard
  };
};
