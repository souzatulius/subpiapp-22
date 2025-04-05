
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial, UseNotasDataReturn } from '@/types/nota';
import { useNotasQuery } from './useNotasQuery';

export const useNotasData = (): UseNotasDataReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Additional props for compatibility
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dataInicioFilter, setDataInicioFilter] = useState<string>('');
  const [dataFimFilter, setDataFimFilter] = useState<string>('');
  
  const { 
    notas = [], 
    isLoading: loading, 
    error,
    refetch: refreshData 
  } = useNotasQuery();
  
  // Filter notas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotas(notas);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = notas.filter(nota => {
      const matchTitle = nota.titulo.toLowerCase().includes(lowerSearchTerm);
      const matchContent = nota.conteudo?.toLowerCase().includes(lowerSearchTerm) || 
                          nota.texto?.toLowerCase().includes(lowerSearchTerm);
      const matchProblem = nota.problema?.descricao.toLowerCase().includes(lowerSearchTerm);
      
      return matchTitle || matchContent || matchProblem;
    });
    
    setFilteredNotas(filtered);
  }, [searchTerm, notas]);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      
      // Instead of deleting, we'll update status to 'excluida'
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ status: 'excluida' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Nota excluída",
        description: "A nota foi excluída com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedNota(null);
      
      // Refresh data
      await refreshData();
      
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: error.message || "Ocorreu um erro ao excluir a nota.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add simple date formatter utility
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    
    try {
      const formattedDate = new Date(date).toLocaleDateString('pt-BR');
      return formattedDate;
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Fetch notas function for direct use
  const fetchNotas = async () => {
    try {
      await refreshData();
    } catch (error: any) {
      console.error('Error fetching notas:', error);
      toast({
        title: "Erro ao carregar notas",
        description: "Não foi possível atualizar as notas.",
        variant: "destructive"
      });
    }
  };

  // Simple update status function
  const updateNotaStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      await refreshData();
      return true;
    } catch (error: any) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  return {
    notas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredNotas,
    selectedNota,
    setSelectedNota,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    handleDelete,
    refetch: refreshData,
    
    // Extended properties for NotasContent
    isLoading: loading,
    formatDate,
    fetchNotas,
    
    // Default values for other expected properties
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    deleteNota: handleDelete,
    isAdmin: false,
    updateNotaStatus,
    statusLoading: false
  };
};
