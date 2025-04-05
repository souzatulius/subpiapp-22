
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTableExists = (tableName: string) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        // Try to query the table using RPC instead of direct query
        const { data, error } = await supabase.rpc('check_table_exists', {
          table_name: tableName
        });
        
        if (error) {
          // Fallback to a safer approach - check if we get valid result from specific query
          try {
            const { error: queryError } = await supabase
              .from(tableName as any)
              .select('id')
              .limit(1)
              .throwOnError();
            
            setExists(!queryError);
          } catch (err) {
            console.log(`Table ${tableName} check failed:`, err);
            setExists(false);
          }
        } else {
          setExists(data === true);
        }
      } catch (err) {
        console.error(`Error checking if table ${tableName} exists:`, err);
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTableExists();
  }, [tableName]);

  return { exists, isLoading };
};
