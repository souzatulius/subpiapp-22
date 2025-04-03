
import React, { useState, useEffect } from 'react';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { useDepartments } from '@/hooks/dashboard-management/useDepartments';
import DashboardPreview from './DashboardPreview';
import DraggableCardLibrary from './DraggableCardLibrary';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ActionCardItem } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Library } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const DashboardManagementContent: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [pageType, setPageType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  const { departments, loading: departmentsLoading } = useDepartments();
  const { config, setConfig, isLoading, isSaving, saveConfig, resetAllDashboards } = 
    useDefaultDashboardConfig(selectedDepartment, pageType);

  // Set initial department when departments are loaded
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0].id);
    }
  }, [departments, selectedDepartment]);
  
  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };
  
  const handlePageTypeChange = (type: 'dashboard' | 'communication') => {
    console.log('Page type changed to:', type);
    setPageType(type);
  };
  
  const handleSave = async () => {
    if (!selectedDepartment) {
      toast({
        title: "Atenção",
        description: "Selecione uma coordenação antes de salvar",
        variant: "warning"
      });
      return false;
    }

    console.log(`Saving dashboard for department: ${selectedDepartment}, page type: ${pageType}`);
    const saved = await saveConfig(config, selectedDepartment, pageType);
    
    if (saved) {
      toast({
        title: "Dashboard salvo",
        description: `Configuração do ${pageType === 'dashboard' ? 'dashboard' : 'página de comunicação'} salva com sucesso`,
        variant: "success"
      });
    }
    
    return saved;
  };
  
  const handleReset = async () => {
    if (!selectedDepartment) {
      toast({
        title: "Atenção",
        description: "Selecione uma coordenação antes de resetar",
        variant: "warning"
      });
      return false;
    }
    
    const confirmed = window.confirm(
      "Tem certeza que deseja resetar o dashboard? Os cards serão removidos e essa ação não pode ser desfeita."
    );
    
    if (confirmed) {
      setConfig([]);
      toast({
        title: "Dashboard resetado",
        description: "Todos os cards foram removidos",
        variant: "success"
      });
      return true;
    }
    
    return false;
  };

  const handleAddCardToDashboard = (card: ActionCardItem) => {
    const newCard = {
      ...card,
      id: `${card.id}-${Date.now()}`, // Ensure unique ID for the new card
      isCustom: true
    };
    
    setConfig([...config, newCard]);
    
    toast({
      title: "Card adicionado",
      description: `O card "${card.title}" foi adicionado ao dashboard`,
      variant: "success"
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <DashboardPreview
            dashboardType={pageType}
            department={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
            onViewTypeChange={setIsMobilePreview}
            isMobilePreview={isMobilePreview}
            onReset={handleReset}
            onSave={handleSave}
            isSaving={isSaving}
            onCardsChange={setConfig}
            cards={config}
            onPageTypeChange={handlePageTypeChange}
            onDrop={(cardData) => {
              try {
                const card = JSON.parse(cardData) as ActionCardItem;
                handleAddCardToDashboard(card);
                return true;
              } catch (err) {
                console.error('Failed to parse card data:', err);
                return false;
              }
            }}
            departments={departments}
            isLoadingDepartments={departmentsLoading}
            showLibraryButton
            onLibraryClick={() => setIsLibraryOpen(true)}
          />
        </div>
        
        {/* Biblioteca de Cards como Sheet */}
        <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
          <SheetContent size="lg" className="w-[90%] sm:w-[540px] md:w-[720px]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Library className="h-5 w-5 mr-2" />
                Biblioteca de Cards
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <DraggableCardLibrary 
                onAddCardToDashboard={handleAddCardToDashboard}
              />
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default DashboardManagementContent;
