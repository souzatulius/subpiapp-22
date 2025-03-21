
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';

export const useDemandasActions = (refetch: () => Promise<any>) => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;
    
    setDeleteLoading(true);
    console.log('Iniciando exclusão da demanda:', selectedDemand.id);
    
    try {
      // 1. First delete all responses related to the demand
      const { error: responsesError } = await supabase
        .from('respostas_demandas')
        .delete()
        .eq('demanda_id', selectedDemand.id);
        
      if (responsesError) {
        console.error('Erro ao excluir respostas da demanda:', responsesError);
        throw responsesError;
      }
      
      // 2. Delete any notes related to the demand
      const { error: notasError } = await supabase
        .from('notas_oficiais')
        .delete()
        .eq('demanda_id', selectedDemand.id);
        
      if (notasError) {
        console.error('Erro ao excluir notas da demanda:', notasError);
        throw notasError;
      }
      
      // 3. Now we can safely delete the demand itself
      const { error: demandaError } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (demandaError) {
        console.error('Erro ao excluir demanda:', demandaError);
        throw demandaError;
      }
      
      toast({
        title: "Demanda excluída",
        description: "A demanda e todos os dados associados foram excluídos com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Erro completo na exclusão:', error);
      toast({
        title: "Erro ao excluir demanda",
        description: error.message || "Ocorreu um erro desconhecido ao excluir a demanda.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    selectedDemand,
    setSelectedDemand,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    handleDeleteConfirm
  };
};
