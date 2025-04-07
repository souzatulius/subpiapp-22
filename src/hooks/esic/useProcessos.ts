
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import { useAuthState } from '@/hooks/auth/useAuthState';

export const useProcessos = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthState();
  const [selectedProcesso, setSelectedProcesso] = useState<ESICProcesso | null>(null);

  // Fetch all processes
  const { data: processos, isLoading, error, refetch } = useQuery({
    queryKey: ['esic-processos'],
    queryFn: async () => {
      console.log('Fetching esic processes...');
      const { data, error } = await supabase
        .from('esic_processos')
        .select(`
          *,
          autor:usuarios(nome_completo)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching processos:', error);
        toast({
          title: 'Erro ao carregar processos',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Fetched esic processes:', data);
      
      // Transform the data to match the ESICProcesso interface
      // This will handle potential errors with the join
      const processedData = data.map((item: any) => {
        return {
          id: item.id,
          data_processo: item.data_processo,
          situacao: item.situacao,
          status: item.status,
          texto: item.texto,
          autor_id: item.autor_id,
          criado_em: item.criado_em,
          atualizado_em: item.atualizado_em,
          autor: item.autor?.error ? { nome_completo: 'Usuário' } : item.autor
        };
      });

      return processedData as ESICProcesso[];
    },
  });

  // Create new process
  const createProcessoMutation = useMutation({
    mutationFn: async (values: ESICProcessoFormValues) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('esic_processos')
        .insert({
          data_processo: values.data_processo.toISOString(),
          situacao: values.situacao,
          status: 'novo_processo',
          texto: values.texto,
          autor_id: user.id,
        })
        .select();

      if (error) {
        toast({
          title: 'Erro ao criar processo',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Processo criado com sucesso',
        variant: 'default',
      });

      return data[0] as ESICProcesso;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esic-processos'] });
    },
  });

  // Update process
  const updateProcessoMutation = useMutation({
    mutationFn: async (values: { id: string; data: Partial<ESICProcesso> }) => {
      const { data, error } = await supabase
        .from('esic_processos')
        .update(values.data)
        .eq('id', values.id)
        .select();

      if (error) {
        toast({
          title: 'Erro ao atualizar processo',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Processo atualizado com sucesso',
        variant: 'default',
      });

      return data[0] as ESICProcesso;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esic-processos'] });
    },
  });

  // Delete process
  const deleteProcessoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Erro ao excluir processo',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Processo excluído com sucesso',
        variant: 'default',
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esic-processos'] });
      setSelectedProcesso(null);
    },
  });

  return {
    processos,
    isLoading,
    error,
    refetch,
    selectedProcesso,
    setSelectedProcesso,
    createProcesso: createProcessoMutation.mutate,
    updateProcesso: updateProcessoMutation.mutate,
    deleteProcesso: deleteProcessoMutation.mutate,
    isCreating: createProcessoMutation.isPending,
    isUpdating: updateProcessoMutation.isPending,
    isDeleting: deleteProcessoMutation.isPending,
  };
};
