
import { useState } from 'react';
import { ESICProcesso, ESICProcessoFormValues } from '@/types/esic';
import { useFetchProcessos } from './useFetchProcessos';
import { useProcessoMutations } from './useProcessoMutations';
import { useProcessoState } from './useProcessoState';

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
  const { fetchProcessos: fetchProcessosList, error: fetchError, loading: fetchLoading } = useFetchProcessos();
  const { processos, setProcessos, total, setTotal, selectedProcesso, setSelectedProcesso, filterOptions, setFilterOptions } = useProcessoState();
  const { createProcesso, updateProcesso, deleteProcesso, isCreating, isUpdating, isDeleting, error: mutationError } = useProcessoMutations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcessos = async (options: FilterOptions = {}): Promise<void> => {
    console.log('Fetching processos with options:', options);
    setLoading(true);
    setError(null);

    try {
      const processedData = await fetchProcessosList(options);
      setProcessos(processedData);
      // Total will be updated by useFetchProcessos
    } catch (err: any) {
      console.error('Error in fetchProcessos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Expose combined error state
  const combinedError = error || fetchError || mutationError;

  return {
    processos,
    isLoading: loading || fetchLoading,
    error: combinedError,
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
