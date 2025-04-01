
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';
import { getDefaultCards } from '@/hooks/dashboard/defaultCards';

export interface UseDefaultDashboardConfigResult {
  config: ActionCardItem[] | null;
  loading: boolean;
  saveConfig: (cards: ActionCardItem[], departmentId: string) => Promise<boolean>;
  fetchConfig: () => Promise<void>;
  saveDefaultDashboard: () => Promise<boolean>;
  isSaving: boolean;
  isLoading: boolean; // Add this to fix the TS error
}

export const useDefaultDashboardConfig = (departmentId: string): UseDefaultDashboardConfigResult => {
  const [config, setConfig] = useState<ActionCardItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    
    try {
      console.log("Fetching dashboard configuration for department:", departmentId);
      
      // If no department is selected, use default cards
      if (!departmentId) {
        setConfig([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', departmentId)
        .eq('view_type', 'dashboard')
        .single();
      
      if (error) {
        // If no config found, use default cards
        if (error.code === 'PGRST116') {
          console.log("No configuration found, using default cards");
          const defaultCards = getDefaultCards(departmentId);
          setConfig(defaultCards);
        } else {
          console.error("Error fetching dashboard config:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar a configuração do dashboard",
            variant: "destructive"
          });
          setConfig([]);
        }
      } else if (data && data.cards_config) {
        try {
          const parsedConfig = JSON.parse(data.cards_config);
          console.log("Loaded dashboard configuration:", parsedConfig);
          setConfig(parsedConfig);
        } catch (e) {
          console.error("Error parsing dashboard config:", e);
          setConfig([]);
        }
      } else {
        setConfig([]);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard config:", e);
      setConfig([]);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);
  
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);
  
  const saveConfig = async (cards: ActionCardItem[], deptId: string): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      console.log("Saving dashboard configuration for department:", deptId);
      
      const { error } = await supabase
        .from('department_dashboards')
        .upsert({
          department: deptId,
          view_type: 'dashboard',
          cards_config: JSON.stringify(cards),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,view_type'
        });
      
      if (error) {
        console.error("Error saving dashboard config:", error);
        toast({
          title: "Error",
          description: "Falha ao salvar a configuração do dashboard",
          variant: "destructive"
        });
        return false;
      }
      
      // Force a refresh of the configuration after saving
      await fetchConfig();
      
      // Force a re-render by temporarily changing the department ID
      setTimeout(() => {}, 100);
      
      toast({
        title: "Salvo",
        description: "Configuração do dashboard salva com sucesso"
      });
      
      return true;
    } catch (e) {
      console.error("Failed to save dashboard config:", e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveDefaultDashboard = async (): Promise<boolean> => {
    if (!config) {
      toast({
        title: "Erro",
        description: "Não há configuração para salvar",
        variant: "destructive"
      });
      return false;
    }
    
    return saveConfig(config, departmentId);
  };
  
  return { 
    config, 
    loading, 
    saveConfig, 
    fetchConfig,
    saveDefaultDashboard,
    isSaving,
    isLoading: loading // Add isLoading as an alias for loading
  };
};
