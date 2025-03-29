
import React from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardGrid from '@/components/dashboard/CardGrid';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2, PlusCircle } from 'lucide-react';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  
  // Get dashboard state and card actions from the hook
  const {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleAddNewCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    departmentName,
    isLoading,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useDefaultDashboardState(department);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <WelcomeCard
        title="Comunicação"
        description={isPreview 
          ? "Visualização da página de comunicação para configuração" 
          : "Gerencie todas as suas demandas e notas oficiais"
        }
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
        showButton={!isPreview}
        buttonText="Novo Card"
        buttonIcon={<PlusCircle className="h-4 w-4" />}
        buttonVariant="action"
        onButtonClick={handleAddNewCard}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
        </div>
      ) : (
        /* Card Grid */
        <CardGrid
          cards={cards}
          onCardsChange={setCards}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          onAddNewCard={handleAddNewCard}
          specialCardsData={specialCardsData}
          // Add the missing props
          quickDemandTitle={newDemandTitle}
          onQuickDemandTitleChange={setNewDemandTitle}
          onQuickDemandSubmit={handleQuickDemandSubmit}
          onSearchSubmit={handleSearchSubmit}
          usuarioId={user?.id || ''}
          coordenacaoId={department || ''}
        />
      )}

      {/* Card Customization Modal */}
      {!isPreview && (
        <CardCustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          onSave={handleSaveCard}
          initialData={editingCard}
        />
      )}
    </div>
  );
};

export default ComunicacaoDashboard;
