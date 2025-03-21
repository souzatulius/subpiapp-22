
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
    console.log('Iniciando ocultação da demanda:', selectedDemand.id);
    
    try {
      // Update the demanda status to 'oculta' instead of deleting it
      const { error: demandaError } = await supabase
        .from('demandas')
        .update({ status: 'oculta' })
        .eq('id', selectedDemand.id);
        
      if (demandaError) {
        console.error('Erro ao ocultar demanda:', demandaError);
        throw demandaError;
      }
      
      toast({
        title: "Demanda ocultada",
        description: "A demanda foi ocultada com sucesso e não aparecerá mais nas listagens."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Erro completo na ocultação:', error);
      toast({
        title: "Erro ao ocultar demanda",
        description: error.message || "Ocorreu um erro desconhecido ao ocultar a demanda.",
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
