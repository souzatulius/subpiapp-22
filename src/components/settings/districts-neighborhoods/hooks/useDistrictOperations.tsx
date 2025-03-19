
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface UseDistrictOperationsProps {
  fetchDistricts: () => Promise<void>;
  fetchNeighborhoods: () => Promise<void>;
  setIsSubmitting: (value: boolean) => void;
}

export const useDistrictOperations = ({
  fetchDistricts,
  fetchNeighborhoods,
  setIsSubmitting,
}: UseDistrictOperationsProps) => {
  const [isEditDistrictOpen, setIsEditDistrictOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  const { user } = useAuth();

  const handleAddDistrict = async (data: any) => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar autenticado para adicionar um distrito',
        variant: 'destructive',
      });
      return Promise.reject(new Error('Não autenticado'));
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .insert({
          nome: data.nome,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Distrito adicionado',
        description: 'O distrito foi adicionado com sucesso',
      });
      
      await fetchDistricts();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o distrito',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditDistrict = async (data: any) => {
    if (!editingDistrict || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .update({
          nome: data.nome,
        })
        .eq('id', editingDistrict.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito atualizado',
        description: 'O distrito foi atualizado com sucesso',
      });
      
      setIsEditDistrictOpen(false);
      await fetchDistricts();
      await fetchNeighborhoods(); // Refresh to update district names in neighborhoods
    } catch (error: any) {
      console.error('Erro ao editar distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o distrito',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDistrict = async (district: any) => {
    if (!user) return;

    try {
      // Check if there are dependent neighborhoods
      const { count, error: countError } = await supabase
        .from('bairros')
        .select('*', { count: 'exact', head: true })
        .eq('distrito_id', district.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem bairros associados a este distrito',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('distritos')
        .delete()
        .eq('id', district.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito excluído',
        description: 'O distrito foi excluído com sucesso',
      });
      
      await fetchDistricts();
    } catch (error: any) {
      console.error('Erro ao excluir distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o distrito',
        variant: 'destructive',
      });
    }
  };

  return {
    isEditDistrictOpen,
    setIsEditDistrictOpen,
    editingDistrict,
    setEditingDistrict,
    handleAddDistrict,
    handleEditDistrict,
    handleDeleteDistrict,
  };
};
