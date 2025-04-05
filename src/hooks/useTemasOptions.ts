
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTemasTableExists } from './useTableExists';

export interface Tema {
  id: string;
  descricao: string;
}

export const useTemasOptions = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { exists: temasTableExists, loading: checkingTable } = useTemasTableExists();

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        setIsLoading(true);
        
        // Always use problemas table as fallback since temas doesn't exist
        const { data, error } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');
          
        if (error) throw error;
        
        // Safely transform data to Tema type
        const transformedData = (data || []).map(item => ({
          id: item.id || '',
          descricao: item.descricao || ''
        }));
        
        setTemas(transformedData);
      } catch (error) {
        console.error('Error fetching temas:', error);
        // Provide some default temas as fallback
        setTemas([
          { id: 'default-1', descricao: 'Zeladoria' },
          { id: 'default-2', descricao: 'Comunicação' },
          { id: 'default-3', descricao: 'Infraestrutura' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch when we know table status
    if (!checkingTable) {
      fetchTemas();
    }
  }, [temasTableExists, checkingTable]);

  return { temas, isLoading };
};
