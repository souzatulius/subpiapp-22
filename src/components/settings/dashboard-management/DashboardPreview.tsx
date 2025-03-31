
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardGrid from '@/components/dashboard/CardGrid';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';
import WelcomeCard from '@/components/shared/WelcomeCard';

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
    saveCards,
    reorderCards,
  } = useDefaultDashboardState(department);

  // Separar Welcome Cards dos cards normais
  const welcomeCards = cards.filter(card => card.type === 'welcome_card');
  const standardCards = cards.filter(card => card.type !== 'welcome_card');

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
      // Salvar imediatamente para visualizar as mudanças
      saveCards();
    } else {
      // Criação de um novo card
      const newCard: ActionCardItem = {
        ...cardData,
        id: `card-${Date.now()}`, // Garantir ID único
        isCustom: true
      };
      setCards([...cards, newCard]);
      // Salvar imediatamente para visualizar as mudanças
      saveCards();
    }
    setIsCustomizationModalOpen(false);
    
    toast({
      title: editingCard ? "Card atualizado" : "Card adicionado",
      description: editingCard ? "O card foi atualizado com sucesso." : "O card foi adicionado ao dashboard.",
      variant: "success"
    });
  };

  // Helper para obter componente de ícone
  const getIconComponentFromId = (iconId: string) => {
    // Simple fallback when dynamic imports are not easy
    return function DefaultIcon(props: any) {
      return <span {...props}>📋</span>;
    };
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
          
          {/* Welcome Cards */}
          {welcomeCards.map(card => (
            <WelcomeCard
              key={card.id}
              title={card.title}
              description={card.customProperties?.description || ''}
              color={card.customProperties?.gradient || 'bg-gradient-to-r from-blue-600 to-blue-800'}
              icon={React.createElement(getIconComponentFromId(card.iconId), { className: "h-6 w-6" })}
              showButton={false}
            />
          ))}
          
          {/* Regular Cards */}
          <CardGrid 
            cards={standardCards} 
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
