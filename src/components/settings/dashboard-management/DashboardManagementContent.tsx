
import React, { useEffect, useState } from 'react';
import DashboardPreview from './DashboardPreview';
import DashboardControls from './DashboardControls';
import CardLibrary from './CardLibrary';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ActionCardItem } from '@/types/dashboard';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { toast } from '@/hooks/use-toast';
import { useDashboardManagement } from '@/hooks/dashboard-management/useDashboardManagement';
import { useDashboardImportExport } from '@/hooks/dashboard-management/useDashboardImportExport';
import DuplicateDashboardModal from './modals/DuplicateDashboardModal';
import ExportDashboardModal from './modals/ExportDashboardModal';
import ImportDashboardModal from './modals/ImportDashboardModal';
import DashboardActionButtons from './DashboardActionButtons';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const DashboardManagementContent: React.FC = () => {
  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isMobilePreview,
    setIsMobilePreview,
    isCreateCardModalOpen,
    setIsCreateCardModalOpen,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    targetDepartment,
    setTargetDepartment,
    departments,
    loadDepartments,
    handleDuplicateDashboard
  } = useDashboardManagement();
  
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    exportData,
    isImportModalOpen,
    setIsImportModalOpen,
    importData,
    setImportData,
    handleExportDashboard,
    handleImportDashboard,
    handleRestoreDefault
  } = useDashboardImportExport(selectedDepartment, selectedViewType);
  
  const {
    saveDefaultDashboard,
    isSaving,
    config: dashboardConfig,
    loading: configLoading,
    fetchConfig
  } = useDefaultDashboardConfig(selectedDepartment);

  // Create local loading state to avoid TS error
  const isLoading = configLoading;
  
  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddCardToDashboard = async (card: ActionCardItem) => {
    try {
      // Fetch current dashboard configuration
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Create a new array with the existing cards (if any) and the new card
      let existingCards: ActionCardItem[] = [];
      if (data?.cards_config) {
        try {
          existingCards = JSON.parse(data.cards_config);
        } catch (e) {
          console.error('Error parsing cards_config:', e);
          existingCards = [];
        }
      }

      // Generate a new unique ID for the card
      const newCard = {
        ...card,
        id: `card-${uuidv4()}`
      };

      // Add the new card to the array
      const updatedCards = [...existingCards, newCard];

      // Save the updated card array
      const { error: saveError } = await supabase
        .from('department_dashboards')
        .upsert({
          department: selectedDepartment,
          view_type: selectedViewType,
          cards_config: JSON.stringify(updatedCards),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,view_type'
        });

      if (saveError) throw saveError;

      // Refresh the dashboard config
      await fetchConfig();

      // Force a refresh by temporarily changing and restoring the selected department
      setTimeout(() => {
        setSelectedDepartment(prev => {
          const temp = prev;
          setSelectedDepartment(temp);
          return temp;
        });
      }, 100);

      const dashboardPreviewRef = document.getElementById('dashboard-preview-container');
      if (dashboardPreviewRef) {
        dashboardPreviewRef.classList.add('highlight-pulse');
        setTimeout(() => dashboardPreviewRef.classList.remove('highlight-pulse'), 1000);
      }
      
      toast({
        title: "Card adicionado",
        description: "O card foi adicionado ao dashboard.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error adding card to dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o card ao dashboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <DashboardControls
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            isMobilePreview={isMobilePreview}
            setIsMobilePreview={setIsMobilePreview}
            onAddNewCard={() => setIsCreateCardModalOpen(true)}
            onSaveDashboard={saveDefaultDashboard}
            isSaving={isSaving}
          />
          
          <DashboardActionButtons
            onDuplicate={() => setIsDuplicateModalOpen(true)}
            onExport={handleExportDashboard}
            onImport={() => setIsImportModalOpen(true)}
            onReset={handleRestoreDefault}
          />
          
          <div className="h-full mt-4">
            <CardLibrary 
              onAddCard={handleAddCardToDashboard}
              selectedDepartment={selectedDepartment}
              selectedDashboardType={selectedViewType}
            />
          </div>
        </div>
        
        <div className="lg:col-span-9">
          <Card id="dashboard-preview-container" className="border rounded-lg overflow-hidden bg-white h-full">
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
          </Card>
        </div>
      </div>
      
      <CardCustomizationModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onSave={(cardData) => {
          setIsCreateCardModalOpen(false);
        }}
        initialData={null}
      />
      
      <DuplicateDashboardModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        onDuplicate={handleDuplicateDashboard}
        selectedDepartment={selectedDepartment}
        targetDepartment={targetDepartment}
        setTargetDepartment={setTargetDepartment}
        departments={departments}
      />
      
      <ExportDashboardModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportData={exportData}
      />
      
      <ImportDashboardModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importData={importData}
        setImportData={setImportData}
        onImport={handleImportDashboard}
      />
    </div>
  );
};

export default DashboardManagementContent;
