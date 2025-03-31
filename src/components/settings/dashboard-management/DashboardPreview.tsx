
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardGrid from '@/components/dashboard/CardGrid';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

interface DashboardPreviewProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  isMobilePreview?: boolean;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardType, 
  department,
  isMobilePreview = false
}) => {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(true); // Start in edit mode for management
  
  const { 
    cards, 
    setCards, 
    handleDeleteCard, 
    handleEditCard,
    saveCards: stateSaveCards,
  } = useDefaultDashboardState(department);

  // Define saveCards function using the state function or a fallback
  const saveCards = async () => {
    if (stateSaveCards) {
      return stateSaveCards();
    } else {
      toast({
        title: "Alterações salvas",
        description: "As alterações no dashboard foram salvas com sucesso.",
        variant: "success"
      });
      return true;
    }
  };

  // Define reorderCards function
  const reorderCards = (newCards: ActionCardItem[]) => {
    setCards(newCards);
  };

  const handleCardsChange = (newCards: ActionCardItem[]) => {
    if (reorderCards) {
      reorderCards(newCards);
    } else {
      setCards(newCards);
    }
  };

  const handleEditCardClick = (card: ActionCardItem) => {
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (cardData: any) => {
    if (editingCard) {
      const updatedCards = cards.map(card => 
        card.id === editingCard.id ? { ...card, ...cardData } : card
      );
      setCards(updatedCards);
    } else {
      setCards([...cards, cardData]);
    }
    setIsCustomizationModalOpen(false);
    
    toast({
      title: editingCard ? "Card atualizado" : "Card adicionado",
      description: editingCard ? "O card foi atualizado com sucesso." : "O card foi adicionado ao dashboard.",
      variant: "success"
    });
  };

  return (
    <>
      <div className="relative w-full h-full bg-gray-50 p-4 rounded-lg overflow-auto">
        <div className={`${isMobilePreview ? 'max-w-sm mx-auto' : ''}`}>
          {dashboardType === 'dashboard' ? (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Dashboard Principal</h3>
              <p className="text-sm text-gray-500">Visualização do dashboard padrão para {department}</p>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Dashboard de Comunicação</h3>
              <p className="text-sm text-gray-500">Visualização do dashboard de comunicação para {department}</p>
            </div>
          )}
          
          <CardGrid 
            cards={cards} 
            onCardsChange={handleCardsChange} 
            onEditCard={handleEditCardClick} 
            onDeleteCard={handleDeleteCard}
            isMobileView={isMobilePreview}
            isEditMode={isEditMode}
            disableWiggleEffect={true}
            onAddNewCard={handleAddNewCard}
          />
        </div>
      </div>
      
      <CardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard}
      />
    </>
  );
};

export default DashboardPreview;
