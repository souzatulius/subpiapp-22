
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CardColor, CardWidth, CardHeight, CardType, ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface SaveConfigProps {
  (cards: ActionCardItem[], deptId?: string): Promise<boolean>;
}

export const useDefaultDashboardConfig = (departmentId?: string) => {
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultConfig, setDefaultConfig] = useState<ActionCardItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentId || '');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Fetch department dashboard config
  useEffect(() => {
    const fetchDashboardConfig = async () => {
      setLoading(true);
      
      try {
        const deptId = departmentId || selectedDepartment;
        const viewType = selectedViewType;
        
        if (!deptId) {
          setConfig([]);
          setLoading(false);
          return;
        }
        
        // Fetch from department_dashboards table
        const { data: deptData, error: deptError } = await supabase
          .from('department_dashboards')
          .select('cards_config')
          .eq('department', deptId)
          .eq('view_type', viewType)
          .maybeSingle();
          
        if (deptError && deptError.code !== 'PGRST116') {
          console.error('Error fetching department dashboard:', deptError);
        }
        
        if (deptData && deptData.cards_config) {
          try {
            const parsedConfig = JSON.parse(deptData.cards_config);
            setConfig(parsedConfig);
            setLoading(false);
            return;
          } catch (e) {
            console.error('Error parsing department dashboard config:', e);
          }
        }
        
        // If we get here, either there was no department config or it failed to parse
        // We'll load the default cards for this department and view type
        const defaultCards = getDefaultCards(deptId, viewType);
        setConfig(defaultCards);
        
      } catch (err) {
        console.error('Failed to fetch dashboard config:', err);
        setConfig([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardConfig();
  }, [departmentId, selectedDepartment, selectedViewType]);
  
  // Get default cards based on department
  const getDefaultCards = (deptId: string, viewType: 'dashboard' | 'communication'): ActionCardItem[] => {
    // For the communication dashboard
    if (viewType === 'communication') {
      return [
        {
          id: 'cadastrar-demanda',
          title: 'Cadastrar Demanda',
          subtitle: 'Registre novas solicitações da imprensa',
          iconId: 'PlusCircle',
          path: `/dashboard/comunicacao/cadastrar`,
          color: 'blue',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 1
        },
        {
          id: 'responder-demanda',
          title: 'Responder Demanda',
          subtitle: 'Responda às demandas pendentes',
          iconId: 'MessageSquare',
          path: `/dashboard/comunicacao/responder`,
          color: 'green',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 2
        },
        {
          id: 'criar-nota',
          title: 'Criar Nota Oficial',
          subtitle: 'Elabore notas oficiais',
          iconId: 'FileText',
          path: `/dashboard/comunicacao/criar-nota`,
          color: 'orange',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 3
        },
        {
          id: 'aprovar-nota',
          title: 'Aprovar Notas',
          subtitle: 'Revise e aprove notas oficiais',
          iconId: 'CheckCircle',
          path: `/dashboard/comunicacao/aprovar-nota`,
          color: 'purple-light',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 4
        }
      ];
    }
    
    // For the main dashboard
    return [
      {
        id: 'card-demandas',
        title: 'Demandas',
        iconId: 'ClipboardList',
        path: '/dashboard/demandas',
        color: 'blue',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'card-comunicacao',
        title: 'Comunicação',
        iconId: 'MessageSquare',
        path: '/dashboard/comunicacao',
        color: 'green',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'card-contratos',
        title: 'Contratos',
        iconId: 'FileText',
        path: '/dashboard/contratos',
        color: 'orange',
        width: '25',
        height: '1',
        type: 'standard'
      },
      {
        id: 'card-relatorios',
        title: 'Relatórios',
        iconId: 'BarChart2',
        path: '/dashboard/relatorios',
        color: 'gray-light',
        width: '25',
        height: '1',
        type: 'standard'
      }
    ];
  };
  
  // Function to save dashboard configuration
  const saveConfig: SaveConfigProps = async (cards, deptId) => {
    try {
      setIsSaving(true);
      const departmentToUse = deptId || selectedDepartment || departmentId;
      
      if (!departmentToUse) {
        console.error('No department ID provided for saving dashboard config');
        return false;
      }
      
      // Check if there's an existing config for this department
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('id')
        .eq('department', departmentToUse)
        .eq('view_type', selectedViewType)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking for existing dashboard:', error);
        return false;
      }
      
      if (data) {
        // Update existing config
        const { error: updateError } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: JSON.stringify(cards),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating dashboard:', updateError);
          return false;
        }
      } else {
        // Create new config
        const { error: insertError } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentToUse,
            view_type: selectedViewType,
            cards_config: JSON.stringify(cards),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating dashboard:', insertError);
          return false;
        }
      }
      
      // Update local state
      setConfig(cards);
      return true;
    } catch (err) {
      console.error('Failed to save dashboard config:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to save default dashboard
  const saveDefaultDashboard = async (cards: ActionCardItem[]) => {
    try {
      setIsSaving(true);
      
      // Instead of using rpc function, directly update the default_dashboard table
      const { error } = await supabase
        .from('default_dashboard')
        .upsert({
          id: 'default',
          cards_config: JSON.stringify(cards),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Failed to save default dashboard:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    config,
    setConfig,
    loading,
    isLoading: loading,
    defaultConfig,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isSaving,
    saveConfig,
    saveDefaultDashboard,
  };
};
