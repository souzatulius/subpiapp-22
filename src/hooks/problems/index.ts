
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Define types
export type Problem = {
  id: string;
  descricao: string;
  area_coordenacao_id: string;
  area_coordenacao?: {
    descricao: string;
  };
  criado_em?: string;
  atualizado_em?: string;
};

export type Area = {
  id: string;
  descricao: string;
};

// Schema for validation
export const problemSchema = z.object({
  descricao: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  area_coordenacao_id: z.string().uuid({ message: "Área de coordenação inválida" })
});

export const useProblemsData = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch problems with coordination area information
      const { data: problemsData, error: problemsError } = await supabase
        .from('problemas')
        .select(`
          *,
          area_coordenacao:area_coordenacao_id (descricao)
        `)
        .order('descricao');

      if (problemsError) throw problemsError;
      
      // Fetch coordination areas for the form select
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao');
        
      if (areasError) throw areasError;
      
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

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return {
    problems,
    areas,
    isLoading,
    fetchProblems
  };
};

export const useProblemOperations = (refreshCallback: () => Promise<void>) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addProblem = async (data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsAdding(true);
      const { error } = await supabase
        .from('problemas')
        .insert(data);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: "Problema adicionado",
        description: "Problema adicionado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar problema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o problema.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateProblem = async (id: string, data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsEditing(true);
      const { error } = await supabase
        .from('problemas')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: "Problema atualizado",
        description: "Problema atualizado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar problema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o problema.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteProblem = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('problemas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: "Problema excluído",
        description: "Problema excluído com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir problema:', error);
      
      // Verificar se o erro é devido a chave estrangeira
      if (error.code === '23503') {
        toast({
          title: "Erro",
          description: "Este problema está sendo usado e não pode ser excluído.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o problema.",
          variant: "destructive",
        });
      }
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting: isAdding || isEditing,
    isDeleting,
    addProblem,
    updateProblem,
    deleteProblem
  };
};
