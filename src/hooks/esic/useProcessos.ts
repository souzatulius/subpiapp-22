
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso } from '@/types/esic';

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
      const { data, error, count } = await supabase
        .from('esic_processos')
        .select(`
          *,
          autor:autor_id (nome_completo),
          coordenacao:coordenacao_id (nome)
        `, { count: 'exact' })
        .order('criado_em', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Cast the data to ESICProcesso[] type
        const processedData = data.map(item => ({
          ...item,
          created_at: item.criado_em, // Ensure created_at is present as it's required by ESICProcesso type
        })) as unknown as ESICProcesso[];
        
        setProcessos(processedData);
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

  const createProcesso = async (data: any) => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await supabase
        .from('esic_processos')
        .insert(data)
        .select();

      if (result.error) {
        throw result.error;
      }

      // Refresh process list
      fetchProcessos();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao criar processo',
        description: err.message,
        variant: 'destructive',
      });
      return { success: false, error: err };
    } finally {
      setIsCreating(false);
    }
  };

  const updateProcesso = async (id: string, updates: Partial<ESICProcesso>) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await supabase
        .from('esic_processos')
        .update(updates)
        .eq('id', id)
        .select();

      if (result.error) {
        throw result.error;
      }

      // Update local state
      if (result.data && result.data.length > 0) {
        const processedData = result.data.map(item => ({
          ...item,
          created_at: item.criado_em, // Ensure created_at is present
        })) as unknown as ESICProcesso[];
        
        setProcessos(prev => 
          prev.map(p => p.id === id ? { ...p, ...processedData[0] } : p)
        );
        
        // Update selected processo if it's the one being edited
        if (selectedProcesso && selectedProcesso.id === id) {
          setSelectedProcesso({ ...selectedProcesso, ...processedData[0] });
        }
      }
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao atualizar processo',
        description: err.message,
        variant: 'destructive',
      });
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProcesso = async (id: string) => {
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
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Erro ao excluir processo',
        description: err.message,
        variant: 'destructive',
      });
      return { success: false, error: err };
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
