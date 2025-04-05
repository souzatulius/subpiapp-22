
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTableExists = (tableName: string) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        // Try direct query first with error handling
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
        
        // Try a safer approach using custom SQL query
        const { data, error } = await supabase
          .rpc('table_exists', { table_name: tableName })
          .single();
          
        if (!error && data) {
          setExists(data === true);
        } else {
          // Fallback to a metadata approach
          try {
            const { data: tablesData } = await supabase
              .from('_metadata_tables')
              .select('name')
              .eq('name', tableName)
              .maybeSingle();
            
            setExists(!!tablesData);
          } catch (metadataError) {
            // Final fallback: assume the table doesn't exist if all checks fail
            console.log(`All checks for table ${tableName} failed`);
            setExists(false);
          }
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
