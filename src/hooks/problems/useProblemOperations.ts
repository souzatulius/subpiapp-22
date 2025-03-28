
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { problemSchema } from './types';

export const useProblemOperations = (onSuccess: () => Promise<void>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const addProblem = useCallback(async (problemData: { descricao: string; coordenacao_id: string; icone?: string }) => {
    try {
      setIsSubmitting(true);
      
      // Validate data with zod schema
      const validatedData = problemSchema.parse(problemData);
      
      const { data, error } = await supabase
        .from('problemas')
        .insert(validatedData)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Problema adicionado",
        description: "O problema foi adicionado com sucesso.",
      });
      
      await onSuccess();
      
      return data[0];
    } catch (error: any) {
      console.error('Error adding problem:', error);
      
      // Check if it's a validation error from zod
      if (error.errors) {
        const errorMessage = error.errors.map((e: any) => e.message).join(', ');
        toast({
          title: "Erro de validação",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao adicionar problema",
          description: error.message || "Não foi possível adicionar o problema.",
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);
  
  const updateProblem = useCallback(async (id: string, problemData: { descricao: string; coordenacao_id: string; icone?: string }) => {
    try {
      setIsSubmitting(true);
      
      // Validate data with zod schema
      const validatedData = problemSchema.parse(problemData);
      
      const { error } = await supabase
        .from('problemas')
        .update(validatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Problema atualizado",
        description: "O problema foi atualizado com sucesso.",
      });
      
      await onSuccess();
      
      return true;
    } catch (error: any) {
      console.error('Error updating problem:', error);
      
      // Check if it's a validation error from zod
      if (error.errors) {
        const errorMessage = error.errors.map((e: any) => e.message).join(', ');
        toast({
          title: "Erro de validação",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao atualizar problema",
          description: error.message || "Não foi possível atualizar o problema.",
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);
  
  const deleteProblem = useCallback(async (id: string) => {
    try {
      setIsDeleting(true);
      
      // First check if this problem is used by any services
      const { data: relatedServices, error: servicesError } = await supabase
        .from('servicos')
        .select('id')
        .eq('problema_id', id)
        .limit(1);
      
      if (servicesError) throw servicesError;
      
      if (relatedServices && relatedServices.length > 0) {
        toast({
          title: "Não foi possível excluir",
          description: "Este problema está sendo usado por um ou mais serviços.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if this problem is used by any demands
      const { data: relatedDemands, error: demandsError } = await supabase
        .from('demandas')
        .select('id')
        .eq('problema_id', id)
        .limit(1);
      
      if (demandsError) throw demandsError;
      
      if (relatedDemands && relatedDemands.length > 0) {
        toast({
          title: "Não foi possível excluir",
          description: "Este problema está sendo usado por uma ou mais demandas.",
          variant: "destructive"
        });
        return false;
      }
      
      // Now delete the problem
      const { error } = await supabase
        .from('problemas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Problema excluído",
        description: "O problema foi excluído com sucesso.",
      });
      
      await onSuccess();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting problem:', error);
      toast({
        title: "Erro ao excluir problema",
        description: error.message || "Não foi possível excluir o problema.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess]);
  
  return {
    isSubmitting,
    isDeleting,
    addProblem,
    updateProblem,
    deleteProblem
  };
};
