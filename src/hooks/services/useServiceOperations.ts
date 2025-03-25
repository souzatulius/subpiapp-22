
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useServiceOperations(refreshCallback: () => Promise<void>) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addService = async (data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      setIsAdding(true);
      const { error } = await supabase
        .from('servicos')
        .insert(data);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: 'Serviço adicionado',
        description: 'O serviço foi adicionado com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o serviço.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateService = async (
    id: string, 
    data: { descricao: string; area_coordenacao_id: string }
  ) => {
    try {
      setIsEditing(true);
      const { error } = await supabase
        .from('servicos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: 'Serviço atualizado',
        description: 'O serviço foi atualizado com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o serviço.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await refreshCallback();
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      
      // Check if error is due to foreign key constraint
      if (error.code === '23503') {
        toast({
          title: 'Erro',
          description: 'Este serviço está sendo usado e não pode ser excluído.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o serviço.',
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
    addService,
    updateService,
    deleteService
  };
}
