
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Problem, Area } from './types';

// Custom hook for accessing problems data
export const useProblemsData = () => {
  const {
    data: problems = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      // Fetch problems with supervisao_tecnica information
      const { data, error } = await supabase
        .from('problemas')
        .select(`
          id,
          descricao,
          supervisao_tecnica_id,
          criado_em,
          atualizado_em,
          icone,
          supervisao_tecnica:supervisao_tecnica_id (
            id,
            descricao,
            coordenacao_id,
            coordenacao:coordenacao_id (
              id,
              descricao
            )
          )
        `)
        .order('descricao');

      if (error) throw error;
      
      // Ensure the data conforms to Problem type
      return (data || []).map(item => ({
        id: item.id,
        descricao: item.descricao,
        supervisao_tecnica_id: item.supervisao_tecnica_id,
        supervisao_tecnica: item.supervisao_tecnica,
        icone: item.icone || undefined,
        criado_em: item.criado_em,
        atualizado_em: item.atualizado_em
      })) as Problem[];
    },
    meta: {
      onError: (err: any) => {
        console.error('Error fetching problems:', err);
      }
    }
  });

  const {
    data: areas = [],
    isLoading: areasLoading,
    error: areasError
  } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supervisoes_tecnicas')
        .select(`
          id,
          descricao,
          sigla,
          coordenacao_id,
          coordenacao:coordenacao_id (
            id, 
            descricao
          )
        `)
        .order('descricao');

      if (error) throw error;
      return data as Area[];
    }
  });

  // Create a promise-based wrapper for refetch to match the expected type
  const fetchProblems = async () => {
    await refetch();
  };

  return {
    problems,
    areas,
    isLoading: isLoading || areasLoading,
    error: error || areasError,
    fetchProblems
  };
};

// Export an alias for backward compatibility
export const useProblems = useProblemsData;
