
import { CoordinationArea } from './types';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useCoordinationAreasCrud = (
  areas: CoordinationArea[],
  setAreas: React.Dispatch<React.SetStateAction<CoordinationArea[]>>
) => {
  const addAreaMutation = useMutation({
    mutationFn: async (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => {
      const { data: newArea, error } = await supabase
        .from('areas_coordenacao')
        .insert([{ ...data, is_supervision: true }])
        .select()
        .single();

      if (error) throw error;
      return newArea;
    },
    onSuccess: (newArea) => {
      setAreas(prevAreas => [...prevAreas, newArea]);
      toast({
        title: 'Supervisão técnica adicionada',
        description: 'A supervisão técnica foi adicionada com sucesso.'
      });
    },
    onError: (error: any) => {
      console.error('Error adding area:', error);
      toast({
        title: 'Erro ao adicionar supervisão técnica',
        description: error.message || 'Ocorreu um erro ao adicionar a supervisão técnica.',
        variant: 'destructive'
      });
    }
  });

  const updateAreaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: { descricao: string, sigla?: string, coordenacao_id?: string } }) => {
      const { data: updatedArea, error } = await supabase
        .from('areas_coordenacao')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedArea;
    },
    onSuccess: (updatedArea) => {
      setAreas(prevAreas => 
        prevAreas.map(area => area.id === updatedArea.id ? updatedArea : area)
      );
      toast({
        title: 'Supervisão técnica atualizada',
        description: 'A supervisão técnica foi atualizada com sucesso.'
      });
    },
    onError: (error: any) => {
      console.error('Error updating area:', error);
      toast({
        title: 'Erro ao atualizar supervisão técnica',
        description: error.message || 'Ocorreu um erro ao atualizar a supervisão técnica.',
        variant: 'destructive'
      });
    }
  });

  const deleteAreaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      setAreas(prevAreas => prevAreas.filter(area => area.id !== deletedId));
      toast({
        title: 'Supervisão técnica removida',
        description: 'A supervisão técnica foi removida com sucesso.'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting area:', error);
      toast({
        title: 'Erro ao remover supervisão técnica',
        description: error.message || 'Não foi possível remover a supervisão técnica. Verifique se não há serviços ou usuários associados.',
        variant: 'destructive'
      });
    }
  });

  return {
    isAdding: addAreaMutation.isPending,
    isEditing: updateAreaMutation.isPending,
    isDeleting: deleteAreaMutation.isPending,
    isSubmitting: addAreaMutation.isPending || updateAreaMutation.isPending,
    addArea: (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => 
      addAreaMutation.mutate(data),
    updateArea: (id: string, data: { descricao: string, sigla?: string, coordenacao_id?: string }) => 
      updateAreaMutation.mutate({ id, data }),
    deleteArea: (id: string) => deleteAreaMutation.mutate(id)
  };
};
