
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

  // Load all dashboard configurations
  useEffect(() => {
    const fetchDashboardConfigs = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*');

        if (error) {
          console.error('Error fetching dashboard configurations:', error);
          return;
        }

        const dashboardConfigs: {[key: string]: ActionCardItem[]} = {};
        
        data.forEach(item => {
          try {
            const cards = JSON.parse(item.cards_config);
            dashboardConfigs[item.department] = cards;
          } catch (e) {
            console.error(`Error processing configuration for ${item.department}:`, e);
          }
        });

        setDefaultDashboards(dashboardConfigs);
      } catch (error) {
        console.error('Error fetching dashboard configurations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardConfigs();
  }, []);

  // Function to save the current configuration as default
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
      // Check if the configuration already exists
      const { data: existingConfig, error: fetchError } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', selectedDepartment)
        .single();

      // Get the current cards from the current view
      const currentCards = document.querySelectorAll('[data-card-id]');
      const cards = Array.from(currentCards).map((card) => {
        const cardId = card.getAttribute('data-card-id');
        // Here you would have to implement the logic to retrieve all the details of the card
        // This is a simplification
        return { id: cardId };
      });

      if (fetchError || !existingConfig) {
        // Create new configuration if it doesn't exist
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
        // Update existing configuration
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
      console.error('Error saving configuration:', error);
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
