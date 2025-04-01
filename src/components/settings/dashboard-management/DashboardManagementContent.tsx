
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardPreview from './DashboardPreview';
import DashboardControls from './DashboardControls';
import CardLibrary from './CardLibrary';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { FormSchema } from '@/components/dashboard/card-customization/types';
import { ActionCardItem } from '@/types/dashboard';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import { toast } from '@/hooks/use-toast';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { v4 as uuidv4 } from 'uuid';

const DashboardManagementContent: React.FC = () => {
  const {
    config,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveConfig,
    saveDefaultDashboard,
    resetAllDashboards,
  } = useDefaultDashboardConfig();
  
  const { availableCards } = useAvailableCards();
  const [departmentName, setDepartmentName] = useState('');
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  
  // Get the current dashboard state
  const {
    cards,
    setCards,
    handleDeleteCard,
    handleEditCard,
    handleAddNewCard: openNewCardModal,
  } = useDefaultDashboardState(selectedDepartment);
  
  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (selectedDepartment) {
        try {
          const { data, error } = await supabase
            .from('coordenacoes')
            .select('descricao, sigla')
            .eq('id', selectedDepartment)
            .single();
          
          if (error) {
            console.error('Error fetching department name:', error);
            return;
          }
          
          if (data) {
            setDepartmentName(data.sigla || data.descricao);
          }
        } catch (error) {
          console.error('Failed to fetch department name:', error);
        }
      } else {
        setDepartmentName('');
      }
    };
    
    fetchDepartmentName();
  }, [selectedDepartment]);

  const handleOpenCreateCardModal = () => {
    setIsCreateCardModalOpen(true);
  };
  
  const handleCloseCreateCardModal = () => {
    setIsCreateCardModalOpen(false);
  };

  const handleSaveNewCard = (data: Omit<FormSchema, 'iconId'> & { icon: React.ReactNode }) => {
    // The card will be handled by the DashboardPreview component
    setIsCreateCardModalOpen(false);
    toast({
      title: "Card criado com sucesso",
      description: "O novo card foi adicionado ao dashboard",
      variant: "success"
    });
  };

  const handleAddCardToDashboard = (templateCard: ActionCardItem) => {
    // Create a new card with a unique ID based on the template card
    const newCard: ActionCardItem = {
      ...templateCard,
      id: `card-${uuidv4()}`, // Generate a new unique ID
      isCustom: false // Mark as not custom to prevent deletion
    };
    
    // Add the new card to the dashboard
    setCards([...cards, newCard]);
    
    toast({
      title: "Card adicionado",
      description: `O card "${newCard.title}" foi adicionado ao dashboard`,
      variant: "success"
    });
  };

  // Handle saving the dashboard configuration
  const handleSaveDashboard = async () => {
    try {
      const result = await saveConfig(cards);
      
      if (result) {
        toast({
          title: "Dashboard salvo",
          description: `O dashboard para a coordenação "${departmentName}" foi salvo com sucesso. Todos os usuários verão essas configurações.`,
          variant: "success"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o dashboard. Tente novamente.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o dashboard. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Handle resetting dashboards
  const handleResetDashboards = async () => {
    try {
      const result = await resetAllDashboards();
      return result;
    } catch (error) {
      console.error('Error resetting dashboards:', error);
      toast({
        title: "Erro ao resetar",
        description: "Ocorreu um erro ao resetar os dashboards. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <DashboardControls
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            isMobilePreview={isMobilePreview}
            setIsMobilePreview={setIsMobilePreview}
            onAddNewCard={handleOpenCreateCardModal}
            onSaveDashboard={handleSaveDashboard}
            onResetDashboards={handleResetDashboards}
            isSaving={isSaving}
          />
          
          <CardLibrary 
            availableCards={availableCards}
            onAddCardToDashboard={handleAddCardToDashboard}
          />
        </div>
        
        <div className="md:col-span-3">
          <div className="border rounded-lg overflow-hidden bg-white h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando dashboard...</span>
              </div>
            ) : (
              <DashboardPreview 
                dashboardType={selectedViewType} 
                department={selectedDepartment}
                isMobilePreview={isMobilePreview}
              />
            )}
          </div>
        </div>
      </div>
      
      <CardCustomizationModal
        isOpen={isCreateCardModalOpen}
        onClose={handleCloseCreateCardModal}
        onSave={handleSaveNewCard}
        initialData={null}
      />
    </div>
  );
};

export default DashboardManagementContent;
