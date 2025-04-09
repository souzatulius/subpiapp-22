
import { useState } from 'react';
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues } from '@/types/esic';
import { useToast } from '@/components/ui/use-toast';
import { useProcessos } from './useProcessos';
import { useJustificativas } from './useJustificativas';
import { useProcessoDialog } from './useProcessoDialog';
import { useScreenManagement } from './useScreenManagement';
import { useProcessoOperations } from './useProcessoOperations';
import { ESICStateReturn } from './types';

export const useESICPageState = (): ESICStateReturn => {
  const { toast } = useToast();
  
  // Use the extracted hooks
  const { 
    deleteConfirmOpen, 
    processoToDelete, 
    openDeleteDialog, 
    resetDeleteDialogState 
  } = useProcessoDialog();
  
  const { 
    processos, 
    isLoading, 
    error,
    selectedProcesso: processosSelectedProcesso, 
    setSelectedProcesso: processosSetSelectedProcesso,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting,
    fetchProcessos
  } = useProcessos();
  
  const {
    screen,
    setScreen,
    selectedProcesso,
    setSelectedProcesso,
    handleViewProcesso,
    handleEditProcesso,
    handleAddJustificativa
  } = useScreenManagement();

  // Sync the selected processo from useProcessos with the one in useScreenManagement
  if (processosSelectedProcesso !== selectedProcesso) {
    processosSetSelectedProcesso(selectedProcesso);
  }
  
  const {
    justificativas,
    isLoading: isJustificativasLoading,
    createJustificativa,
    generateJustificativa,
    isCreating: isJustificativaCreating,
    isGenerating,
  } = useJustificativas(selectedProcesso?.id);

  // Get processo operations
  const { handleUpdateStatus, handleUpdateSituacao, handleUpdateProcesso } = useProcessoOperations(
    updateProcesso,
    setSelectedProcesso
  );
  
  const handleCreateProcesso = async (values: ESICProcessoFormValues): Promise<void> => {
    return new Promise((resolve, reject) => {
      createProcesso(values, {
        onSuccess: () => {
          setScreen('list');
          fetchProcessos(); // Refresh the list after creation
          toast({
            title: 'Processo criado com sucesso',
            description: 'O novo processo foi adicionado ao sistema.',
          });
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };
  
  const processUpdateHandler = async (values: ESICProcessoFormValues): Promise<void> => {
    if (!selectedProcesso) return Promise.reject(new Error('Nenhum processo selecionado'));
    return handleUpdateProcesso(selectedProcesso.id, values)
      .then(() => {
        setScreen('view');
      });
  };
  
  const handleDeleteProcesso = (id: string) => {
    openDeleteDialog(id);
  };
  
  const confirmDeleteProcesso = () => {
    if (!processoToDelete) return;
    
    deleteProcesso(processoToDelete, {
      onSuccess: () => {
        resetDeleteDialogState();
        toast({
          title: 'Processo excluído com sucesso',
          description: 'O processo foi removido do sistema.',
        });
      },
    });
  };
  
  const processAddJustificativaHandler = () => {
    if (selectedProcesso && selectedProcesso.status !== 'concluido') {
      if (selectedProcesso.status === 'novo_processo') {
        updateProcesso({
          id: selectedProcesso.id,
          data: { status: 'aguardando_justificativa' }
        });
      }
      handleAddJustificativa();
    }
  };
  
  const handleCreateJustificativa = async (values: ESICJustificativaFormValues): Promise<void> => {
    if (!selectedProcesso) return Promise.reject(new Error('Nenhum processo selecionado'));
    
    return new Promise((resolve, reject) => {
      createJustificativa(
        {
          values,
          processoId: selectedProcesso.id
        },
        {
          onSuccess: () => {
            setScreen('view');
            toast({
              title: 'Justificativa adicionada com sucesso',
              description: 'A justificativa foi registrada para este processo.',
            });
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };
  
  const handleGenerateJustificativa = async (): Promise<void> => {
    if (!selectedProcesso) return Promise.reject(new Error('Nenhum processo selecionado'));
    
    return new Promise((resolve, reject) => {
      generateJustificativa(
        {
          processoId: selectedProcesso.id,
          processoTexto: selectedProcesso.texto
        },
        {
          onSuccess: () => {
            setScreen('view');
            toast({
              title: 'Justificativa gerada com sucesso',
              description: 'A IA gerou uma justificativa para este processo.',
            });
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        }
      );
    });
  };

  // Handle status updates with the processo ID
  const statusUpdateHandler = (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => {
    if (selectedProcesso) {
      handleUpdateStatus(status)(selectedProcesso.id);
    }
  };

  // Handle situacao updates with the processo ID
  const situacaoUpdateHandler = (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => {
    if (selectedProcesso) {
      handleUpdateSituacao(situacao)(selectedProcesso.id);
    }
  };

  return {
    screen,
    setScreen,
    deleteConfirmOpen,
    processoToDelete,
    processos,
    isLoading,
    error,
    selectedProcesso,
    justificativas,
    isJustificativasLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isJustificativaCreating,
    isGenerating,
    resetDeleteDialogState,
    handleCreateProcesso,
    handleUpdateProcesso: processUpdateHandler,
    handleDeleteProcesso,
    confirmDeleteProcesso,
    handleViewProcesso,
    handleEditProcesso,
    handleAddJustificativa: processAddJustificativaHandler,
    handleCreateJustificativa,
    handleGenerateJustificativa,
    handleUpdateStatus: statusUpdateHandler,
    handleUpdateSituacao: situacaoUpdateHandler,
    fetchProcessos
  };
};
