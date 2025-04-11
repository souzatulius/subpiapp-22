
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial, UseNotasDataReturn } from '@/types/nota';
import { useNotasQuery } from './useNotasQuery';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const useNotasData = (): UseNotasDataReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedNotaId, setSelectedNotaId] = useState<string | null>(null);
  const { showFeedback } = useAnimatedFeedback();

  // Use the query hook to fetch notas
  const { data: notas, isLoading: loading, error, refetch } = useNotasQuery();

  // Filter notas based on search term and status
  useEffect(() => {
    if (!notas) {
      setFilteredNotas([]);
      return;
    }

    let filtered = [...notas];

    // Apply status filter if not 'todos'
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(nota => nota.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(nota => {
        const matchesTitle = nota.titulo.toLowerCase().includes(lowerSearchTerm);
        const matchesContent = nota.conteudo.toLowerCase().includes(lowerSearchTerm);
        const matchesStatus = nota.status.toLowerCase().includes(lowerSearchTerm);
        const matchesArea = nota.area_coordenacao?.descricao.toLowerCase().includes(lowerSearchTerm);
        
        return matchesTitle || matchesContent || matchesStatus || matchesArea;
      });
    }

    setFilteredNotas(filtered);
  }, [notas, searchTerm, statusFilter]);

  // Handle delete nota
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      
      // Get note details to check if it's linked to a demand
      const { data: nota, error: fetchError } = await supabase
        .from('notas_oficiais')
        .select('demanda_id, titulo')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // If note is linked to a demand, update demand status
      if (nota && nota.demanda_id) {
        const { error: updateDemandError } = await supabase
          .from('demandas')
          .update({ status: 'aguardando_nota' })
          .eq('id', nota.demanda_id);
          
        if (updateDemandError) throw updateDemandError;
      }
      
      // Now actually delete the note (not just update status)
      const { error: deleteError } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: "Nota excluída com sucesso",
        description: "A nota foi permanentemente removida do sistema."
      });
      
      showFeedback('success', 'Nota excluída com sucesso!');

      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedNotaId(null);
    } catch (error: any) {
      console.error('Error deleting nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: error.message || "Ocorreu um erro ao excluir a nota.",
        variant: "destructive"
      });
      
      showFeedback('error', 'Falha ao excluir a nota');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    notas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredNotas,
    selectedNota,
    setSelectedNota,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    handleDelete,
    refetch,
    selectedNotaId,
    setSelectedNotaId
  };
};
