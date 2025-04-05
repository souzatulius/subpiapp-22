
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Problem } from '@/hooks/problems';

export const useProblemasOptions = () => {
  const { data: problemas = [], isLoading } = useQuery({
    queryKey: ['problemas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problemas')
        .select(`
          id,
          descricao,
          coordenacao_id,
          supervisao_tecnica_id,
          coordenacao:coordenacao_id (id, descricao),
          supervisao_tecnica:supervisao_tecnica_id (id, descricao)
        `)
        .order('descricao');
      
      if (error) throw error;
      return data as Problem[];
    },
  });

  return {
    problemas,
    isLoading
  };
};
