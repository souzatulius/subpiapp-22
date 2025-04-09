
import { useState, useEffect, useCallback } from 'react';
import { useProcessos } from './useProcessos';
import { useJustificativas } from './useJustificativas';
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues, ESICJustificativa } from '@/types/esic';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';

export type ScreenType = 'list' | 'create' | 'edit' | 'view' | 'justify';

export const useESICPageState = () => {
  const [screen, setScreen] = useState<ScreenType>('list');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState<ESICProcesso | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { processos, 
          isLoading, 
          error, 
          fetchProcessos, 
          selectedProcesso, 
          setSelectedProcesso,
          createProcesso,
          updateProcesso,
          deleteProcesso,
          isCreating,
          isUpdating,
          isDeleting } = useProcessos();

  const { 
    justificativas,
    isLoading: isJustificativasLoading,
    fetchJustificativas,
    createJustificativa,
    isCreating: isJustificativaCreating
  } = useJustificativas();

  const { user } = useAuth();

  useEffect(() => {
    fetchProcessos();
  }, []);

  useEffect(() => {
    if (selectedProcesso) {
      fetchJustificativas(selectedProcesso.id);
    }
  }, [selectedProcesso]);

  const handleCreateProcesso = useCallback(async (values: ESICProcessoFormValues) => {
    if (!user) return;

    const data = {
      protocolo: `ESIC-${Math.floor(Math.random() * 10000)}`,
      assunto: values.assunto,
      texto: values.texto,
      situacao: values.situacao,
      status: 'novo_processo',
      autor_id: user.id,
      data_processo: format(values.data_processo, 'yyyy-MM-dd'),
      solicitante: values.solicitante || '',
      coordenacao_id: values.coordenacao_id || null,
      prazo_resposta: values.prazo_resposta ? format(new Date(values.prazo_resposta), 'yyyy-MM-dd') : null,
    };

    const result = await createProcesso(data);
    
    if (result.success) {
      toast({
        title: "Processo cadastrado",
        description: "O processo foi cadastrado com sucesso.",
      });
      setScreen('list');
    }
  }, [user, createProcesso]);

  const handleUpdateProcesso = useCallback(async (values: ESICProcessoFormValues) => {
    if (!selectedProcesso) return;

    const data = {
      assunto: values.assunto,
      texto: values.texto,
      situacao: values.situacao,
      data_processo: format(values.data_processo, 'yyyy-MM-dd'),
      solicitante: values.solicitante || '',
      coordenacao_id: values.coordenacao_id || null,
      prazo_resposta: values.prazo_resposta ? format(new Date(values.prazo_resposta), 'yyyy-MM-dd') : null,
    };

    const result = await updateProcesso(selectedProcesso.id, data);
    
    if (result.success) {
      toast({
        title: "Processo atualizado",
        description: "O processo foi atualizado com sucesso.",
      });
      setScreen('view');
    }
  }, [selectedProcesso, updateProcesso]);

  const handleDeleteProcesso = useCallback((processo: ESICProcesso) => {
    setProcessoToDelete(processo);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDeleteProcesso = useCallback(async () => {
    if (!processoToDelete) return;
    
    const result = await deleteProcesso(processoToDelete.id);
    
    if (result.success) {
      toast({
        title: "Processo excluído",
        description: "O processo foi excluído com sucesso.",
      });
      setDeleteConfirmOpen(false);
      setProcessoToDelete(null);
      setScreen('list');
    }
  }, [processoToDelete, deleteProcesso]);

  const resetDeleteDialogState = useCallback(() => {
    setDeleteConfirmOpen(false);
    setProcessoToDelete(null);
  }, []);

  const handleViewProcesso = useCallback((processo: ESICProcesso) => {
    setSelectedProcesso(processo);
    setScreen('view');
  }, []);

  const handleEditProcesso = useCallback(() => {
    setScreen('edit');
  }, []);

  const handleAddJustificativa = useCallback(() => {
    setScreen('justify');
  }, []);

  const handleCreateJustificativa = useCallback(async (values: ESICJustificativaFormValues) => {
    if (!selectedProcesso || !user) return;
    
    const data = {
      processo_id: selectedProcesso.id,
      texto: values.texto,
      gerado_por_ia: values.gerado_por_ia,
      autor_id: user.id,
    };

    const result = await createJustificativa(data);
    
    if (result.success) {
      // Update the processo status
      await updateProcesso(selectedProcesso.id, { status: 'aguardando_aprovacao' });
      
      toast({
        title: "Justificativa cadastrada",
        description: "A justificativa foi cadastrada com sucesso.",
      });
      setScreen('view');
    }
  }, [selectedProcesso, user, createJustificativa, updateProcesso]);

  const handleGenerateJustificativa = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      // Mock AI generation for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `Justificativa gerada com base no texto: ${prompt}\n\nEsta é uma justificativa gerada automaticamente para demonstração.`;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a justificativa",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleUpdateStatus = useCallback(async (status: ESICProcesso['status']) => {
    if (!selectedProcesso) return;
    
    const result = await updateProcesso(selectedProcesso.id, { status });
    
    if (result.success) {
      toast({
        title: "Status atualizado",
        description: "O status do processo foi atualizado com sucesso.",
      });
    }
  }, [selectedProcesso, updateProcesso]);

  const handleUpdateSituacao = useCallback(async (situacao: ESICProcesso['situacao']) => {
    if (!selectedProcesso) return;
    
    const result = await updateProcesso(selectedProcesso.id, { situacao });
    
    if (result.success) {
      toast({
        title: "Situação atualizada",
        description: "A situação do processo foi atualizada com sucesso.",
      });
    }
  }, [selectedProcesso, updateProcesso]);

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
    handleUpdateSituacao
  };
};
