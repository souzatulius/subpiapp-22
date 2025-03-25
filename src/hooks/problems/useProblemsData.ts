
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Problem, Area } from './types';

export function useProblemsData() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      setAreas([]);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('problemas')
        .select(`
          *,
          areas_coordenacao(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      
      const transformedData: Problem[] = (data || []).map((item: any) => ({
        ...item,
        areas_coordenacao: item.areas_coordenacao
      }));
      
      setProblems(transformedData);
    } catch (error: any) {
      console.error('Erro ao carregar problemas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os problemas',
        variant: 'destructive',
      });
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    problems,
    setProblems,
    areas,
    loading,
    fetchProblems
  };
}
