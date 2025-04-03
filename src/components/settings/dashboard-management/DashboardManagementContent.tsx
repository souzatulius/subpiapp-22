
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
import DashboardPreview from './DashboardPreview';
import { useDepartments } from '@/hooks/dashboard-management/useDepartments';

const DashboardManagementContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const { availableCards } = useAvailableCards();
  const { departments, loading: isLoadingDepartments } = useDepartments();
  
  const {
    config: dashboardCards,
    setConfig: setDashboardCards,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveConfig,
    resetAllDashboards,
  } = useDefaultDashboardConfig();

  // Ensure a department is selected if one is available
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0].id);
    }
  }, [departments, selectedDepartment, setSelectedDepartment]);

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
    return success; // Return the success value to match the expected type
  };

  const handleResetDashboard = async () => {
    const success = await resetAllDashboards();
    if (success) {
      toast({
        title: "Dashboard resetado",
        description: "O dashboard foi resetado para as configurações padrão",
      });
    }
    return success; // Return the success value to match the expected type
  };

  const handleCardDrop = (cardDataJson: string) => {
    try {
      const cardData = JSON.parse(cardDataJson);
      handleAddCardToDashboard(cardData);
      return true;
    } catch (error) {
      console.error("Error parsing dropped card data:", error);
      return false;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Card Library */}
            <div className="w-full lg:w-1/3">
              <DraggableCardLibrary onAddCardToDashboard={handleAddCardToDashboard} />
            </div>
            
            {/* Right side - Dashboard Preview */}
            <div className="w-full lg:w-2/3">
              <DashboardPreview 
                dashboardType={selectedViewType}
                department={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                onViewTypeChange={setIsMobilePreview}
                isMobilePreview={isMobilePreview}
                onReset={handleResetDashboard}
                onSave={handleSaveDashboard}
                isSaving={isSaving}
                onCardsChange={setDashboardCards}
                cards={dashboardCards}
                onPageTypeChange={setSelectedViewType}
                onDrop={handleCardDrop}
                departments={departments}
                isLoadingDepartments={isLoadingDepartments}
              />
            </div>
          </div>
        </div>
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
