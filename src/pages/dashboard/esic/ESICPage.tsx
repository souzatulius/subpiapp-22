import React, { useState } from 'react';
import { useProcessos } from '@/hooks/esic/useProcessos';
import { useJustificativas } from '@/hooks/esic/useJustificativas';
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues } from '@/types/esic';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useProcessoDialog } from '@/hooks/esic/useProcessoDialog';
import DeleteProcessoDialog from '@/components/esic/dialogs/DeleteProcessoDialog';
import ProcessosList from '@/components/esic/screens/ProcessosList';
import ProcessoCreate from '@/components/esic/screens/ProcessoCreate';
import ProcessoEdit from '@/components/esic/screens/ProcessoEdit';
import ProcessoView from '@/components/esic/screens/ProcessoView';
import JustificativaCreate from '@/components/esic/screens/JustificativaCreate';
import LatestESICProcesses from '@/components/dashboard/LatestESICProcesses';
import { useSearchParams } from 'react-router-dom';

type ScreenState = 'list' | 'create' | 'edit' | 'view' | 'justify';

const ESICPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const viewProcessoId = searchParams.get('view');
  
  const [screen, setScreen] = useState<ScreenState>(viewProcessoId ? 'view' : 'list');
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
    isDeleting
  } = useProcessos();
  
  const {
    justificativas,
    isLoading: isJustificativasLoading,
    createJustificativa,
    generateJustificativa,
    isCreating: isJustificativaCreating,
    isGenerating,
  } = useJustificativas(selectedProcesso?.id);
  
  React.useEffect(() => {
    if (viewProcessoId && processos) {
      const processo = processos.find(p => p.id === viewProcessoId);
      if (processo) {
        setSelectedProcesso(processo);
        setScreen('view');
      }
    }
  }, [viewProcessoId, processos, setSelectedProcesso]);
  
  const handleCreateProcesso = (values: ESICProcessoFormValues) => {
    createProcesso(values, {
      onSuccess: () => {
        setScreen('list');
        toast({
          title: 'Processo criado com sucesso',
          description: 'O novo processo foi adicionado ao sistema.',
        });
      },
    });
  };
  
  const handleUpdateProcesso = (values: ESICProcessoFormValues) => {
    if (!selectedProcesso) return;
    
    updateProcesso(
      { 
        id: selectedProcesso.id, 
        data: {
          data_processo: values.data_processo.toISOString(),
          situacao: values.situacao,
          texto: values.texto,
        } 
      },
      {
        onSuccess: () => {
          setScreen('view');
          toast({
            title: 'Processo atualizado com sucesso',
            description: 'As alterações foram salvas no sistema.',
          });
        },
      }
    );
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
  
  const handleCreateJustificativa = (values: ESICJustificativaFormValues) => {
    if (!selectedProcesso) return;
    
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
        },
      }
    );
  };
  
  const handleGenerateJustificativa = () => {
    if (!selectedProcesso) return;
    
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
        },
      }
    );
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
  
  return (
    <div className="container py-6 space-y-6">
      <WelcomeCard 
        title="Sistema e-SIC"
        description="Gerencie processos e justificativas para as solicitações recebidas via Sistema Eletrônico do Serviço de Informação ao Cidadão."
        icon={<FileText className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <main>
        {screen === 'list' && (
          <>
            <LatestESICProcesses />
            <div className="mt-8">
              <ProcessosList 
                processos={processos}
                isLoading={isLoading}
                onCreateProcesso={() => setScreen('create')}
                onViewProcesso={handleViewProcesso}
                onEditProcesso={handleEditProcesso}
                onDeleteProcesso={handleDeleteProcesso}
              />
            </div>
          </>
        )}
        
        {screen === 'create' && (
          <ProcessoCreate 
            onSubmit={handleCreateProcesso}
            isLoading={isCreating}
            onCancel={() => setScreen('list')}
          />
        )}
        
        {screen === 'edit' && selectedProcesso && (
          <ProcessoEdit 
            processo={selectedProcesso}
            onSubmit={handleUpdateProcesso}
            isLoading={isUpdating}
            onCancel={() => setScreen('view')}
          />
        )}
        
        {screen === 'view' && selectedProcesso && (
          <ProcessoView 
            processo={selectedProcesso}
            justificativas={justificativas}
            isJustificativasLoading={isJustificativasLoading}
            onBack={() => setScreen('list')}
            onEdit={handleEditProcesso}
            onAddJustificativa={handleAddJustificativa}
            onUpdateStatus={handleUpdateStatus}
            onUpdateSituacao={handleUpdateSituacao}
          />
        )}
        
        {screen === 'justify' && selectedProcesso && (
          <JustificativaCreate 
            processoTexto={selectedProcesso.texto}
            onSubmit={handleCreateJustificativa}
            onGenerateAI={handleGenerateJustificativa}
            isLoading={isJustificativaCreating}
            isGenerating={isGenerating}
            onBack={() => setScreen('view')}
          />
        )}
      </main>
      
      <DeleteProcessoDialog 
        open={deleteConfirmOpen}
        onOpenChange={(open) => !open && resetDeleteDialogState()}
        onConfirm={confirmDeleteProcesso}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ESICPage;
