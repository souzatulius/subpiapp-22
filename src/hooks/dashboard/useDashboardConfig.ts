
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { DashboardType } from './useDashboardType';

export interface DashboardConfigResult {
  config: ActionCardItem[];
  isLoading: boolean;
  error: Error | null;
  setConfig: (config: ActionCardItem[]) => void;
  saveConfig: (config: ActionCardItem[]) => Promise<boolean>;
}

export const useDashboardConfig = (
  department: string = 'main', 
  dashboardType: DashboardType = 'main'
): DashboardConfigResult => {
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Determine which table to use based on dashboard type
  const tableName = dashboardType === 'main' 
    ? 'department_dashboard' 
    : 'department_dashboard_comunicacao';

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('cards_config')
          .eq('department', department === 'default' ? 'main' : department)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data && data.cards_config) {
          try {
            const parsedConfig = JSON.parse(data.cards_config);
            setConfig(parsedConfig);
          } catch (err) {
            console.error('Failed to parse dashboard config:', err);
            setConfig([]);
          }
        } else {
          // If no config found for specific department, try to get the default one
          const { data: defaultData, error: defaultError } = await supabase
            .from(tableName)
            .select('cards_config')
            .eq('department', dashboardType === 'main' ? 'main' : 'comunicacao')
            .maybeSingle();

          if (defaultError && defaultError.code !== 'PGRST116') {
            console.error('Error fetching default dashboard config:', defaultError);
            setConfig([]);
          } else if (defaultData && defaultData.cards_config) {
            try {
              const parsedConfig = JSON.parse(defaultData.cards_config);
              setConfig(parsedConfig);
            } catch (err) {
              console.error('Failed to parse default dashboard config:', err);
              setConfig([]);
            }
          } else {
            setConfig([]);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${dashboardType} dashboard config:`, err);
        setError(err as Error);
        setConfig([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [department, tableName, dashboardType]);

  const saveConfig = async (newConfig: ActionCardItem[]): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if a record already exists - now uses the UNIQUE constraint
      const { data: existingData, error: checkError } = await supabase
        .from(tableName)
        .select('id')
        .eq('department', department)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingData) {
        // Update existing record - will work with the UNIQUE constraint
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            cards_config: JSON.stringify(newConfig),
            updated_at: new Date().toISOString()
          })
          .eq('department', department);

        if (updateError) throw updateError;
      } else {
        // Insert new record - will work with the UNIQUE constraint
        const { error: insertError } = await supabase
          .from(tableName)
          .insert({
            department,
            cards_config: JSON.stringify(newConfig),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
      
      setConfig(newConfig);
      return true;
    } catch (err) {
      console.error(`Error saving ${dashboardType} dashboard config:`, err);
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { config, isLoading, error, setConfig, saveConfig };
};
