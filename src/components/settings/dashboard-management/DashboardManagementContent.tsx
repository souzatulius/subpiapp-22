
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DashboardDesigner from './DashboardDesigner';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import DashboardPreview from './DashboardPreview';
import DashboardCardLibrary from './DashboardCardLibrary';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const DashboardManagementContent: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('default');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [pageType, setPageType] = useState<'dashboard' | 'communication'>('dashboard');
  
  const {
    config,
    setConfig,
    isLoading,
    isSaving,
    saveConfig,
    resetAllDashboards
  } = useDefaultDashboardConfig(selectedDepartment, pageType);

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };
  
  const handlePageTypeChange = (type: 'dashboard' | 'communication') => {
    console.log('Page type changed to:', type);
    setPageType(type);
  };

  const handleSave = async () => {
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
    const confirmed = window.confirm(
      "Tem certeza que deseja resetar todos os dashboards para a configuração padrão? Esta ação não pode ser desfeita."
    );
    
    if (confirmed) {
      const result = await resetAllDashboards();
      if (result) {
        toast({
          title: "Dashboards resetados",
          description: "Todas as configurações foram resetadas para o padrão",
          variant: "success"
        });
      }
      return result;
    }
    return false;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="designer">
          <TabsList className="mb-6">
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="library">Biblioteca de Cards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="designer">
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
              />
            </div>
          </TabsContent>
          
          <TabsContent value="library">
            <DashboardCardLibrary />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardManagementContent;
