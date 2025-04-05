
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTableExists = (tableName: string) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        // Try to query the table
        const { error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        // If there's no error, or the error is not a "relation does not exist" error,
        // we assume the table exists
        setExists(!error || !error.message.includes('relation') || !error.message.includes('does not exist'));
      } catch (err) {
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTableExists();
  }, [tableName]);

  return { exists, isLoading };
};
