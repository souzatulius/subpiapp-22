
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTableExists } from './useTableExists';

interface Tema {
  id: string;
  descricao: string;
}

export const useTemasOptions = () => {
  const { exists: temasTableExists, isLoading: checkingTable } = useTableExists('temas');
  
  const { data: temas = [], isLoading: loadingTemas } = useQuery({
    queryKey: ['temas-or-problems'],
    queryFn: async () => {
      try {
        // If temas table exists, query it
        if (temasTableExists) {
          try {
            const { data: temasData, error: temasError } = await supabase
              .from('temas' as any)
              .select('id, descricao');
            
            if (!temasError && temasData && temasData.length > 0) {
              return temasData as Tema[];
            }
          } catch (e) {
            console.log('Error querying temas table:', e);
          }
        }
        
        // Fallback to problemas table
        const { data: problemasData, error: problemasError } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');
        
        if (problemasError) throw problemasError;
        
        // Map the problem data to the tema interface for compatibility
        return (problemasData || []).map(problem => ({
          id: problem.id,
          descricao: problem.descricao
        })) as Tema[];
        
      } catch (error) {
        console.error('Error fetching temas or problems:', error);
        return [] as Tema[];
      }
    },
    enabled: !checkingTable, // Only run query after checking if table exists
  });

  return {
    temas,
    isLoading: checkingTable || loadingTemas
  };
};
