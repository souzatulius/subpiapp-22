
import React from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview?: boolean;
  onAddCard?: (card: ActionCardItem) => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview = false,
  onAddCard
}) => {
  const {
    cards,
    setCards,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    editingCard,
    handleDeleteCard,
    handleHideCard,
    handleEditCard,
    handleSaveCard,
    specialCardsData,
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  } = useDefaultDashboardState(department);

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (cardData && cardData.id) {
        // Create a new card with a unique ID based on the dropped card
        const newCard: ActionCardItem = {
          ...cardData,
          id: `card-${uuidv4()}`, // Generate a new unique ID
          isCustom: false // Mark as not custom to prevent deletion
        };
        
        setCards([...cards, newCard]);
        
        toast({
          title: "Card adicionado",
          description: `O card "${newCard.title}" foi adicionado ao dashboard`,
          variant: "success"
        });
        
        // Notify parent component if callback exists
        if (onAddCard) {
          onAddCard(newCard);
        }
      }
    } catch (error) {
      console.error('Error parsing dropped card data:', error);
    }
  };

  return (
    <div 
      className="p-4" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <div className="p-4 bg-gray-100 rounded-lg">
        {cards.length === 0 ? (
          <div className="text-center p-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            Nenhum card configurado. Adicione cards para visualizar o dashboard.
          </div>
        ) : (
          <UnifiedCardGrid 
            cards={cards}
            onCardsChange={setCards}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onHideCard={handleHideCard}
            isMobileView={isMobilePreview}
            isEditMode={true}
            // Enable special features
            showSpecialFeatures={true}
            quickDemandTitle={newDemandTitle}
            onQuickDemandTitleChange={setNewDemandTitle}
            onQuickDemandSubmit={handleQuickDemandSubmit}
            onSearchSubmit={handleSearchSubmit}
            specialCardsData={specialCardsData}
          />
        )}
      </div>
      
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard || undefined}
      />
    </div>
  );
};

export default DashboardPreview;
