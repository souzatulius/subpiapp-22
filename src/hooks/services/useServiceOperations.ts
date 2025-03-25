
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
      
      // First, get a default problema_id (we'll use the first one we find)
      const { data: problemaData, error: problemaError } = await supabase
        .from('problemas')
        .select('id')
        .limit(1);
      
      if (problemaError) throw problemaError;
      
      // If no problems exist yet, create a default one
      let problema_id;
      if (!problemaData || problemaData.length === 0) {
        const { data: newProblema, error: newProblemaError } = await supabase
          .from('problemas')
          .insert({ descricao: 'Problema Padrão' })
          .select();
        
        if (newProblemaError) throw newProblemaError;
        problema_id = newProblema[0].id;
      } else {
        problema_id = problemaData[0].id;
      }
      
      // Now insert the service with the problema_id
      const { error } = await supabase
        .from('servicos')
        .insert({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
          problema_id: problema_id
        });

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
      
      // Get current service data to maintain the problema_id
      const { data: currentService, error: fetchError } = await supabase
        .from('servicos')
        .select('problema_id')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update the service with the existing problema_id
      const { error } = await supabase
        .from('servicos')
        .update({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
          problema_id: currentService.problema_id
        })
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
