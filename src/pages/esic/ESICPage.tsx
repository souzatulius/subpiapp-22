
import React from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useESICPageState } from '@/hooks/esic/useESICPageState';
import ProcessosList from '@/components/esic/screens/ProcessosList';
import ProcessoCreate from '@/components/esic/screens/ProcessoCreate';
import ProcessoEdit from '@/components/esic/screens/ProcessoEdit';
import ProcessoView from '@/components/esic/screens/ProcessoView';
import JustificativaCreate from '@/components/esic/screens/JustificativaCreate';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { ESICProcesso } from '@/types/esic';
import { useEffect } from 'react';

const ESICPage = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const {
    screen,
    deleteConfirmOpen,
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
    setScreen,
    fetchProcessos
  } = useESICPageState();

  // Fetch processes when component mounts and when we go back to list view
  useEffect(() => {
    if (screen === 'list') {
      fetchProcessos();
    }
  }, [screen, fetchProcessos]);

  // For ProcessoList filtering
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'list' | 'cards'>('list');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render appropriate content based on current screen
  const renderContent = () => {
    switch(screen) {
      case 'list':
        return (
          <ProcessosList 
            processos={processos as ESICProcesso[]}
            isLoading={isLoading}
            error={error}
            onCreateProcesso={() => setScreen('create')}
            onViewProcesso={handleViewProcesso}
            onEditProcesso={handleEditProcesso}
            onDeleteProcesso={handleDeleteProcesso}
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
            onCancel={() => setScreen('view')}
            isLoading={isUpdating}
          />
        ) : null;
      case 'view':
        return selectedProcesso ? (
          <ProcessoView 
            processo={selectedProcesso}
            justificativas={justificativas}
            isJustificativasLoading={isJustificativasLoading}
            onEdit={() => handleEditProcesso(selectedProcesso)}
            onAddJustificativa={handleAddJustificativa}
            onBack={() => setScreen('list')}
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
            onBack={() => setScreen('view')}
            isLoading={isJustificativaCreating}
            isGenerating={isGenerating}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 p-4 md:p-8 pb-24 sm:pb-8">
          {renderContent()}
        </main>
      </div>
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => !open && resetDeleteDialogState()}
        title="Excluir processo"
        description="Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteProcesso}
        isLoading={isDeleting}
      />
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ESICPage;
