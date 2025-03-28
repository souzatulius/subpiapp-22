
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotaStatusValues = () => {
  const [statusValues, setStatusValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatusValues = async () => {
      try {
        setLoading(true);
        
        // Use this approach to get a list of notes with different statuses
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select('status')
          .limit(20);
        
        if (error) throw error;
        
        // Extract unique status values
        const uniqueStatuses = [...new Set(data.map(item => item.status))];
        setStatusValues(uniqueStatuses);
      } catch (err: any) {
        console.error('Error fetching nota status values:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusValues();
  }, []);

  return { statusValues, loading, error };
};
