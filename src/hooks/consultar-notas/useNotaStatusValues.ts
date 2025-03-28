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
        
        // Try to execute direct SQL to get the check constraint values
        const { data: checkData, error: checkError } = await supabase
          .rpc('get_nota_status_values');
          
        if (!checkError && checkData && checkData.length > 0) {
          setStatusValues(checkData);
          return;
        }
        
        // Fallback: use this approach to get a list of notes with different statuses
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select('status')
          .limit(100);
        
        if (error) throw error;
        
        // Extract unique status values
        if (data && data.length > 0) {
          const uniqueStatuses = [...new Set(data.map(item => item.status))];
          setStatusValues(uniqueStatuses);
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
