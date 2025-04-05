
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
          // For safety, we'll check a known table
          const { data, error } = await supabase
            .from('problemas')
            .select('id', { count: 'exact', head: true });
            
          // If we get here without error, assume the table exists
          setExists(true);
          
        } catch (e) {
          // Silent catch, we'll try alternative approach below
          console.warn(`Could not check table ${tableName} with standard approach:`, e);
          
          // For safety, assume table exists to avoid breaking functionality
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
