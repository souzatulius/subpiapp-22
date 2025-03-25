
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Problem, Area } from './types';

export const useProblemsData = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch problems with coordination area information
      const { data: problemsData, error: problemsError } = await supabase
        .from('problemas')
        .select(`
          *,
          areas_coordenacao:supervisao_tecnica_id (
            id, 
            descricao,
            coordenacao,
            coordenacao_id
          )
        `)
        .order('descricao');

      if (problemsError) throw problemsError;
      
      // Ensure properly typed data before setting state
      const typedProblems: Problem[] = problemsData ? problemsData.map(problem => ({
        id: problem.id,
        descricao: problem.descricao,
        supervisao_tecnica_id: problem.supervisao_tecnica_id,
        areas_coordenacao: problem.areas_coordenacao ? {
          id: problem.areas_coordenacao.id || '',
          descricao: problem.areas_coordenacao.descricao || '',
          coordenacao: problem.areas_coordenacao.coordenacao || '',
          coordenacao_id: problem.areas_coordenacao.coordenacao_id || ''
        } : undefined,
        criado_em: problem.criado_em,
        atualizado_em: problem.atualizado_em
      })) : [];
      
      setProblems(typedProblems);
    } catch (error: any) {
      console.error('Erro ao buscar problemas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os problemas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    problems,
    isLoading,
    fetchProblems
  };
};
