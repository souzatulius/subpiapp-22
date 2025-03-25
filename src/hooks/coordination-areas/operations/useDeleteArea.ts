
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SupervisaoTecnica } from '@/types/common';

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  const deleteAreaMutation = useMutation({
    mutationFn: async (areaId: string) => {
      const { error } = await supabase
        .from('supervisoes_tecnicas')
        .delete()
        .eq('id', areaId);

      if (error) throw error;
      return areaId;
    },
    onSuccess: (deletedAreaId) => {
      // Atualizar o cache de áreas removendo a área excluída
      queryClient.setQueryData<SupervisaoTecnica[]>(
        ['areas'],
        (old) => old ? old.filter(area => area.id !== deletedAreaId) : []
      );

      toast({
        title: "Supervisão técnica excluída",
        description: "A supervisão técnica foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir área:', error);
      toast({
        title: "Erro ao excluir supervisão técnica",
        description:
          "Não foi possível excluir a supervisão técnica. Verifique se não existem serviços, problemas ou usuários associados.",
        variant: "destructive",
      });
    },
  });

  return deleteAreaMutation;
};
