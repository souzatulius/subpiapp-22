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
  saveConfig: (cards: ActionCardItem[], deptId?: string) => Promise<boolean>;
  selectedDepartment: string;
  setSelectedDepartment: (v: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (v: 'dashboard' | 'communication') => void;
  isSaving: boolean;
  saveDefaultDashboard: () => Promise<boolean>;
}

export const useDefaultDashboardConfig = (departmentId?: string): UseDefaultDashboardConfigResult => {
  const [config, setConfig] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [defaultConfig, setDefaultConfig] = useState<ActionCardItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId || '');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);

      try {
        const depId = departmentId || user?.coordenacao_id;
        if (!depId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('department_dashboards')
          .select('*')
          .eq('department', depId)
          .single();

        let parsed: ActionCardItem[] = [];

        if (!error && data?.cards_config) {
          parsed = JSON.parse(data.cards_config) as ActionCardItem[];
        } else {
          parsed = generateDefaultCards(depId);
        }

        setDefaultConfig(parsed);
        setConfig({ [depId]: parsed });
      } catch (error) {
        console.error('Error fetching dashboard config:', error);
        const fallback = generateDefaultCards(departmentId || user?.coordenacao_id || '');
        setDefaultConfig(fallback);
        setConfig({ [departmentId || user?.coordenacao_id || '']: fallback });
      } finally {
        setLoading(false);
      }
    };

    if (user || departmentId) {
      fetchConfig();
    }
  }, [user, departmentId]);

  const saveDefaultDashboard = async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      const dept = selectedDepartment || departmentId || user?.coordenacao_id;
      if (!dept) return false;

      const cards = config[dept] || defaultConfig;

      const { data: existing } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', dept)
        .single();

      const payload = {
        department: dept,
        cards_config: JSON.stringify(cards),
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('department_dashboards')
          .update(payload)
          .eq('department', dept);
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
      const dept = deptId || selectedDepartment || departmentId || user?.coordenacao_id;
      if (!dept) return false;

      const { data: existing } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', dept)
        .single();

      const payload = {
        department: dept,
        cards_config: JSON.stringify(cards),
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('department_dashboards')
          .update(payload)
          .eq('department', dept);
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
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  const currentDept = selectedDepartment || departmentId || user?.coordenacao_id || '';
  return {
    config: config[currentDept] || defaultConfig,
    defaultConfig,
    loading,
    saveConfig,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isSaving,
    saveDefaultDashboard
  };
};

// Geração padrão (você pode expandir isso conforme necessidade)
const generateDefaultCards = (departmentId: string): ActionCardItem[] => {
  return [
    {
      id: uuidv4(),
      title: 'Consultar Demandas',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue',
      width: '1',
      height: '1',
      isCustom: false,
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    }
  ];
};
