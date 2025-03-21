
import { useNotasQuery } from './useNotasQuery';
import { useNotasActions } from './useNotasActions';
import { UseNotasDataReturn } from './types';

export const useNotasData = (): UseNotasDataReturn => {
  const {
    notas,
    filteredNotas,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    formatDate,
    refetch,
    isAdmin
  } = useNotasQuery();

  const {
    deleteNota,
    deleteLoading
  } = useNotasActions(refetch);

  return {
    notas,
    filteredNotas,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    formatDate,
    refetch,
    deleteNota,
    deleteLoading,
    isAdmin
  };
};
