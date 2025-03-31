
import React, { useEffect } from 'react';
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
    isLoading,
    isSaving,
  } = useDefaultDashboardConfig(selectedDepartment);
  
  // Load departments when component mounts
  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddCardToDashboard = (card: ActionCardItem) => {
    toast({
      title: "Card adicionado",
      description: "O card foi adicionado ao dashboard.",
      variant: "success"
    });
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
          <Card className="border rounded-lg overflow-hidden bg-white h-full">
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
      
      {/* Modals */}
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
