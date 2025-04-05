
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';

export const useDemandasActions = (refetch: () => Promise<any>) => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSelectDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;

    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);

      if (error) throw error;

      toast({
        title: "Demanda excluída com sucesso",
        description: "A demanda foi permanentemente removida."
      });

      setIsDeleteDialogOpen(false);
      setSelectedDemand(null);
      await refetch();
    } catch (error: any) {
      console.error('Error deleting demand:', error);
      toast({
        title: "Erro ao excluir demanda",
        description: error.message || "Ocorreu um erro ao excluir a demanda.",
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
    handleSelectDemand,
    handleCloseDetail,
    handleDeleteConfirm
  };
};
