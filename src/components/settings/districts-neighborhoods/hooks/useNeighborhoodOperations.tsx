
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface UseNeighborhoodOperationsProps {
  fetchNeighborhoods: () => Promise<void>;
  setIsSubmitting: (value: boolean) => void;
}

export const useNeighborhoodOperations = ({
  fetchNeighborhoods,
  setIsSubmitting,
}: UseNeighborhoodOperationsProps) => {
  const [isEditNeighborhoodOpen, setIsEditNeighborhoodOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<any>(null);
  const { user } = useAuth();

  const handleAddNeighborhood = async (data: any) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar autenticado para adicionar um bairro',
        variant: 'destructive',
      });
      return Promise.reject(new Error('Não autenticado'));
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .insert({
          nome: data.nome,
          distrito_id: data.distrito_id,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Bairro adicionado',
        description: 'O bairro foi adicionado com sucesso',
      });
      
      await fetchNeighborhoods();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o bairro',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditNeighborhood = async (data: any) => {
    if (!editingNeighborhood || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .update({
          nome: data.nome,
          distrito_id: data.distrito_id,
        })
        .eq('id', editingNeighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro atualizado',
        description: 'O bairro foi atualizado com sucesso',
      });
      
      setIsEditNeighborhoodOpen(false);
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao editar bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o bairro',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteNeighborhood = async (neighborhood: any) => {
    if (!user) return;

    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('bairro_id', neighborhood.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este bairro',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('bairros')
        .delete()
        .eq('id', neighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro excluído',
        description: 'O bairro foi excluído com sucesso',
      });
      
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao excluir bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o bairro',
        variant: 'destructive',
      });
    }
  };

  return {
    isEditNeighborhoodOpen,
    setIsEditNeighborhoodOpen,
    editingNeighborhood,
    setEditingNeighborhood,
    handleAddNeighborhood,
    handleEditNeighborhood,
    handleDeleteNeighborhood,
  };
};
