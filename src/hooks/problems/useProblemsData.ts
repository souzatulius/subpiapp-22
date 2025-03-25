
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
          areas_coordenacao:area_coordenacao_id (
            id, 
            descricao,
            coordenacao_id
          )
        `)
        .order('descricao');

      if (problemsError) throw problemsError;
      
      setProblems(problemsData || []);
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
