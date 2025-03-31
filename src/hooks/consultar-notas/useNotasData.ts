
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UseNotasDataReturn } from '@/types/nota';

export const useNotasData = (): UseNotasDataReturn => {
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState<any[]>([]);
  const [filteredNotas, setFilteredNotas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined);
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Default to true for now
  
  const fetchNotas = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setNotas(data || []);
      setFilteredNotas(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching notas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notas oficiais',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (!notas.length) return;

    let filtered = [...notas];

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(nota => 
        nota.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nota.texto?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(nota => nota.status === statusFilter);
    }

    // Apply area filter
    if (areaFilter !== 'all') {
      filtered = filtered.filter(nota => nota.supervisao_tecnica_id === areaFilter);
    }

    // Apply date filters
    if (dataInicioFilter) {
      const startDate = new Date(dataInicioFilter);
      filtered = filtered.filter(nota => {
        const notaDate = new Date(nota.criado_em || nota.created_at);
        return notaDate >= startDate;
      });
    }

    if (dataFimFilter) {
      const endDate = new Date(dataFimFilter);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(nota => {
        const notaDate = new Date(nota.criado_em || nota.created_at);
        return notaDate <= endDate;
      });
    }

    setFilteredNotas(filtered);
  }, [notas, searchQuery, statusFilter, areaFilter, dataInicioFilter, dataFimFilter]);

  // Format date helper
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const viewNotaDetails = async (notaId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select('*')
        .eq('id', notaId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // You would typically set this data to a state or show it in a modal
      console.log('Nota details:', data);
      
    } catch (error: any) {
      console.error('Error fetching nota details:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da nota',
        variant: 'destructive',
      });
    }
  };
  
  // Wrapper function to make return type Promise<void>
  const handleDeleteNota = async (notaId: string): Promise<void> => {
    try {
      setDeleteLoading(true);
      const result = await deleteNota(notaId);
      if (!result) {
        throw new Error('Falha ao deletar nota');
      }
    } catch (error: any) {
      console.error('Error deleting nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a nota',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const deleteNota = async (notaId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('id', notaId);
        
      if (error) {
        throw error;
      }
      
      // Update the local state to remove the deleted nota
      setNotas(notas.filter(nota => nota.id !== notaId));
      setFilteredNotas(filteredNotas.filter(nota => nota.id !== notaId));
      
      toast({
        title: 'Sucesso',
        description: 'Nota oficial deletada com sucesso',
        variant: 'success',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting nota:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a nota oficial',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Wrapper function to make return type Promise<void>
  const handleUpdateNotaStatus = async (notaId: string, newStatus: string): Promise<void> => {
    try {
      setStatusLoading(true);
      const result = await updateNotaStatus(notaId, newStatus);
      if (!result) {
        throw new Error('Falha ao atualizar status da nota');
      }
    } catch (error: any) {
      console.error('Error updating nota status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da nota',
        variant: 'destructive',
      });
    } finally {
      setStatusLoading(false);
    }
  };
  
  const updateNotaStatus = async (notaId: string, newStatus: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({ status: newStatus })
        .eq('id', notaId);
        
      if (error) {
        throw error;
      }
      
      // Update the local state to reflect the status change
      const updatedNotas = notas.map(nota => {
        if (nota.id === notaId) {
          return { ...nota, status: newStatus };
        }
        return nota;
      });
      
      setNotas(updatedNotas);
      
      // Apply the same update to filtered notas
      const updatedFilteredNotas = filteredNotas.map(nota => {
        if (nota.id === notaId) {
          return { ...nota, status: newStatus };
        }
        return nota;
      });
      
      setFilteredNotas(updatedFilteredNotas);
      
      toast({
        title: 'Sucesso',
        description: 'Status da nota oficial atualizado com sucesso',
        variant: 'success',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating nota status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da nota oficial',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // On component mount, fetch notas
  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);
  
  return {
    loading,
    notas,
    fetchNotas,
    viewNotaDetails,
    deleteNota: handleDeleteNota,
    updateNotaStatus: handleUpdateNotaStatus,
    isLoading: loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formatDate,
    filteredNotas,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    deleteLoading,
    isAdmin,
    statusLoading
  };
};
