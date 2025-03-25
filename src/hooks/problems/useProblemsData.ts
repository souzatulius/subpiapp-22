
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Problem, Area } from './types';

export const useProblemsData = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch problems with supervision information
      const { data: problemsData, error: problemsError } = await supabase
        .from('problemas')
        .select(`
          *,
          supervisao_tecnica:supervisao_tecnica_id(id, descricao, coordenacao_id)
        `)
        .order('descricao');

      if (problemsError) throw problemsError;
      
      // Fetch areas for the form selector
      const { data: areasData, error: areasError } = await supabase
        .from('supervisoes_tecnicas')
        .select('*')
        .order('descricao');
        
      if (areasError) throw areasError;
      
      console.log('Fetched problems:', problemsData);
      
      setProblems(problemsData || []);
      setAreas(areasData || []);
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
    areas,
    isLoading,
    fetchProblems
  };
};
