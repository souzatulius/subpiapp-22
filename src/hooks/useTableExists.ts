
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTableExists = (tableName: string) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        // Try direct query with error handling
        try {
          const { data, error } = await supabase
            .from(tableName as any)
            .select('id')
            .limit(1);
          
          if (!error) {
            setExists(true);
            setIsLoading(false);
            return;
          }
        } catch (directQueryError) {
          // If direct query fails, continue with other approaches
          console.log(`Direct query to ${tableName} failed:`, directQueryError);
        }
        
        // Call edge function to check table existence
        try {
          const { data, error } = await supabase.functions.invoke('table-exists', {
            body: { table_name: tableName }
          });
          
          if (!error && data) {
            setExists(data.exists === true);
            setIsLoading(false);
            return;
          }
        } catch (functionError) {
          console.log(`Function check for table ${tableName} failed:`, functionError);
        }
        
        // Last resort - set to false
        setExists(false);
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
