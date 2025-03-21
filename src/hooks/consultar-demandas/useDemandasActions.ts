
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
    console.log('Excluindo demanda principal:', selectedDemand.id);
    
    try {
      // A exclusão dos dados relacionados já foi feita no DeleteDemandDialog
      // Agora podemos excluir com segurança a demanda principal
      const { error: deleteDemandError } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (deleteDemandError) {
        console.error('Erro ao excluir demanda principal:', deleteDemandError);
        throw deleteDemandError;
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
