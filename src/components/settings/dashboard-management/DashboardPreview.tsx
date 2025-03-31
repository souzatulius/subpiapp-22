
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import CardGrid from '@/components/dashboard/CardGrid';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { ActionCardItem } from '@/types/dashboard';

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
    saveCards 
  } = useDefaultDashboardState(department);

  const handleCardsChange = (newCards: ActionCardItem[]) => {
    setCards(newCards);
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
  };

  const saveDashboard = async () => {
    const saved = await saveCards();
    return saved;
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
