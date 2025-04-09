
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import { v4 as uuidv4 } from 'uuid';

interface FilterOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  coordenacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const useProcessos = () => {
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [selectedProcesso, setSelectedProcesso] = useState<ESICProcesso | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    status: '',
    coordenacao: '',
    dataInicio: '',
    dataFim: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProcessos = async (options: FilterOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build the query with filters
      let query = supabase
        .from('esic_processos')
        .select(`
          *,
          autor:autor_id (nome_completo),
          coordenacao:coordenacao_id (nome)
        `, { count: 'exact' });
      
      // Apply filters if they exist
      const mergedOptions = { ...filterOptions, ...options };
      
      if (mergedOptions.searchTerm) {
        query = query.or(`assunto.ilike.%${mergedOptions.searchTerm}%,protocolo.ilike.%${mergedOptions.searchTerm}%,solicitante.ilike.%${mergedOptions.searchTerm}%,texto.ilike.%${mergedOptions.searchTerm}%`);
      }
      
      if (mergedOptions.status) {
        query = query.eq('status', mergedOptions.status);
      }
      
      if (mergedOptions.coordenacao) {
        query = query.eq('coordenacao_id', mergedOptions.coordenacao);
      }
      
      if (mergedOptions.dataInicio) {
        query = query.gte('data_processo', mergedOptions.dataInicio);
      }
      
      if (mergedOptions.dataFim) {
        query = query.lte('data_processo', mergedOptions.dataFim);
      }
      
      // Apply pagination
      if (mergedOptions.page && mergedOptions.pageSize) {
        const from = (mergedOptions.page - 1) * mergedOptions.pageSize;
        const to = from + mergedOptions.pageSize - 1;
        query = query.range(from, to);
      }
      
      // Apply ordering
      query = query.order('criado_em', { ascending: false });
      
      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Type assertion to handle the conversion properly
        setProcessos(data as unknown as ESICProcesso[]);
        setTotal(count || 0);
      } else {
        setProcessos([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao buscar processos',
        description: 'Ocorreu um erro ao carregar os processos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProcesso = async (formValues: ESICProcessoFormValues, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
    setIsCreating(true);
    setError(null);

    try {
      // Generate a unique protocol number
      const protocolo = `ESIC-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Get user information from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Prepare data for Supabase
      const processoData = {
        protocolo,
        assunto: formValues.assunto,
        solicitante: formValues.solicitante,
        data_processo: formValues.data_processo instanceof Date 
          ? formValues.data_processo.toISOString().split('T')[0] 
          : formValues.data_processo,
        autor_id: user.id,
        texto: formValues.texto,
        situacao: formValues.situacao,
        status: 'novo_processo',
        coordenacao_id: formValues.coordenacao_id === 'none' ? null : formValues.coordenacao_id,
        prazo_resposta: formValues.prazo_resposta instanceof Date 
          ? formValues.prazo_resposta.toISOString().split('T')[0]
          : formValues.prazo_resposta,
      };

      // Insert into Supabase
      const result = await supabase
        .from('esic_processos')
        .insert(processoData)
        .select();

      if (result.error) {
        console.error('Erro ao criar processo:', result.error);
        throw result.error;
      }

      // Refresh process list
      fetchProcessos();
      options?.onSuccess?.();
      
      toast({
        title: 'Processo criado com sucesso',
        description: `O processo ${protocolo} foi criado com sucesso.`,
      });
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao criar processo',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateProcesso = async (
    params: { id: string; data: any }, 
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await supabase
        .from('esic_processos')
        .update(params.data)
        .eq('id', params.id)
        .select();

      if (result.error) {
        throw result.error;
      }

      // Update local state
      if (result.data && result.data.length > 0) {
        setProcessos(prev => 
          prev.map(p => p.id === params.id ? { ...p, ...params.data } : p)
        );
        
        // Update selected processo if it's the one being edited
        if (selectedProcesso && selectedProcesso.id === params.id) {
          setSelectedProcesso({ ...selectedProcesso, ...params.data });
        }
      }
      
      options?.onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao atualizar processo',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProcesso = async (
    id: string,
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    setIsDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setProcessos(prev => prev.filter(p => p.id !== id));
      
      // Clear selected process if it's the one being deleted
      if (selectedProcesso && selectedProcesso.id === id) {
        setSelectedProcesso(null);
      }
      
      options?.onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
      toast({
        title: 'Erro ao excluir processo',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    processos,
    isLoading: loading,
    error,
    total,
    filterOptions,
    setFilterOptions,
    fetchProcessos,
    selectedProcesso,
    setSelectedProcesso,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting
  };
};
