
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
  
  const { deleteNota, deleteLoading, updateNotaStatus, statusLoading } = useNotasActions(refetch);

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
    updateNotaStatus,
    statusLoading
  };
};
