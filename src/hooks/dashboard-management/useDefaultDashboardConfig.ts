
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CardColor, CardWidth, CardHeight, CardType, ActionCardItem } from '@/types/dashboard';
import { useUserStore } from '@/store/useUserStore';

// Simplified config to avoid excessive type instantiation
type ConfigType = Record<string, ActionCardItem[]>;

export const useDefaultDashboardConfig = (departmentId?: string) => {
  const [config, setConfig] = useState<ConfigType>({});
  const [loading, setLoading] = useState(true);
  const [defaultConfig, setDefaultConfig] = useState<ActionCardItem[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      
      try {
        if (!user) {
          console.log('No user found');
          setLoading(false);
          return;
        }

        // Get the default config for the department
        let { data: depConfig, error: depError } = await supabase
          .from('dashboard_configs')
          .select('*')
          .eq('coordenacao_id', departmentId || user.coordenacao_id)
          .single();

        // If there's no config for this department
        if (depError || !depConfig) {
          console.log('No department config found, using default');
          
          const defaultCards = generateDefaultCards(departmentId || user.coordenacao_id);
          setDefaultConfig(defaultCards);
          setConfig({
            [departmentId || user.coordenacao_id]: defaultCards
          });
          setLoading(false);
          return;
        }

        // Parse the config
        const parsedConfig = depConfig.config ? 
          JSON.parse(depConfig.config) : 
          generateDefaultCards(departmentId || user.coordenacao_id);
        
        setDefaultConfig(parsedConfig);
        setConfig({
          [departmentId || user.coordenacao_id]: parsedConfig
        });
      } catch (error) {
        console.error('Error fetching dashboard config:', error);
        const defaultCards = generateDefaultCards(departmentId || user.coordenacao_id);
        setDefaultConfig(defaultCards);
        setConfig({
          [departmentId || user.coordenacao_id]: defaultCards
        });
      } finally {
        setLoading(false);
      }
    };

    if (user || departmentId) {
      fetchConfig();
    }
  }, [user, departmentId]);

  const saveConfig = async (cards: ActionCardItem[], deptId?: string) => {
    try {
      const departmentToUse = deptId || departmentId || (user ? user.coordenacao_id : null);
      
      if (!departmentToUse) {
        console.error('No department ID provided for saving config');
        return false;
      }

      // Check if config already exists
      const { data: existingConfig } = await supabase
        .from('dashboard_configs')
        .select('*')
        .eq('coordenacao_id', departmentToUse)
        .single();

      if (existingConfig) {
        // Update existing config
        const { error } = await supabase
          .from('dashboard_configs')
          .update({
            config: JSON.stringify(cards),
            updated_at: new Date().toISOString()
          })
          .eq('coordenacao_id', departmentToUse);
        
        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from('dashboard_configs')
          .insert({
            coordenacao_id: departmentToUse,
            config: JSON.stringify(cards),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
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
    }
  };

  return {
    config: config[departmentId || (user ? user.coordenacao_id : '')] || defaultConfig,
    defaultConfig,
    loading,
    saveConfig
  };
};

// Helper function to generate default cards for a department
const generateDefaultCards = (departmentId: string): ActionCardItem[] => {
  const isComunicacao = departmentId === 'comunicacao';
  
  const cards: ActionCardItem[] = [
    // Default cards for all departments
    {
      id: uuidv4(),
      title: 'Consultar Demandas',
      iconId: 'Search',
      path: '/demandas',
      color: 'blue-dark' as CardColor,
      width: '1' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      type: 'default' as CardType,
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: 'Consultar Notas',
      iconId: 'FileText',
      path: '/notas',
      color: 'green' as CardColor,
      width: '1' as CardWidth,
      height: '1' as CardHeight,
      isCustom: false,
      type: 'default' as CardType,
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
        width: '1' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'default' as CardType,
        displayMobile: true,
        mobileOrder: 1
      },
      {
        id: uuidv4(),
        title: 'Criar Nota Oficial',
        iconId: 'FileEdit',
        path: '/dashboard/notas/criar',
        color: 'lime' as CardColor,
        width: '1' as CardWidth,
        height: '1' as CardHeight,
        isCustom: false,
        type: 'default' as CardType,
        displayMobile: true,
        mobileOrder: 2
      }
    );
  }

  return cards;
};
