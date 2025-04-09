
import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import DeleteProcessoDialog from '@/components/esic/dialogs/DeleteProcessoDialog';
import ProcessosList from '@/components/esic/screens/ProcessosList';
import ProcessoCreate from '@/components/esic/screens/ProcessoCreate';
import ProcessoEdit from '@/components/esic/screens/ProcessoEdit';
import ProcessoView from '@/components/esic/screens/ProcessoView';
import JustificativaCreate from '@/components/esic/screens/JustificativaCreate';
import { useESICPageState } from '@/hooks/esic/useESICPageState';
import { ESICProcesso } from '@/types/esic';
import { toast } from '@/components/ui/use-toast';

const ESICPage: React.FC = () => {
  const {
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
    fetchProcessos
  } = useESICPageState();
  
  // Fetch processes when the component mounts and when the screen changes back to list
  useEffect(() => {
    console.log('ESICPage useEffect - fetching processos');
    if (screen === 'list') {
      fetchProcessos().catch(err => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar processos",
          description: err.message || "Ocorreu um erro ao carregar os processos"
        });
      });
    }
  }, [screen, fetchProcessos]);
  
  // Handler for adding justification directly from the process list
  const handleAddJustificativaFromList = (processo: ESICProcesso) => {
    handleViewProcesso(processo);
    handleAddJustificativa();
  };
  
  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:px-6 space-y-6">
      <WelcomeCard 
        title="Sistema e-SIC"
        description="Gerencie processos e justificativas para as solicitações de munícipes."
        icon={<FileText className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <main>
        {screen === 'list' && (
          <ProcessosList 
            processos={processos}
            isLoading={isLoading}
            error={error}
            onCreateProcesso={() => setScreen('create')}
            onViewProcesso={handleViewProcesso}
            onEditProcesso={handleEditProcesso}
            onDeleteProcesso={handleDeleteProcesso}
            onAddJustificativa={handleAddJustificativaFromList}
          />
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
            onEdit={() => handleEditProcesso(selectedProcesso)}
            onAddJustificativa={handleAddJustificativa}
            onUpdateStatus={handleUpdateStatus}
            onUpdateSituacao={handleUpdateSituacao}
          />
        )}
        
        {screen === 'justify' && selectedProcesso && (
          <JustificativaCreate 
            processoTexto={selectedProcesso.texto}
            onSubmit={handleCreateJustificativa}
            onGenerate={handleGenerateJustificativa}
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
