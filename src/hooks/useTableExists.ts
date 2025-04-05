
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UseTableExistsResult {
  exists: boolean;
  loading: boolean;
  error: Error | null;
}

export const useTableExists = (tableName: string): UseTableExistsResult => {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        setLoading(true);
        
        // First try using standard SELECT COUNT(*) approach as a fallback
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
            
          if (!error) {
            // Table exists if we got here without an error
            setExists(true);
            return;
          }
        } catch (e) {
          // Silent catch, we'll try alternative approach
        }
        
        // Try a direct query to the system catalog
        try {
          const { data, error } = await supabase.rpc('check_table_exists', { 
            table_name: tableName 
          });
          
          if (error) throw error;
          setExists(!!data);
        } catch (e) {
          // If the RPC function doesn't work, assume table exists 
          // to avoid breaking functionality completely
          console.warn(`Could not check if table ${tableName} exists. Assuming it does.`);
          setExists(true);
        }
      } catch (err: any) {
        console.error(`Error checking if table ${tableName} exists:`, err);
        setError(err);
        // For safety, assume the table exists
        setExists(true);
      } finally {
        setLoading(false);
      }
    };

    checkTableExists();
  }, [tableName]);

  return { exists, loading, error };
};

// Wrapper to check if the temas table exists
export const useTemasTableExists = () => {
  return useTableExists('temas');
};
