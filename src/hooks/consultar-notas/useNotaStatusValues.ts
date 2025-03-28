import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotaStatusValues = () => {
  const [statusValues, setStatusValues] = useState<string[]>(['pendente', 'aprovada', 'rejeitada']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatusValues = async () => {
      try {
        setLoading(true);
        
        // Try to get a list of notes with different statuses
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select('status')
          .limit(100);
        
        if (error) throw error;
        
        // Extract unique status values
        if (data && data.length > 0) {
          const uniqueStatuses = [...new Set(data.map(item => item.status))];
          if (uniqueStatuses.length > 0) {
            setStatusValues(uniqueStatuses);
          }
          // If no statuses found, we'll keep the default values
        }
      } catch (err: any) {
        console.error('Error fetching nota status values:', err);
        setError(err);
        // Keep the default values we set in the state initialization
      } finally {
        setLoading(false);
      }
    };

    fetchStatusValues();
  }, []);

  return { statusValues, loading, error };
};
