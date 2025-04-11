
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Demand } from './types';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const useDemandasActions = (refetch: () => Promise<any>) => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showFeedback } = useAnimatedFeedback();

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
      
      // First check if the demand has linked notes
      const { data: linkedNotes, error: notesError } = await supabase
        .from('notas_oficiais')
        .select('id')
        .eq('demanda_id', selectedDemand.id);

      if (notesError) throw notesError;
      
      // Delete all linked notes first
      if (linkedNotes && linkedNotes.length > 0) {
        console.log(`Excluindo ${linkedNotes.length} notas vinculadas à demanda ${selectedDemand.id}`);
        
        const { error: deleteNotesError } = await supabase
          .from('notas_oficiais')
          .delete()
          .eq('demanda_id', selectedDemand.id);

        if (deleteNotesError) throw deleteNotesError;
      }

      // Now delete the demand
      const { error: deleteDemandError } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);

      if (deleteDemandError) throw deleteDemandError;

      toast({
        title: "Demanda excluída com sucesso",
        description: "A demanda e todas as notas associadas foram permanentemente removidas."
      });
      
      showFeedback('success', 'Demanda excluída com sucesso!');

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
      
      showFeedback('error', 'Falha ao excluir demanda');
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
