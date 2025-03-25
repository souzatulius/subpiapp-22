
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProblemOperations = (refreshCallback: () => Promise<void>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addProblem = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!data.descricao || !data.supervisao_tecnica_id) {
      toast({
        title: "Erro",
        description: "A descrição e a supervisão técnica são obrigatórias.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('problemas')
        .insert({
          descricao: data.descricao,
          supervisao_tecnica_id: data.supervisao_tecnica_id
        });
        
      if (error) throw error;
      
      toast({
        title: "Problema adicionado",
        description: "Problema adicionado com sucesso.",
      });
      
      await refreshCallback();
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar problema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o problema: " + (error.message || "erro desconhecido"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProblem = async (id: string, data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!id || !data.descricao || !data.supervisao_tecnica_id) {
      toast({
        title: "Erro",
        description: "Dados inválidos para atualização do problema.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if problem has associated services (commented out since servicos table is removed)
      /*
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos')
        .select('id')
        .eq('problema_id', id);
        
      if (servicosError) throw servicosError;
      */
      
      const { error } = await supabase
        .from('problemas')
        .update({
          descricao: data.descricao,
          supervisao_tecnica_id: data.supervisao_tecnica_id
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Problema atualizado",
        description: "Problema atualizado com sucesso.",
      });
      
      await refreshCallback();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar problema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o problema: " + (error.message || "erro desconhecido"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProblem = async (id: string) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do problema inválido.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsDeleting(true);
      
      // Check if problem has associated services (commented out since servicos table is removed)
      /*
      const { data: servicosData, error: servicosError } = await supabase
        .from('servicos')
        .select('id')
        .eq('problema_id', id);
        
      if (servicosError) throw servicosError;
      
      if (servicosData && servicosData.length > 0) {
        toast({
          title: "Erro",
          description: "Este problema está associado a serviços e não pode ser excluído.",
          variant: "destructive",
        });
        return false;
      }
      */
      
      const { error } = await supabase
        .from('problemas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Problema excluído",
        description: "Problema excluído com sucesso.",
      });
      
      await refreshCallback();
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir problema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o problema: " + (error.message || "erro desconhecido"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting,
    isDeleting,
    addProblem,
    updateProblem,
    deleteProblem
  };
};
