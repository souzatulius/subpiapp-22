
import { useState, useEffect } from 'react';
import { NotaOficial } from '@/types/nota';
import { useNotasQuery } from './useNotasQuery';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseNotasDataReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: [Date | null, Date | null];
  setDateRange: (range: [Date | null, Date | null]) => void;
  notas: NotaOficial[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  handleDeleteNota: (notaId: string) => Promise<void>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  selectedNotaId: string | null;
  setSelectedNotaId: (id: string | null) => void;
  filteredNotas: NotaOficial[];
}

export const useNotasData = (): UseNotasDataReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [filteredNotas, setFilteredNotas] = useState<NotaOficial[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNotaId, setSelectedNotaId] = useState<string | null>(null);
  
  // Use the query hook
  const { data: notas = [], isLoading, error, refetch } = useNotasQuery();
  
  // Filter notas based on search term, status, and date range
  useEffect(() => {
    if (!notas) {
      setFilteredNotas([]);
      return;
    }
    
    let filtered = [...notas];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(nota => 
        nota.titulo.toLowerCase().includes(term) || 
        nota.conteudo.toLowerCase().includes(term) ||
        nota.problema?.descricao.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'todos') {
      filtered = filtered.filter(nota => nota.status === statusFilter);
    }
    
    // Apply date range filter
    const [startDate, endDate] = dateRange;
    if (startDate) {
      filtered = filtered.filter(nota => {
        const notaDate = new Date(nota.criado_em);
        return notaDate >= startDate;
      });
    }
    
    if (endDate) {
      filtered = filtered.filter(nota => {
        const notaDate = new Date(nota.criado_em);
        return notaDate <= endDate;
      });
    }
    
    setFilteredNotas(filtered);
  }, [notas, searchTerm, statusFilter, dateRange]);
  
  // Handle deletion of a nota
  const handleDeleteNota = async (notaId: string) => {
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', notaId);
        
      if (error) throw error;
      
      toast({
        title: "Nota excluída com sucesso",
        description: "A nota oficial foi removida do sistema."
      });
      
      // Refresh the data
      refetch();
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setSelectedNotaId(null);
    } catch (error: any) {
      console.error('Error deleting nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: error.message || "Ocorreu um erro ao excluir a nota.",
        variant: "destructive"
      });
    }
  };
  
  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    notas,
    isLoading,
    error,
    refetch,
    handleDeleteNota,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedNotaId,
    setSelectedNotaId,
    filteredNotas
  };
};
