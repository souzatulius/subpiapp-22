
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
    generatedJustificativaText,
    setGeneratedJustificativaText,
    fetchProcessos
  } = useESICPageState();
  
  // Effect to update the justificativa text field when AI generates content
  useEffect(() => {
    if (generatedJustificativaText && screen === 'justify') {
      // This will be handled by the JustificativaCreate or JustificativaForm component
    }
  }, [generatedJustificativaText, screen]);
  
  // Fetch processes when the component mounts
  useEffect(() => {
    console.log('ESICPage useEffect - fetching processos inicialmente');
    fetchProcessos().catch(err => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar processos",
        description: err.message || "Ocorreu um erro ao carregar os processos"
      });
    });
  }, []); // Buscar apenas na montagem
  
  // Outra chamada quando a tela muda para 'list'
  useEffect(() => {
    if (screen === 'list') {
      console.log('ESICPage useEffect - fetching processos ao retornar para lista');
      fetchProcessos().catch(err => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar processos",
          description: err.message || "Ocorreu um erro ao carregar os processos"
        });
      });
    }
  }, [screen]);
  
  // Handler for adding justification directly from the process list
  const handleAddJustificativaFromList = (processo: ESICProcesso) => {
    handleViewProcesso(processo);
    handleAddJustificativa();
  };
  
  // Render appropriate content based on current screen
  const renderContent = () => {
    switch(screen) {
      case 'list':
        return (
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
        );
      case 'create':
        return (
          <ProcessoCreate />
        );
      case 'edit':
        return selectedProcesso ? (
          <ProcessoEdit 
            processo={selectedProcesso}
            onSubmit={handleUpdateProcesso}
            isLoading={isUpdating}
            onCancel={() => setScreen('view')}
          />
        ) : null;
      case 'view':
        return selectedProcesso ? (
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
        ) : null;
      case 'justify':
        return selectedProcesso ? (
          <JustificativaCreate 
            processoTexto={selectedProcesso.texto}
            onSubmit={handleCreateJustificativa}
            onGenerate={handleGenerateJustificativa}
            isLoading={isJustificativaCreating}
            isGenerating={isGenerating}
            onBack={() => setScreen('view')}
          />
        ) : null;
      default:
        return null;
    }
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
        {renderContent()}
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
