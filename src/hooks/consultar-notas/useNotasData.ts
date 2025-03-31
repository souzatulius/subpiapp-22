
import { useState } from 'react';
import { UseNotasDataReturn, NotaOficial } from '@/types/nota';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotasQuery } from './useNotasQuery';
import { useNotasActions } from './useNotasActions';

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
  
  // Get the actions from useNotasActions
  const { deleteNota, deleteLoading, updateNotaStatus, statusLoading } = useNotasActions(refetch);
  
  // Create a wrapper function for updateNotaStatus to match the expected type signature (Promise<void>)
  const handleUpdateNotaStatus = async (id: string, newStatus: string): Promise<void> => {
    await updateNotaStatus(id, newStatus);
    // This function returns void, which matches the expected return type
  };

  // Create a wrapper function for deleteNota to match the expected type signature (Promise<void>)
  const handleDeleteNota = async (id: string): Promise<void> => {
    await deleteNota(id);
    // This function returns void, which matches the expected return type
  };

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
    deleteNota: handleDeleteNota,
    deleteLoading,
    isAdmin,
    updateNotaStatus: handleUpdateNotaStatus,
    statusLoading
  };
};
