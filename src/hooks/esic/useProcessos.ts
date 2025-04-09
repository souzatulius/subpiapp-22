
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

  const fetchProcessos = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Buscando processos e-SIC...');
      
      const { data, error } = await supabase
        .from('esic_processos')
        .select(`
          *,
          autor:usuarios(nome_completo)
        `)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      console.log(`Processos encontrados: ${data?.length || 0}`);
      
      const typedData = (data || []).map(item => {
        // Handle possible error in autor field by providing a default
        let autorNome = 'Usuário';
        if (item.autor && typeof item.autor === 'object' && 'nome_completo' in item.autor) {
          autorNome = item.autor.nome_completo;
        }
        
        return {
          ...item,
          protocolo: item.protocolo || `ESIC-${item.id.slice(0, 8)}`,
          assunto: item.assunto || `Processo e-SIC #${item.id.slice(0, 8)}`,
          created_at: item.criado_em,
          situacao: item.situacao as ESICProcesso['situacao'],
          status: item.status as ESICProcesso['status'],
          autor: { nome_completo: autorNome }
        };
      }) as ESICProcesso[];
      
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

  useEffect(() => {
    fetchProcessos();
  }, [fetchProcessos]);

  const createProcesso = async (values: ESICProcessoFormValues, options?: UseProcessosOptions) => {
    if (!user) return;
    
    try {
      setIsCreating(true);
      
      const novoProcesso = {
        data_processo: values.data_processo.toISOString(),
        texto: values.texto,
        situacao: values.situacao,
        status: 'novo_processo' as ESICProcesso['status'],
        autor_id: user.id,
        assunto: values.assunto,
        solicitante: values.solicitante,
        coordenacao_id: values.coordenacao_id,
        prazo_resposta: values.prazo_resposta ? new Date(values.prazo_resposta).toISOString() : null,
        protocolo: `ESIC-${Date.now().toString(36)}`
      };
      
      const { data, error } = await supabase
        .from('esic_processos')
        .insert(novoProcesso)
        .select()
        .single();
      
      if (error) throw error;
      
      const typedData = {
        ...data,
        created_at: data.criado_em,
        situacao: data.situacao as ESICProcesso['situacao'],
        status: data.status as ESICProcesso['status'],
        autor: { nome_completo: user?.user_metadata?.name || 'Usuário' }
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

  const updateProcesso = async (params: UpdateProcessoParams, options?: UseProcessosOptions) => {
    try {
      setIsUpdating(true);
      
      const { data, error } = await supabase
        .from('esic_processos')
        .update(params.data)
        .eq('id', params.id)
        .select(`
          *,
          autor:usuarios(nome_completo)
        `)
        .single();
      
      if (error) throw error;
      
      // Handle possible error in autor field by providing a default
      let autorNome = 'Usuário';
      if (data.autor && typeof data.autor === 'object' && 'nome_completo' in data.autor) {
        autorNome = data.autor.nome_completo;
      }
      
      const typedData = {
        ...data,
        created_at: data.criado_em,
        situacao: data.situacao as ESICProcesso['situacao'],
        status: data.status as ESICProcesso['status'],
        autor: { nome_completo: autorNome }
      } as ESICProcesso;
      
      setProcessos(prev => prev.map(p => p.id === params.id ? typedData : p));
      
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

  const deleteProcesso = async (id: string, options?: UseProcessosOptions) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProcessos(prev => prev.filter(p => p.id !== id));
      
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
