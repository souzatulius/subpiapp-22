
import React from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2, PlusCircle } from 'lucide-react';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

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

  // Adapter for CardCustomizationModal to work with our card format
  const handleSaveCardAdapter = (data: any) => {
    // Convert the icon prop to iconId if needed
    const cardData = {
      ...data,
      iconId: data.iconId || (typeof data.icon === 'string' ? data.icon : 'clipboard-list'),
    };
    
    handleSaveCard(cardData);
  };

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
        /* Card Grid - Usando UnifiedCardGrid em vez de CardGrid */
        <UnifiedCardGrid
          cards={cards}
          onCardsChange={setCards}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          isEditMode={!isPreview}
        />
      )}

      {/* Card Customization Modal */}
      {!isPreview && (
        <CardCustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          onSave={handleSaveCardAdapter}
          initialData={editingCard}
        />
      )}
    </div>
  );
};

export default ComunicacaoDashboard;
