
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
        
        // Only try to fetch temas if the table exists
        if (temasTableExists) {
          const { data, error } = await supabase
            .from('problemas') // Fallback to problemas table if temas doesn't exist
            .select('id, descricao')
            .order('descricao');
            
          if (error) throw error;
          
          setTemas(data as Tema[]);
        } else {
          // If table doesn't exist, use problemas as fallback
          const { data, error } = await supabase
            .from('problemas')
            .select('id, descricao')
            .order('descricao');
            
          if (error) throw error;
          
          setTemas(data as Tema[]);
        }
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
