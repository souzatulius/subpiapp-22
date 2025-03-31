
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useNotasData = () => {
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState<any[]>([]);
  
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
      setNotas(notas.map(nota => {
        if (nota.id === notaId) {
          return { ...nota, status: newStatus };
        }
        return nota;
      }));
      
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
  
  return {
    loading,
    notas,
    fetchNotas,
    viewNotaDetails,
    deleteNota: handleDeleteNota, // Use the wrapper function
    updateNotaStatus: handleUpdateNotaStatus, // Use the wrapper function
  };
};
