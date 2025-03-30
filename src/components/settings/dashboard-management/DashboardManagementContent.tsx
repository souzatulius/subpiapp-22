
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardPreview from './DashboardPreview';
import DashboardControls from './DashboardControls';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { FormSchema } from '@/components/dashboard/card-customization/types';
import { ActionCardItem } from '@/types/dashboard';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import { toast } from '@/hooks/use-toast';

const DashboardManagementContent: React.FC = () => {
  const {
    defaultDashboards,
    selectedDepartment,
    setSelectedDepartment,
    selectedViewType,
    setSelectedViewType,
    isLoading,
    isSaving,
    saveDefaultDashboard,
  } = useDefaultDashboardConfig();
  
  const [departmentName, setDepartmentName] = useState('');
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (selectedDepartment && selectedDepartment !== 'default') {
        try {
          const { data, error } = await supabase
            .from('areas_coordenacao')
            .select('descricao')
            .eq('id', selectedDepartment)
            .single();
          
          if (error) {
            console.error('Error fetching department name:', error);
            return;
          }
          
          if (data) {
            setDepartmentName(data.descricao);
          }
        } catch (error) {
          console.error('Failed to fetch department name:', error);
        }
      } else {
        setDepartmentName(selectedDepartment === 'default' ? 'Padrão (Todos)' : '');
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DashboardControls
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
          />
          
          <div className="mt-6">
            <Button 
              onClick={handleOpenCreateCardModal}
              className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Card
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              Visualização: {selectedViewType === 'dashboard' ? 'Dashboard' : 'Comunicação'}
              {departmentName ? ` - ${departmentName}` : ''}
            </h2>
            <Button 
              onClick={saveDefaultDashboard} 
              disabled={isLoading || isSaving}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar como Padrão
                </>
              )}
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando dashboard...</span>
              </div>
            ) : (
              <DashboardPreview 
                dashboardType={selectedViewType} 
                department={selectedDepartment}
                onAddNewCard={handleOpenCreateCardModal}
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
