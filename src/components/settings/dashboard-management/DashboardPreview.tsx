
import React, { useState } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

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
    handleSearchSubmit,
    isLoading
  } = useDefaultDashboardState(department);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (cardData && cardData.id) {
        // Check if we already have this card (by title)
        const existingCard = cards.find(c => c.title === cardData.title);
        if (existingCard) {
          toast({
            title: "Card já existe",
            description: `O card "${cardData.title}" já está no dashboard`,
            variant: "warning"
          });
          return;
        }
        
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
      toast({
        title: "Erro ao adicionar card",
        description: "Ocorreu um erro ao adicionar o card ao dashboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div 
      className={`p-4 transition-all duration-300 ${isDraggingOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`p-4 bg-gray-100 rounded-lg min-h-[400px] ${isDraggingOver ? 'opacity-70' : ''}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-600">Carregando configuração do dashboard...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center p-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            {isDraggingOver ? 
              "Solte aqui para adicionar o card ao dashboard" : 
              "Nenhum card configurado. Arraste cards para este espaço para começar a personalizar o dashboard."
            }
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
      
      {isDraggingOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 bg-opacity-20 text-blue-800 font-semibold p-4 rounded-lg shadow-lg">
            Solte para adicionar ao dashboard
          </div>
        </div>
      )}
      
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
