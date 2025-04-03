
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';
import DraggableCardLibrary from './DraggableCardLibrary';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import CardCustomizationModal from '@/components/dashboard/CardCustomizationModal';

const DashboardManagementContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const { availableCards } = useAvailableCards();
  
  const {
    config: dashboardCards,
    setConfig: setDashboardCards,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    saveConfig,
  } = useDefaultDashboardConfig();

  const handleAddCardToDashboard = (card: ActionCardItem) => {
    // Create a new card with unique ID
    const newCard = {
      ...card,
      id: `${card.id}-${Date.now()}`,
      isCustom: true
    };
    
    setDashboardCards([...dashboardCards, newCard]);
    
    toast({
      title: "Card adicionado",
      description: `O card "${card.title}" foi adicionado ao dashboard`,
    });
  };

  const handleEditCard = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    setDashboardCards(dashboardCards.filter(card => card.id !== id));
    
    toast({
      title: "Card removido",
      description: "O card foi removido do dashboard",
    });
  };

  const handleHideCard = (id: string) => {
    setDashboardCards(dashboardCards.map(card => 
      card.id === id ? { ...card, isHidden: true } : card
    ));
    
    toast({
      title: "Card ocultado",
      description: "O card foi ocultado do dashboard",
    });
  };

  const handleSaveCard = (data: any) => {
    if (selectedCard) {
      // Update existing card
      setDashboardCards(dashboardCards.map(card => 
        card.id === selectedCard.id ? { ...card, ...data } : card
      ));
      
      toast({
        title: "Card atualizado",
        description: "As alterações foram salvas com sucesso",
      });
    } else {
      // This shouldn't happen, but just in case
      handleAddCardToDashboard({
        ...data,
        id: `custom-${Date.now()}`,
        isCustom: true,
        type: 'standard'
      });
    }
    
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleSaveDashboard = async () => {
    const success = await saveConfig(dashboardCards);
    if (success) {
      toast({
        title: "Dashboard salvo",
        description: "As configurações do dashboard foram salvas com sucesso",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="editor" className="space-y-4">
          <TabsList>
            <TabsTrigger value="editor">Editor de Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Card Library */}
              <div className="w-full lg:w-1/3">
                <DraggableCardLibrary onAddCardToDashboard={handleAddCardToDashboard} />
              </div>
              
              {/* Right side - Dashboard Preview */}
              <div className="w-full lg:w-2/3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Preview do Dashboard</h2>
                    <button 
                      onClick={handleSaveDashboard}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Salvar Dashboard
                    </button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4">
                      {isLoading ? (
                        <div className="h-[400px] flex items-center justify-center">
                          <p>Carregando dashboard...</p>
                        </div>
                      ) : (
                        <div className="min-h-[400px]">
                          <UnifiedCardGrid 
                            cards={dashboardCards}
                            onCardsChange={setDashboardCards}
                            onEditCard={handleEditCard}
                            onDeleteCard={handleDeleteCard}
                            onHideCard={handleHideCard}
                            isEditMode={true}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Configurações do Dashboard</h2>
              {/* Configuração adicional aqui */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardCustomizationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveCard}
        initialData={selectedCard}
      />
    </Card>
  );
};

export default DashboardManagementContent;
