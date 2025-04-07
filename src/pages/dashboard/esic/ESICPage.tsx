import React, { useState } from 'react';
import { useProcessos } from '@/hooks/esic/useProcessos';
import { useJustificativas } from '@/hooks/esic/useJustificativas';
import { ESICProcesso, ESICProcessoFormValues, ESICJustificativaFormValues } from '@/types/esic';
import ProcessoForm from '@/components/esic/ProcessoForm';
import ProcessoItem from '@/components/esic/ProcessoItem';
import ProcessoDetails from '@/components/esic/ProcessoDetails';
import JustificativaForm from '@/components/esic/JustificativaForm';
import ESICWelcomeCard from '@/components/esic/ESICWelcomeCard';
import ProcessoList from '@/components/esic/ProcessoList';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, FilePlus, FileQuestion, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import WelcomeCard from '@/components/shared/WelcomeCard';

type ScreenState = 'list' | 'create' | 'edit' | 'view' | 'justify';

const ESICPage: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('list');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { 
    processos, 
    isLoading, 
    error, 
    selectedProcesso, 
    setSelectedProcesso,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    isCreating,
    isUpdating,
    isDeleting,
    refetch
  } = useProcessos();
  
  const {
    justificativas,
    isLoading: isJustificativasLoading,
    createJustificativa,
    generateJustificativa,
    isCreating: isJustificativaCreating,
    isGenerating,
  } = useJustificativas(selectedProcesso?.id);
  
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
    setProcessoToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteProcesso = () => {
    if (!processoToDelete) return;
    
    deleteProcesso(processoToDelete, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setProcessoToDelete(null);
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
      
      {screen === 'list' && (
        <div className="flex justify-between items-center">
          <ESICWelcomeCard onNovoProcesso={() => setScreen('create')} />
          <Button 
            onClick={() => setScreen('create')}
            className="flex md:hidden"
          >
            <FilePlus className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <main>
        {screen === 'list' && (
          <ProcessoList
            processos={processos}
            isLoading={isLoading}
            onSelectProcesso={handleViewProcesso}
            onEditProcesso={handleEditProcesso}
            onDeleteProcesso={handleDeleteProcesso}
          />
        )}
        
        {screen === 'create' && (
          <ProcessoForm 
            onSubmit={handleCreateProcesso} 
            isLoading={isCreating}
            onCancel={() => setScreen('list')}
          />
        )}
        
        {screen === 'edit' && selectedProcesso && (
          <ProcessoForm 
            onSubmit={handleUpdateProcesso} 
            initialValues={selectedProcesso}
            isLoading={isUpdating}
            mode="edit"
            onCancel={() => setScreen('view')}
          />
        )}
        
        {screen === 'view' && selectedProcesso && (
          <ProcessoDetails 
            processo={selectedProcesso}
            justificativas={justificativas}
            onBack={() => setScreen('list')}
            onEdit={handleEditProcesso}
            onAddJustificativa={handleAddJustificativa}
            onUpdateStatus={handleUpdateStatus}
            onUpdateSituacao={handleUpdateSituacao}
            isJustificativasLoading={isJustificativasLoading}
          />
        )}
        
        {screen === 'justify' && selectedProcesso && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setScreen('view')} className="p-0">
              <FilePlus className="h-4 w-4 mr-2" />
              Voltar para Detalhes
            </Button>
            
            <JustificativaForm 
              onSubmit={handleCreateJustificativa}
              onGenerateAI={handleGenerateJustificativa}
              isLoading={isJustificativaCreating}
              isGenerating={isGenerating}
              processoTexto={selectedProcesso.texto}
            />
          </div>
        )}
      </main>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Processo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este processo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProcesso} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ESICPage;
