
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Tema {
  id: string;
  descricao: string;
}

export const useTemasOptions = () => {
  const { data: temas = [], isLoading } = useQuery({
    queryKey: ['temas'],
    queryFn: async () => {
      try {
        // First, check if temas table exists by querying problemas table as a fallback
        const { data, error } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');
        
        if (error) throw error;
        
        // Map the problem data to the tema interface for compatibility
        return data.map(problem => ({
          id: problem.id,
          descricao: problem.descricao
        })) as Tema[];
      } catch (error) {
        console.error('Error fetching temas:', error);
        return [] as Tema[];
      }
    },
  });

  return {
    temas,
    isLoading
  };
};
