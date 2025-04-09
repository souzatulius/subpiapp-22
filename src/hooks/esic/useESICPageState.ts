
import { useState } from 'react';
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues } from '@/types/esic';
import { useToast } from '@/components/ui/use-toast';
import { useProcessos } from '@/hooks/esic/useProcessos';
import { useJustificativas } from '@/hooks/esic/useJustificativas';
import { useProcessoDialog } from '@/hooks/esic/useProcessoDialog';

export type ScreenState = 'list' | 'create' | 'edit' | 'view' | 'justify';

export const useESICPageState = () => {
  const [screen, setScreen] = useState<ScreenState>('list');
  const { toast } = useToast();
  
  const { 
    deleteConfirmOpen, 
    processoToDelete, 
    openDeleteDialog, 
    resetDeleteDialogState 
  } = useProcessoDialog();
  
  const { 
    processos, 
    isLoading, 
    selectedProcesso, 
    setSelectedProcesso,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting,
    fetchProcessos // Make sure we have this function available
  } = useProcessos();
  
  const {
    justificativas,
    isLoading: isJustificativasLoading,
    createJustificativa,
    generateJustificativa,
    isCreating: isJustificativaCreating,
    isGenerating,
  } = useJustificativas(selectedProcesso?.id);
  
  const handleCreateProcesso = async (values: ESICProcessoFormValues): Promise<void> => {
    return new Promise((resolve, reject) => {
      createProcesso(values, {
        onSuccess: () => {
          setScreen('list');
          fetchProcessos(); // Add this to refresh the list after creation
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
  
  const handleUpdateProcesso = async (values: ESICProcessoFormValues): Promise<void> => {
    if (!selectedProcesso) return Promise.reject(new Error('Nenhum processo selecionado'));
    
    return new Promise((resolve, reject) => {
      updateProcesso(
        { 
          id: selectedProcesso.id, 
          data: {
            data_processo: values.data_processo.toISOString(),
            situacao: values.situacao,
            texto: values.texto,
            assunto: values.assunto,
            solicitante: values.solicitante,
            coordenacao_id: values.coordenacao_id,
            prazo_resposta: values.prazo_resposta ? new Date(values.prazo_resposta).toISOString() : undefined
          } 
        },
        {
          onSuccess: () => {
            setScreen('view');
            toast({
              title: 'Processo atualizado com sucesso',
              description: 'As alterações foram salvas no sistema.',
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
  
  const handleViewProcesso = (processo: ESICProcesso) => {
    setSelectedProcesso(processo);
    setScreen('view');
  };
  
  const handleEditProcesso = (processo: ESICProcesso) => {
    setSelectedProcesso(processo);
    setScreen('edit');
  };
  
  const handleAddJustificativa = () => {
    if (selectedProcesso && selectedProcesso.status !== 'concluido') {
      if (selectedProcesso.status === 'novo_processo') {
        updateProcesso({
          id: selectedProcesso.id,
          data: { status: 'aguardando_justificativa' }
        });
      }
      setScreen('justify');
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
  
  const handleUpdateStatus = (status: 'novo_processo' | 'aguardando_justificativa' | 'aguardando_aprovacao' | 'concluido') => {
    if (!selectedProcesso) return;
    
    updateProcesso(
      {
        id: selectedProcesso.id,
        data: { status }
      },
      {
        onSuccess: () => {
          toast({
            title: 'Status atualizado',
            description: `O status do processo foi alterado.`,
          });
          setSelectedProcesso(prev => prev ? { ...prev, status } : null);
        },
      }
    );
  };
  
  const handleUpdateSituacao = (situacao: 'em_tramitacao' | 'prazo_prorrogado' | 'concluido') => {
    if (!selectedProcesso) return;
    
    updateProcesso(
      {
        id: selectedProcesso.id,
        data: { situacao }
      },
      {
        onSuccess: () => {
          toast({
            title: 'Situação atualizada',
            description: `A situação do processo foi alterada.`,
          });
          setSelectedProcesso(prev => prev ? { ...prev, situacao } : null);
        },
      }
    );
  };

  return {
    screen,
    setScreen,
    deleteConfirmOpen,
    processoToDelete,
    processos,
    isLoading,
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
    handleUpdateProcesso,
    handleDeleteProcesso,
    confirmDeleteProcesso,
    handleViewProcesso,
    handleEditProcesso,
    handleAddJustificativa,
    handleCreateJustificativa,
    handleGenerateJustificativa,
    handleUpdateStatus,
    handleUpdateSituacao,
    fetchProcessos // Export this function
  };
};
