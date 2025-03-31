
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import CardGrid from '@/components/dashboard/CardGrid';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

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
  
  useEffect(() => {
    // Log the cards at mount to debug
    console.log("Dashboard Preview Cards:", cards);
    console.log("Welcome Cards:", welcomeCards);
    console.log("Standard Cards:", standardCards);
  }, [cards]);

  const handleCardsChange = (newCards: ActionCardItem[]) => {
    if (reorderCards) {
      reorderCards(newCards);
    } else {
      setCards(newCards);
    }
  };

  const handleEditCardClick = (card: ActionCardItem) => {
    console.log("Editando card:", card);
    setEditingCard(card);
    setIsCustomizationModalOpen(true);
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCard = (cardData: ActionCardItem) => {
    try {
      console.log("Salvando card:", cardData);
      
      if (editingCard) {
        console.log("Atualizando card existente:", editingCard.id);
        const updatedCards = cards.map(card => 
          card.id === editingCard.id ? { ...card, ...cardData } : card
        );
        console.log("Cards após atualização:", updatedCards);
        setCards(updatedCards);
      } else {
        // Criação de um novo card
        const newCard: ActionCardItem = {
          ...cardData,
          id: `card-${Date.now()}`, // Garantir ID único
          isCustom: true
        };
        console.log("Novo card criado:", newCard);
        setCards([...cards, newCard]);
      }
      
      // Salvar imediatamente para visualizar as mudanças
      if (saveCards) {
        console.log("Salvando cards no banco...");
        saveCards();
      }
      
      setIsCustomizationModalOpen(false);
      
      toast({
        title: editingCard ? "Card atualizado" : "Card adicionado",
        description: editingCard ? "O card foi atualizado com sucesso." : "O card foi adicionado ao dashboard.",
        variant: "success"
      });
    } catch (error) {
      console.error("Erro ao salvar card:", error);
      toast({
        title: "Erro ao salvar card",
        description: "Ocorreu um erro ao tentar salvar o card. Tente novamente.",
        variant: "destructive"
      });
    }
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
          {welcomeCards.length > 0 && welcomeCards.map(card => (
            <div key={card.id} className="mb-4 relative group">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-white/80 rounded-full p-1">
                <button 
                  onClick={() => handleEditCardClick(card)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
              <WelcomeCard
                title={card.title}
                description={card.customProperties?.description || ''}
                color={card.customProperties?.gradient || 'bg-gradient-to-r from-blue-600 to-blue-800'}
                icon={React.createElement(getIconComponentFromId(card.iconId), { className: "h-6 w-6" })}
                showButton={false}
              />
            </div>
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
