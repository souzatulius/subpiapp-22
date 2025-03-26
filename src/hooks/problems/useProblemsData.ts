
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Problem } from './types';
import { toast } from '@/components/ui/use-toast';

export const useProblemsData = () => {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async (): Promise<Problem[]> => {
      try {
        const { data, error } = await supabase
          .from('problemas')
          .select(`
            *,
            supervisao_tecnica:supervisao_tecnica_id (
              id,
              descricao,
              sigla,
              coordenacao_id,
              coordenacoes:coordenacao_id (
                descricao
              )
            )
          `)
          .order('descricao');
        
        if (error) throw error;
        
        // Process the data to add coordination to supervisao_tecnica
        return (data || []).map(problem => ({
          ...problem,
          supervisao_tecnica: problem.supervisao_tecnica ? {
            ...problem.supervisao_tecnica,
            coordenacao: problem.supervisao_tecnica.coordenacoes?.descricao
          } : undefined
        }));
      } catch (error: any) {
        console.error('Error fetching problems:', error);
        toast({
          title: 'Erro ao carregar problemas/temas',
          description: error.message,
          variant: 'destructive'
        });
        return [];
      }
    }
  });
};
