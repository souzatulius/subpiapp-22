
import React from 'react';
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

const ESICPage: React.FC = () => {
  const {
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
  } = useESICPageState();
  
  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:px-6 space-y-6">
      <WelcomeCard 
        title="Sistema e-SIC"
        description="Gerencie processos e justificativas para as solicitações recebidas via Sistema Eletrônico do Serviço de Informação ao Cidadão."
        icon={<FileText className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-600 to-blue-800"
      />
      
      <main>
        {screen === 'list' && (
          <ProcessosList 
            processos={processos as ESICProcesso[]}
            isLoading={isLoading}
            onCreateProcesso={() => setScreen('create')}
            onViewProcesso={handleViewProcesso}
            onEditProcesso={handleEditProcesso}
            onDeleteProcesso={handleDeleteProcesso}
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
