
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ActionCardItem } from '../dashboard/types';
import { useAuth } from '@/hooks/useSupabaseAuth';
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

        if (error) {
          console.error('Erro ao carregar dashboards:', error);
          return;
        }

        const dashboardConfigs: { [key: string]: ActionCardItem[] } = {};
        data.forEach((item) => {
          try {
            const parsed = JSON.parse(item.cards_config);
            dashboardConfigs[item.department] = parsed;
          } catch (e) {
            console.error('Erro ao processar configuração:', e);
          }
        });

        setDefaultDashboards(dashboardConfigs);
      } catch (err) {
        console.error('Erro geral ao buscar dashboards:', err);
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
        description: 'Você precisa estar logado para realizar esta ação.',
        variant: 'destructive',
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

      if (fetchError || !existingConfig) {
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: selectedDepartment,
            view_type: selectedViewType,
            cards_config: serializedCards,
            updated_by: user.id,
          });

        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: serializedCards,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingConfig.id);

        if (updateError) throw updateError;
      }

      // Reset: Apagar customizações antigas dos usuários
      await supabase
        .from('user_dashboard')  // Changed from user_dashboards to user_dashboard
        .delete()
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType);

      toast({
        title: 'Configuração salva',
        description: `O dashboard padrão para ${selectedDepartment === 'default' ? 'todos' : selectedDepartment} foi atualizado e usuários foram resetados.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração. Tente novamente.',
        variant: 'destructive',
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
    saveDefaultDashboard,
  };
};
