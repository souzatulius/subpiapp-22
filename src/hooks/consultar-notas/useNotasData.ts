
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial, UseNotasDataReturn } from './types';
import { useNotasQuery } from './useNotasQuery';

export const useNotasData = (): UseNotasDataReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedNotaId, setSelectedNotaId] = useState<string | null>(null);

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
  const handleDeleteNota = async (id: string) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ status: 'excluida' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Nota excluída com sucesso",
        description: "A nota foi marcada como excluída."
      });

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
    handleDeleteNota,
    refetch,
    selectedNotaId,
    setSelectedNotaId
  };
};
