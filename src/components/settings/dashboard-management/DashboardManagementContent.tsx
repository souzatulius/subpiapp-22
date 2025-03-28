
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardPreview from './DashboardPreview';
import DashboardControls from './DashboardControls';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
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
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              Visualização: {selectedViewType === 'dashboard' ? 'Dashboard' : 'Comunicação'}
              {selectedDepartment !== 'default' ? ` - ${selectedDepartment}` : ''}
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardManagementContent;
