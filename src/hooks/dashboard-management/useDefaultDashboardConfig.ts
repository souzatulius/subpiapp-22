
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDefaultDashboardState } from './useDefaultDashboardState';
import { ActionCardItem, CardColor } from '@/types/dashboard';

// Simplified type to avoid infinite type instantiation
interface SimpleCardData {
  id: string;
  title: string;
  path: string;
  color: CardColor;
  iconId: string;
  type: string;
  width?: string;
  height?: string;
  displayMobile?: boolean;
  dataSourceKey?: string;
  allowedDepartments?: string[];
  allowedRoles?: string[];
}

// Helper function to clean card objects before stringifying
const cleanCardForStorage = (card: ActionCardItem): SimpleCardData => {
  // Create a clean object with only the properties we need to store
  return {
    id: card.id,
    title: card.title,
    path: card.path || '',
    color: card.color,
    width: card.width || '25',
    height: card.height || '1',
    iconId: card.iconId,
    type: card.type || 'standard',
    displayMobile: card.displayMobile ?? true,
    dataSourceKey: card.dataSourceKey || '',
    allowedDepartments: card.allowedDepartments || [],
    allowedRoles: card.allowedRoles || []
  };
};

export const useDefaultDashboardConfig = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [defaultDashboards, setDefaultDashboards] = useState<Record<string, SimpleCardData[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { user } = useAuth();

  // Get dashboard state
  const dashboardState = useDefaultDashboardState(selectedDepartment);
  const cards = dashboardState.cards;

  useEffect(() => {
    const fetchDashboardConfigs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*');

        if (error) throw error;

        const configs: Record<string, SimpleCardData[]> = {};
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

    // Fetch initial coordinations and set first one as default
    const fetchInitialCoordination = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id')
          .limit(1)
          .order('descricao');

        if (error) throw error;

        if (data && data.length > 0) {
          setSelectedDepartment(data[0].id);
        }
      } catch (err) {
        console.error('Erro ao buscar coordenação inicial:', err);
      }
    };

    fetchDashboardConfigs();
    if (!selectedDepartment) {
      fetchInitialCoordination();
    }
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

    if (!selectedDepartment) {
      toast({
        title: 'Erro',
        description: 'Selecione um departamento.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Clean cards before stringify to prevent circular references
      const cleanedCards = cards.map(cleanCardForStorage);
      const cardsString = JSON.stringify(cleanedCards);

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
