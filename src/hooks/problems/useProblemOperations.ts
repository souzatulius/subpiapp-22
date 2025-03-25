
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
      
      // First check if there are any services using this problem
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select('id')
        .eq('problema_id', id);
      
      if (servicesError) throw servicesError;
      
      if (servicesData && servicesData.length > 0) {
        toast({
          title: "Erro",
          description: "Este problema está associado a serviços e não pode ser excluído. Exclua os serviços associados primeiro.",
          variant: "destructive",
        });
        return false;
      }
      
      // Then check if there are any demandas using this problem
      const { data: demandasData, error: demandasError } = await supabase
        .from('demandas')
        .select('id')
        .eq('problema_id', id);
      
      if (demandasError) throw demandasError;
      
      if (demandasData && demandasData.length > 0) {
        toast({
          title: "Erro",
          description: "Este problema está associado a demandas e não pode ser excluído.",
          variant: "destructive",
        });
        return false;
      }
      
      // If no dependent records, proceed with deletion
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
      
      toast({
        title: "Erro",
        description: "Não foi possível excluir o problema.",
        variant: "destructive",
      });
      
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
