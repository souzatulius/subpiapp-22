
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { v4 as uuidv4 } from 'uuid';

type ConfigMap = Record<string, ActionCardItem[]>;

interface UseDefaultDashboardConfigResult {
  config: ActionCardItem[];
  defaultConfig: ActionCardItem[];
  loading: boolean;
  isLoading: boolean; // Added this property
  saveConfig: (cards: ActionCardItem[], deptId?: string) => Promise<boolean>;
  selectedDepartment: string;
  setSelectedDepartment: (v: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (v: 'dashboard' | 'communication') => void;
  isSaving: boolean;
  saveDefaultDashboard: () => Promise<boolean>;
  reloadConfig: () => Promise<void>;
}

export const useDefaultDashboardConfig = (departmentId?: string): UseDefaultDashboardConfigResult => {
  const [config, setConfig] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [defaultConfig, setDefaultConfig] = useState<ActionCardItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId || '');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Function to fetch configuration data
  const fetchConfig = async (depId?: string) => {
    setLoading(true);

    try {
      const deptId = depId || departmentId || user?.coordenacao_id;
      if (!deptId) {
        setLoading(false);
        return;
      }

      console.log(`Fetching dashboard config for department: ${deptId}`);

      const { data, error } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', deptId)
        .eq('view_type', selectedViewType)
        .single();

      let parsed: ActionCardItem[] = [];

      if (!error && data?.cards_config) {
        parsed = JSON.parse(data.cards_config) as ActionCardItem[];
        console.log(`Successfully loaded ${parsed.length} cards for department ${deptId}`);
      } else {
        parsed = generateDefaultCards(deptId);
        console.log(`No config found, using default cards for department ${deptId}`);
      }

      setDefaultConfig(parsed);
      setConfig(prev => ({ ...prev, [deptId]: parsed }));
    } catch (error) {
      console.error('Error fetching dashboard config:', error);
      const fallback = generateDefaultCards(departmentId || user?.coordenacao_id || '');
      setDefaultConfig(fallback);
      setConfig({ [departmentId || user?.coordenacao_id || '']: fallback });
    } finally {
      setLoading(false);
    }
  };

  // Load config on initial mount and when department or view type changes
  useEffect(() => {
    if (user || departmentId) {
      fetchConfig();
    }
  }, [user, departmentId, selectedViewType]);

  // Reload config - can be called after saving
  const reloadConfig = async () => {
    await fetchConfig(selectedDepartment);
  };

  const saveDefaultDashboard = async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      const dept = selectedDepartment || departmentId || user?.coordenacao_id;
      if (!dept) return false;

      const cards = config[dept] || defaultConfig;
      console.log("Saving dashboard:", cards);

      const { data: existing } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', dept)
        .eq('view_type', selectedViewType)
        .single();

      const payload = {
        department: dept,
        view_type: selectedViewType,
        cards_config: JSON.stringify(cards),
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('department_dashboards')
          .update(payload)
          .eq('department', dept)
          .eq('view_type', selectedViewType);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('department_dashboards')
          .insert({
            ...payload,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      // Force reload after save to ensure we have the latest data
      setTimeout(() => reloadConfig(), 100);
      
      return true;
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveConfig = async (cards: ActionCardItem[], deptId?: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      const dept = deptId || selectedDepartment || departmentId || user?.coordenacao_id;
      if (!dept) return false;

      console.log(`Saving ${cards.length} cards for department ${dept}`);

      const { data: existing } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', dept)
        .eq('view_type', selectedViewType)
        .single();

      const payload = {
        department: dept,
        view_type: selectedViewType,
        cards_config: JSON.stringify(cards),
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('department_dashboards')
          .update(payload)
          .eq('department', dept)
          .eq('view_type', selectedViewType);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('department_dashboards')
          .insert({
            ...payload,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
      }

      setConfig(prev => ({ ...prev, [dept]: cards }));
      
      // Force reload after save
      setTimeout(() => reloadConfig(), 100);
      
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const currentDept = selectedDepartment || departmentId || user?.coordenacao_id || '';
  return {
    config: config[currentDept] || defaultConfig,
    defaultConfig,
    loading,
    isLoading: loading, // Add isLoading alias for loading for backward compatibility
    saveConfig,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isSaving,
    saveDefaultDashboard,
    reloadConfig
  };
};

// Default card generation
const generateDefaultCards = (departmentId: string): ActionCardItem[] => {
  return [
    {
      id: uuidv4(),
      title: 'Consultar Demandas',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue',
      width: '25',
      height: '1',
      isCustom: false,
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    }
  ];
};
