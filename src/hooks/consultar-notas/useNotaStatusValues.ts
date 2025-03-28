
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseNotaStatusValuesResult {
  statusValues: string[];
  isLoading: boolean;
  error: Error | null;
}

export const useNotaStatusValues = (): UseNotaStatusValuesResult => {
  const [statusValues, setStatusValues] = useState<string[]>([
    'pendente', 
    'aprovado', 
    'rejeitado', 
    'excluido', 
    'concluido'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatusValues = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select('status')
          .limit(1000);

        if (error) throw error;

        if (data && data.length > 0) {
          // Extract unique status values
          const uniqueStatuses = [...new Set(data.map(item => item.status))];
          
          // Only update if we got statuses back
          if (uniqueStatuses.length > 0) {
            setStatusValues(uniqueStatuses);
          }
        }
      } catch (err: any) {
        console.error('Error fetching nota status values:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusValues();
  }, []);

  return {
    statusValues,
    isLoading,
    error
  };
};
