
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ActionCardItem } from '@/types/dashboard';
import { useDefaultDashboardState } from './useDefaultDashboardState';

export const useDefaultDashboardConfig = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('default');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [defaultDashboards, setDefaultDashboards] = useState<{ [key: string]: ActionCardItem[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { user } = useAuth();
  const { cards } = useDefaultDashboardState(selectedDepartment);

  useEffect(() => {
    const fetchDashboardConfigs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*');

        if (error) throw error;

        const configs: { [key: string]: ActionCardItem[] } = {};
        for (const item of data) {
          try {
            configs[`${item.department}_${item.view_type}`] = JSON.parse(item.cards_config);
          } catch (e) {
            console.error('Erro ao parsear JSON de cards_config:', e);
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
      const serializedCards = JSON.stringify(cards);
      const { data: existingConfig, error: fetchError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
        throw fetchError;
      }

      if (!existingConfig) {
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: selectedDepartment,
            view_type: selectedViewType,
            cards_config: serializedCards,
            updated_by: user.id
          });

        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: serializedCards,
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
        description: 'Configuração atualizada e usuários resetados.',
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
