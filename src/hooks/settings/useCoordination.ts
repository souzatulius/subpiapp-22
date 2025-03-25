
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Coordenacao } from '@/types/common';

// Export the Coordination type as an alias to Coordenacao for backward compatibility
export type Coordination = Coordenacao;

export const useCoordination = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Função para buscar coordenações
  const fetchCoordinations = async (): Promise<Coordenacao[]> => {
    const { data, error } = await supabase
      .from('coordenacoes')
      .select('*')
      .order('descricao', { ascending: true });

    if (error) throw error;
    console.log('Fetched coordenações:', data);
    return data || [];
  };

  // Query para buscar coordenações
  const {
    data: coordinations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['coordinations'],
    queryFn: fetchCoordinations,
    meta: {
      onError: (err: any) => {
        console.error('Erro ao buscar coordenações:', err);
        toast({
          title: 'Erro ao carregar coordenações',
          description: err.message || 'Ocorreu um erro ao carregar as coordenações.',
          variant: 'destructive',
        });
      },
    },
  });

  // Mutation para adicionar coordenação
  const addCoordinationMutation = useMutation({
    mutationFn: async (newCoordination: { descricao: string; sigla?: string }) => {
      const { data, error } = await supabase
        .from('coordenacoes')
        .insert(newCoordination)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newCoordination) => {
      // Atualizar o cache de coordenações
      queryClient.setQueryData<Coordenacao[]>(
        ['coordinations'],
        (old) => old ? [...old, newCoordination] : [newCoordination]
      );

      toast({
        title: 'Coordenação adicionada',
        description: 'A coordenação foi adicionada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao adicionar coordenação:', error);
      toast({
        title: 'Erro ao adicionar coordenação',
        description: error.message || 'Ocorreu um erro ao adicionar a coordenação.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para editar coordenação
  const editCoordinationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { descricao: string; sigla?: string } }) => {
      const { data: updatedCoordination, error } = await supabase
        .from('coordenacoes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedCoordination;
    },
    onSuccess: (updatedCoordination) => {
      // Atualizar o cache de coordenações
      queryClient.setQueryData<Coordenacao[]>(
        ['coordinations'],
        (old) => old ? old.map(coord => 
          coord.id === updatedCoordination.id ? updatedCoordination : coord
        ) : []
      );

      toast({
        title: 'Coordenação atualizada',
        description: 'A coordenação foi atualizada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao editar coordenação:', error);
      toast({
        title: 'Erro ao editar coordenação',
        description: error.message || 'Ocorreu um erro ao editar a coordenação.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para excluir coordenação
  const deleteCoordinationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coordenacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      // Atualizar o cache de coordenações
      queryClient.setQueryData<Coordenacao[]>(
        ['coordinations'],
        (old) => old ? old.filter(coord => coord.id !== deletedId) : []
      );

      toast({
        title: 'Coordenação excluída',
        description: 'A coordenação foi excluída com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir coordenação:', error);
      toast({
        title: 'Erro ao excluir coordenação',
        description: error.message || 'Não foi possível excluir a coordenação. Verifique se não existem áreas associadas.',
        variant: 'destructive',
      });
    },
  });

  return {
    coordinations,
    isLoading,
    isError,
    error,
    refetch,
    addCoordination: addCoordinationMutation.mutate,
    updateCoordination: editCoordinationMutation.mutate,
    deleteCoordination: deleteCoordinationMutation.mutate,
    isAddingCoordination: addCoordinationMutation.isPending,
    isEditingCoordination: editCoordinationMutation.isPending,
    isDeletingCoordination: deleteCoordinationMutation.isPending,
    
    // Add these properties for backward compatibility
    loading: isLoading,
    isSubmitting: addCoordinationMutation.isPending || editCoordinationMutation.isPending,
  };
};
