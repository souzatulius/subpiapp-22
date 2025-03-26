
import { useState } from 'react';
import { UseNotasDataReturn, NotaOficial } from '@/types/nota';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNotasQuery } from './useNotasQuery';

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
  
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteNota = async (notaId: string): Promise<void> => {
    try {
      setDeleteLoading(true);
      
      // Check if the nota is linked to a demand
      const { data: nota } = await supabase
        .from('notas_oficiais')
        .select('demanda_id')
        .eq('id', notaId)
        .single();
      
      // If linked to a demand, update the demand status back to pending
      if (nota?.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'pendente' })
          .eq('id', nota.demanda_id);
        
        if (demandaError) throw demandaError;
      }
      
      // Delete the nota
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', notaId);
      
      if (error) throw error;
      
      toast({
        title: "Nota excluída",
        description: "A nota oficial foi excluída com sucesso."
      });
      
      await refetch();
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: error.message || "Ocorreu um erro ao excluir a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
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
    isAdmin
  };
};
