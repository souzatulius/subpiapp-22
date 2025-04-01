import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CardColor, CardWidth, CardHeight, CardType, ActionCardItem } from '@/types/dashboard';
import { useAuth } from '@/hooks/useSupabaseAuth';

// Simplified config to avoid excessive type instantiation
type ConfigType = Record<string, ActionCardItem[]>;

export const useDefaultDashboardConfig = (departmentId?: string) => {
  const [config, setConfig] = useState<ConfigType>({});
  const [loading, setLoading] = useState(true);
  const [defaultConfig, setDefaultConfig] = useState<ActionCardItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentId || '');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      
      try {
        if (!selectedDepartment && !departmentId && !user) {
          console.log('No department or user found');
          setLoading(false);
          return;
        }

        // Get the default config for the department
        const deptId = selectedDepartment || departmentId || (user ? user.coordenacao_id : null);
        
        if (!deptId) {
          setLoading(false);
          return;
        }

        let { data: depConfig, error: depError } = await supabase
          .from('department_dashboards')
          .select('*')
          .eq('department', deptId)
          .eq('view_type', selectedViewType)
          .single();

        // If there's no config for this department
        if (depError || !depConfig) {
          console.log(`No ${selectedViewType} config found for ${deptId}, using default`);
          
          const defaultCards = generateDefaultCards(deptId, selectedViewType);
          setDefaultConfig(defaultCards);
          setConfig({
            [deptId]: defaultCards
          });
          setLoading(false);
          return;
        }

        // Parse the config
        const parsedConfig = depConfig.cards_config ? 
          JSON.parse(depConfig.cards_config) : 
          generateDefaultCards(deptId, selectedViewType);
        
        setDefaultConfig(parsedConfig);
        setConfig({
          [deptId]: parsedConfig
        });
      } catch (error) {
        console.error('Error fetching dashboard config:', error);
        const deptId = selectedDepartment || departmentId || (user ? user.coordenacao_id : '');
        const defaultCards = generateDefaultCards(deptId, selectedViewType);
        setDefaultConfig(defaultCards);
        setConfig({
          [deptId]: defaultCards
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [user, departmentId, selectedDepartment, selectedViewType]);

  const saveDefaultDashboard = async () => {
    try {
      setIsSaving(true);
      const departmentToUse = selectedDepartment || departmentId || (user ? user.coordenacao_id : null);
      
      if (!departmentToUse) {
        console.error('No department ID provided for saving config');
        return false;
      }

      const currentCards = config[departmentToUse] || defaultConfig;

      // Check if config already exists
      const { data: existingConfig } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', departmentToUse)
        .eq('view_type', selectedViewType)
        .single();

      if (existingConfig) {
        // Update existing config
        const { error } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: JSON.stringify(currentCards),
            updated_at: new Date().toISOString(),
            updated_by: user?.id
          })
          .eq('department', departmentToUse)
          .eq('view_type', selectedViewType);
        
        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentToUse,
            cards_config: JSON.stringify(currentCards),
            view_type: selectedViewType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            updated_by: user?.id
          });
        
        if (error) throw error;
      }

      // Update local state
      setConfig(prevConfig => ({
        ...prevConfig,
        [departmentToUse]: currentCards
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveConfig = async (cards: ActionCardItem[], deptId?: string) => {
    try {
      setIsSaving(true);
      const departmentToUse = deptId || selectedDepartment || departmentId || (user ? user.coordenacao_id : null);
      
      if (!departmentToUse) {
        console.error('No department ID provided for saving config');
        return false;
      }

      // Check if config already exists
      const { data: existingConfig } = await supabase
        .from('department_dashboards')
        .select('*')
        .eq('department', departmentToUse)
        .eq('view_type', selectedViewType)
        .single();

      if (existingConfig) {
        // Update existing config
        const { error } = await supabase
          .from('department_dashboards')
          .update({
            cards_config: JSON.stringify(cards),
            updated_at: new Date().toISOString(),
            updated_by: user?.id
          })
          .eq('department', departmentToUse)
          .eq('view_type', selectedViewType);
        
        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from('department_dashboards')
          .insert({
            department: departmentToUse,
            cards_config: JSON.stringify(cards),
            view_type: selectedViewType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            updated_by: user?.id
          });
        
        if (error) throw error;
      }

      // Reset all user dashboard customizations for this department
      // This makes the default dashboard take precedence
      try {
        const { error: deleteUserCustomsError } = await supabase
          .from('user_dashboard')
          .delete()
          .eq('department_id', departmentToUse);

        if (deleteUserCustomsError) {
          console.warn('Could not reset user dashboards:', deleteUserCustomsError);
        }
      } catch (err) {
        console.warn('Could not reset user dashboards:', err);
      }

      // Update local state
      setConfig(prevConfig => ({
        ...prevConfig,
        [departmentToUse]: cards
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config: config[selectedDepartment || departmentId || (user ? user.coordenacao_id : '')] || defaultConfig,
    defaultConfig,
    loading,
    saveConfig,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading: loading,
    isSaving,
    saveDefaultDashboard: saveConfig
  };
};

// Helper function to generate default cards for a department
const generateDefaultCards = (departmentId: string, viewType: 'dashboard' | 'communication' = 'dashboard'): ActionCardItem[] => {
  const isComunicacao = departmentId === 'comunicacao';
  
  // Generate standard dashboard cards
  if (viewType === 'dashboard') {
    const cards: ActionCardItem[] = [
      // Default cards for all departments
      {
        id: uuidv4(),
        title: 'Consultar Demandas',
        iconId: 'Search',
        path: '/demandas',
        color: 'blue-dark' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: uuidv4(),
        title: 'Consultar Notas',
        iconId: 'FileText',
        path: '/notas',
        color: 'green' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 4
      }
    ];

    // Comunicação department specific cards
    if (isComunicacao) {
      cards.unshift(
        {
          id: uuidv4(),
          title: 'Nova Solicitação',
          iconId: 'Plus',
          path: '/dashboard/comunicacao/cadastrar',
          color: 'orange-600' as CardColor,
          width: '25' as CardWidth,
          height: '1' as CardHeight,
          isCustom: false,
          type: 'standard' as CardType,
          displayMobile: true,
          mobileOrder: 1
        },
        {
          id: uuidv4(),
          title: 'Criar Nota Oficial',
          iconId: 'FileEdit',
          path: '/dashboard/notas/criar',
          color: 'lime' as CardColor,
          width: '25' as CardWidth,
          height: '1' as CardHeight,
          isCustom: false,
          type: 'standard' as CardType,
          displayMobile: true,
          mobileOrder: 2
        }
      );
    }
    
    return cards;
  } 
  // Generate communication dashboard cards
  else if (viewType === 'communication') {
    return [
      {
        id: uuidv4(),
        title: 'Cadastrar Demanda',
        subtitle: 'Registre novas solicitações da imprensa',
        iconId: 'PlusCircle',
        path: '/dashboard/comunicacao/cadastrar',
        color: 'blue' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: uuidv4(),
        title: 'Responder Demanda',
        subtitle: 'Responda às demandas pendentes',
        iconId: 'MessageSquare',
        path: '/dashboard/comunicacao/responder',
        color: 'green' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 2
      },
      {
        id: uuidv4(),
        title: 'Criar Nota Oficial',
        subtitle: 'Elabore notas oficiais',
        iconId: 'FileText',
        path: '/dashboard/comunicacao/criar-nota',
        color: 'orange' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 3
      },
      {
        id: uuidv4(),
        title: 'Aprovar Notas',
        subtitle: 'Revise e aprove notas oficiais',
        iconId: 'CheckCircle',
        path: '/dashboard/comunicacao/aprovar-nota',
        color: 'purple-light' as CardColor,
        width: '25' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'standard' as CardType,
        displayMobile: true,
        mobileOrder: 4
      }
    ];
  }
  
  return [];
};
