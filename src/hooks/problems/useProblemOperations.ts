
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useProblemOperations(refreshCallback: () => Promise<void>) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addProblem = async (data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsAdding(true);
      const { error } = await supabase
        .from('problemas')
        .insert({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id
        });

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: 'Problema adicionado',
        description: 'O problema foi adicionado com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar problema:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o problema.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateProblem = async (
    id: string, 
    data: { descricao: string; area_coordenacao_id: string }
  ) => {
    try {
      setIsEditing(true);
      const { error } = await supabase
        .from('problemas')
        .update({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: 'Problema atualizado',
        description: 'O problema foi atualizado com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar problema:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o problema.',
        variant: 'destructive',
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
        title: 'Problema excluído',
        description: 'O problema foi excluído com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir problema:', error);
      
      // Check if error is due to foreign key constraint
      if (error.code === '23503') {
        toast({
          title: 'Erro',
          description: 'Este problema está sendo usado e não pode ser excluído.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o problema.',
          variant: 'destructive',
        });
      }
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isSubmitting: isAdding || isEditing,
    addProblem,
    updateProblem,
    deleteProblem
  };
}
