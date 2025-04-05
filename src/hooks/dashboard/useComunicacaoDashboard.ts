
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface DashboardConfig {
  id: string;
  user_id: string;
  cards_config: string;
  created_at: string;
}

export const useComunicacaoDashboard = () => {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [localConfig, setLocalConfig] = useState<DashboardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch dashboard configuration from the database
  const fetchDashboardConfig = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // Use typed response to avoid excessive type instantiation
      const response = await supabase
        .from('dashboard_config')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (response.error) {
        console.error('Error fetching dashboard config:', response.error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a configuração do dashboard.',
          variant: 'destructive'
        });
      } else {
        // Type cast to ensure proper typing
        const data = response.data as DashboardConfig;
        setDashboardConfig(data);
        setLocalConfig(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching dashboard config:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao carregar a configuração do dashboard.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to save dashboard configuration to the database
  const saveConfigToDatabase = useCallback(async (config: { id: string; cards_config: string }) => {
    try {
      const response = await supabase
        .from('dashboard_config')
        .update({ cards_config: config.cards_config })
        .eq('id', config.id);

      if (response.error) {
        console.error('Error saving dashboard config:', response.error);
        toast({
          title: 'Erro',
          description: 'Não foi possível salvar a configuração do dashboard.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Sucesso',
          description: 'Configuração do dashboard salva com sucesso.',
        });
        setDashboardConfig(prev => prev ? { ...prev, cards_config: config.cards_config } : null);
      }
    } catch (error) {
      console.error('Unexpected error saving dashboard config:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao salvar a configuração do dashboard.',
        variant: 'destructive'
      });
    }
  }, []);

  // Function to create a new dashboard configuration in the database
  const createConfigInDatabase = useCallback(async (userId: string) => {
    try {
      const initialConfig = JSON.stringify([
        { "id": "urgencia-cards", "width": 6 },
        { "id": "informativos-recentes", "width": 6 },
        { "id": "enquetes-recentes", "width": 6 },
        { "id": "feedbacks-recentes", "width": 6 }
      ]);

      const response = await supabase
        .from('dashboard_config')
        .insert([{ user_id: userId, cards_config: initialConfig }])
        .select('*')
        .single();

      if (response.error) {
        console.error('Error creating dashboard config:', response.error);
        toast({
          title: 'Erro',
          description: 'Não foi possível criar a configuração do dashboard.',
          variant: 'destructive'
        });
      } else {
        // Type cast to ensure proper typing
        const data = response.data as DashboardConfig;
        setDashboardConfig(data);
        setLocalConfig(data);
      }
    } catch (error) {
      console.error('Unexpected error creating dashboard config:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao criar a configuração do dashboard.',
        variant: 'destructive'
      });
    }
  }, []);

  // Function to reorder cards - fixing the excessive type instantiation issue
  const handleCardsReorder = useCallback((source: number, destination: number) => {
    // Skip if cards haven't been loaded yet
    if (!dashboardConfig || !dashboardConfig.cards_config) return;
    
    try {
      // Parse the current cards configuration
      let currentCards = JSON.parse(dashboardConfig.cards_config);
      
      // Make a copy of the cards array to avoid direct state mutation
      const cardsArrayCopy = [...currentCards];
      
      // Perform the reordering
      const [movedCard] = cardsArrayCopy.splice(source, 1);
      cardsArrayCopy.splice(destination, 0, movedCard);
      
      // Update local state
      setLocalConfig(prev => prev ? {
        ...prev,
        cards_config: JSON.stringify(cardsArrayCopy)
      } : null);
      
      // Update remote state
      if (dashboardConfig.id) {
        saveConfigToDatabase({
          id: dashboardConfig.id,
          cards_config: JSON.stringify(cardsArrayCopy)
        });
      }
    } catch (error) {
      console.error('Error reordering cards:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reordenar os cards.',
        variant: 'destructive'
      });
    }
  }, [dashboardConfig, saveConfigToDatabase]);

  // Function to reset the dashboard configuration to default
  const handleResetDashboard = useCallback(async (userId: string) => {
    if (!dashboardConfig) return;

    try {
      // Define the default card configuration
      const defaultCardsConfig = JSON.stringify([
        { "id": "urgencia-cards", "width": 6 },
        { "id": "informativos-recentes", "width": 6 },
        { "id": "enquetes-recentes", "width": 6 },
        { "id": "feedbacks-recentes", "width": 6 }
      ]);

      // Update the dashboard configuration with the default settings
      await saveConfigToDatabase({ id: dashboardConfig.id, cards_config: defaultCardsConfig });

      // Update local state to reflect the changes
      setLocalConfig(prev => prev ? { ...prev, cards_config: defaultCardsConfig } : null);
      setDashboardConfig(prev => prev ? { ...prev, cards_config: defaultCardsConfig } : null);

      toast({
        title: 'Dashboard redefinido',
        description: 'O dashboard foi redefinido para a configuração padrão.',
      });
    } catch (error) {
      console.error('Error resetting dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível redefinir o dashboard.',
        variant: 'destructive'
      });
    }
  }, [dashboardConfig, saveConfigToDatabase]);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        fetchDashboardConfig(user.id);
      }
    });
  }, [fetchDashboardConfig]);

  return {
    dashboardConfig: localConfig,
    isLoading,
    fetchDashboardConfig,
    saveConfigToDatabase,
    createConfigInDatabase,
    handleCardsReorder,
    handleResetDashboard,
    setLocalConfig
  };
};
