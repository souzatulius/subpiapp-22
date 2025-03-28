
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ActionCardItem } from '../dashboard/types';
import { useAuth } from '@/hooks/useSupabaseAuth';

export const useDefaultDashboardConfig = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('default');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [defaultDashboards, setDefaultDashboards] = useState<{[key: string]: ActionCardItem[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { user } = useAuth();

  // Carregar todas as configurações de dashboard
  useEffect(() => {
    const fetchDashboardConfigs = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*');

        if (error) {
          console.error('Erro ao buscar configurações de dashboard:', error);
          return;
        }

        const dashboardConfigs: {[key: string]: ActionCardItem[]} = {};
        
        data.forEach(item => {
          try {
            const cards = JSON.parse(item.cards_config);
            dashboardConfigs[item.department] = cards;
          } catch (e) {
            console.error(`Erro ao processar configuração para ${item.department}:`, e);
          }
        });

        setDefaultDashboards(dashboardConfigs);
      } catch (error) {
        console.error('Erro ao buscar configurações de dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardConfigs();
  }, []);

  // Função para salvar a configuração atual como padrão
  const saveDefaultDashboard = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para realizar esta ação.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Obter a configuração atual
      const { data: existingConfig, error: fetchError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', selectedDepartment)
        .single();

      // Obter os cards da visualização atual
      const currentCards = document.querySelectorAll('[data-card-id]');
      const cards = Array.from(currentCards).map((card) => {
        const cardId = card.getAttribute('data-card-id');
        // Aqui você teria que implementar a lógica para recuperar todos os detalhes do card
        // Esta é uma simplificação
        return { id: cardId };
      });

      if (fetchError || !existingConfig) {
        // Criar nova configuração se não existir
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: selectedDepartment,
            cards_config: JSON.stringify(cards),
            view_type: selectedViewType,
            updated_by: user.id
          });

        if (insertError) throw insertError;
      } else {
        // Atualizar configuração existente
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: JSON.stringify(cards),
            view_type: selectedViewType,
            updated_by: user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);

        if (updateError) throw updateError;
      }

      toast({
        title: 'Configuração salva',
        description: `O dashboard padrão para ${selectedDepartment === 'default' ? 'todos' : selectedDepartment} foi atualizado.`,
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração. Tente novamente.',
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
