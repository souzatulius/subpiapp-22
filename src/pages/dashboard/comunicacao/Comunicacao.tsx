
import React from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardGrid from '@/components/dashboard/CardGrid';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import DashboardActions from '@/components/dashboard/DashboardActions';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
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
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    specialCardsData,
    isLoading
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
      />

      {/* Show Add New Card button only when not in preview mode */}
      {!isPreview && (
        <DashboardActions onAddNewCard={handleAddNewCard} />
      )}

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
          quickDemandTitle={newDemandTitle}
          onQuickDemandTitleChange={setNewDemandTitle}
          onQuickDemandSubmit={handleQuickDemandSubmit}
          onSearchSubmit={handleSearchSubmit}
          specialCardsData={specialCardsData}
        />
      )}

      {/* Card Customization Modal */}
      {!isPreview && (
        <CardCustomizationModal
          isOpen={isCustomizationModalOpen}
          onOpenChange={setIsCustomizationModalOpen}
          card={editingCard}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
};

export default ComunicacaoDashboard;
