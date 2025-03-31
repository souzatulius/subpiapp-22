
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
  
  // We need to modify the useNotasActions hook to match the expected type signatures
  const { deleteNota, deleteLoading, updateNotaStatus, statusLoading } = useNotasActions(refetch);
  
  // Create a wrapper function for updateNotaStatus that returns Promise<void> instead of Promise<boolean>
  const updateNotaStatusWrapper = async (id: string, newStatus: string): Promise<void> => {
    await updateNotaStatus(id, newStatus);
    // This discards the boolean return value to match the expected Promise<void> return type
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
    deleteNota,
    deleteLoading,
    isAdmin,
    updateNotaStatus: updateNotaStatusWrapper, // Use the wrapper function
    statusLoading
  };
};
