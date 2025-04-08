
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/components/ui/use-toast';

type UpdateProcessoParams = {
  id: string;
  data: Partial<ESICProcesso>;
};

type UseProcessosOptions = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useProcessos = () => {
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [selectedProcesso, setSelectedProcesso] = useState<ESICProcesso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Função para buscar todos os processos
  const fetchProcessos = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Buscando processos e-SIC...');
      
      // Remova qualquer filtro de usuário para ver todos os processos
      const { data, error } = await supabase
        .from('esic_processos')
        .select('*')
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      console.log(`Processos encontrados: ${data.length}`);
      
      // Cast the data to the expected type, ensuring we convert both situacao and status to the expected union types
      const typedData = data.map(item => ({
        ...item,
        situacao: item.situacao as ESICProcesso['situacao'], // Type assertion for situacao
        status: item.status as ESICProcesso['status'] // Type assertion for status
      })) as ESICProcesso[];
      
      setProcessos(typedData);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: 'Erro ao carregar processos',
        description: 'Não foi possível buscar os processos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carregar processos ao montar o componente
  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  // Criar novo processo
  const createProcesso = async (values: ESICProcessoFormValues, options?: UseProcessosOptions) => {
    if (!user) return;
    
    try {
      setIsCreating(true);
      
      const novoProcesso = {
        data_processo: values.data_processo.toISOString(),
        texto: values.texto,
        situacao: values.situacao,
        status: 'novo_processo' as ESICProcesso['status'],
        autor_id: user.id // Use autor_id instead of usuario_id
      };
      
      const { data, error } = await supabase
        .from('esic_processos')
        .insert(novoProcesso)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar a lista de processos
      const typedData = {
        ...data,
        situacao: data.situacao as ESICProcesso['situacao'], // Type assertion for situacao
        status: data.status as ESICProcesso['status'] // Type assertion for status
      } as ESICProcesso;
      
      setProcessos(prev => [typedData, ...prev]);
      options?.onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      toast({
        title: 'Erro ao criar processo',
        description: 'Não foi possível criar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      options?.onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar processo existente
  const updateProcesso = async (params: UpdateProcessoParams, options?: UseProcessosOptions) => {
    try {
      setIsUpdating(true);
      
      const { data, error } = await supabase
        .from('esic_processos')
        .update(params.data)
        .eq('id', params.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar a lista de processos
      const typedData = {
        ...data,
        situacao: data.situacao as ESICProcesso['situacao'], // Type assertion for situacao
        status: data.status as ESICProcesso['status'] // Type assertion for status
      } as ESICProcesso;
      
      setProcessos(prev => prev.map(p => p.id === params.id ? typedData : p));
      
      // Atualizar o processo selecionado, se for o mesmo
      if (selectedProcesso && selectedProcesso.id === params.id) {
        setSelectedProcesso(typedData);
      }
      
      options?.onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      toast({
        title: 'Erro ao atualizar processo',
        description: 'Não foi possível atualizar o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      options?.onError?.(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Excluir processo
  const deleteProcesso = async (id: string, options?: UseProcessosOptions) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar a lista de processos
      setProcessos(prev => prev.filter(p => p.id !== id));
      
      // Limpar o processo selecionado, se for o mesmo
      if (selectedProcesso && selectedProcesso.id === id) {
        setSelectedProcesso(null);
      }
      
      options?.onSuccess?.();
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
      toast({
        title: 'Erro ao excluir processo',
        description: 'Não foi possível excluir o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      options?.onError?.(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    processos,
    isLoading,
    selectedProcesso,
    setSelectedProcesso,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting,
    refreshProcessos: fetchProcessos
  };
};
