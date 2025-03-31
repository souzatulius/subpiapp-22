
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardPreview from './DashboardPreview';
import DashboardControls from './DashboardControls';
import CardLibrary from './CardLibrary';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Plus, Import, Export, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CardCustomizationModal from '@/components/dashboard/card-customization/CardCustomizationModal';
import { ActionCardItem } from '@/types/dashboard';
import { useDefaultDashboardState } from '@/hooks/dashboard-management/useDefaultDashboardState';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const DashboardManagementContent: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [targetDepartment, setTargetDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<{id: string; descricao: string; sigla?: string}[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState('');
  
  const {
    config,
    saveDefaultDashboard,
    isLoading,
    isSaving,
  } = useDefaultDashboardConfig(selectedDepartment);
  
  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');
          
        if (error) throw error;
        setDepartments(data || []);
        
        // Set first department as default if none selected
        if (!selectedDepartment && data && data.length > 0) {
          setSelectedDepartment(data[0].id);
        }
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };
    
    fetchDepartments();
  }, [selectedDepartment]);

  // Function to add a card to the current dashboard
  const handleAddCardToDashboard = (card: ActionCardItem) => {
    // Implementation will be handled by the DashboardPreview component
    toast({
      title: "Card adicionado",
      description: "O card foi adicionado ao dashboard.",
      variant: "success"
    });
  };
  
  // Handle duplicate dashboard configuration
  const handleDuplicateDashboard = async () => {
    if (!selectedDepartment || !targetDepartment) {
      toast({
        title: "Erro",
        description: "Selecione uma coordenação de origem e destino.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Fetch source dashboard configuration
      const { data: sourceData, error: sourceError } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('dashboard_type', selectedViewType)
        .single();
        
      if (sourceError && sourceError.code !== 'PGRST116') throw sourceError;
      
      if (!sourceData || !sourceData.cards_config) {
        toast({
          title: "Erro",
          description: "Não foi possível encontrar a configuração de dashboard da coordenação de origem.",
          variant: "destructive"
        });
        return;
      }
      
      // Save to target department
      const { error: saveError } = await supabase
        .from('department_dashboards')
        .upsert({
          department: targetDepartment,
          dashboard_type: selectedViewType,
          cards_config: sourceData.cards_config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,dashboard_type'
        });
      
      if (saveError) throw saveError;
      
      toast({
        title: "Dashboard duplicado",
        description: "A configuração foi copiada com sucesso.",
        variant: "success"
      });
      
      setIsDuplicateModalOpen(false);
    } catch (error) {
      console.error("Error duplicating dashboard:", error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o dashboard. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Handle export dashboard configuration
  const handleExportDashboard = async () => {
    try {
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('dashboard_type', selectedViewType)
        .single();
      
      if (error) throw error;
      
      if (data && data.cards_config) {
        const exportObj = {
          department: selectedDepartment,
          dashboard_type: selectedViewType,
          cards_config: JSON.parse(data.cards_config),
          exported_at: new Date().toISOString()
        };
        
        setExportData(JSON.stringify(exportObj, null, 2));
        setIsExportModalOpen(true);
      } else {
        toast({
          title: "Aviso",
          description: "Não há configuração para exportar.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error exporting dashboard:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar a configuração.",
        variant: "destructive"
      });
    }
  };
  
  // Handle import dashboard configuration
  const handleImportDashboard = async () => {
    try {
      // Parse and validate the imported JSON
      const importedData = JSON.parse(importData);
      
      if (!importedData.cards_config || !Array.isArray(importedData.cards_config)) {
        throw new Error("Formato inválido. É necessário um array 'cards_config'.");
      }
      
      // Save the imported configuration to the selected department
      const { error } = await supabase
        .from('department_dashboards')
        .upsert({
          department: selectedDepartment,
          dashboard_type: selectedViewType,
          cards_config: JSON.stringify(importedData.cards_config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,dashboard_type'
        });
      
      if (error) throw error;
      
      toast({
        title: "Importação concluída",
        description: "A configuração de dashboard foi importada com sucesso.",
        variant: "success"
      });
      
      setIsImportModalOpen(false);
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error importing dashboard:", error);
      toast({
        title: "Erro de importação",
        description: error instanceof Error ? error.message : "Formato de JSON inválido.",
        variant: "destructive"
      });
    }
  };
  
  // Handle restore default dashboard
  const handleRestoreDefault = async () => {
    try {
      // Delete the current configuration to reset to default
      await supabase
        .from('department_dashboards')
        .delete()
        .eq('department', selectedDepartment)
        .eq('dashboard_type', selectedViewType);
      
      toast({
        title: "Dashboard restaurado",
        description: "O dashboard foi restaurado para o modelo padrão.",
        variant: "success"
      });
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error restoring default dashboard:", error);
      toast({
        title: "Erro",
        description: "Não foi possível restaurar o dashboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar with controls and card library */}
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
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDuplicateModalOpen(true)}>
              <Copy className="h-4 w-4 mr-1" /> Duplicar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportDashboard}>
              <Export className="h-4 w-4 mr-1" /> Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
              <Import className="h-4 w-4 mr-1" /> Importar
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestoreDefault}>
              <RotateCcw className="h-4 w-4 mr-1" /> Resetar
            </Button>
          </div>
          
          {/* Card Library */}
          <div className="h-full mt-4">
            <CardLibrary 
              onAddCard={handleAddCardToDashboard}
              selectedDepartment={selectedDepartment}
              selectedDashboardType={selectedViewType}
            />
          </div>
        </div>
        
        {/* Main preview area */}
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
          // This will be handled by DashboardPreview
          setIsCreateCardModalOpen(false);
        }}
        initialData={null}
      />
      
      {/* Duplicate Dashboard Modal */}
      <Dialog open={isDuplicateModalOpen} onOpenChange={setIsDuplicateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Duplicar Dashboard</DialogTitle>
          <DialogDescription>
            Selecione a coordenação de destino para copiar a configuração atual do dashboard.
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Origem:</Label>
              <div className="col-span-3">{departments.find(d => d.id === selectedDepartment)?.descricao || 'Coordenação não selecionada'}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Destino:</Label>
              <div className="col-span-3">
                <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coordenação de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter(dept => dept.id !== selectedDepartment)
                      .map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.descricao}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDuplicateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicateDashboard}>
              Duplicar Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Export Dashboard Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
          <DialogTitle>Exportar Dashboard</DialogTitle>
          <DialogDescription>
            Copie o JSON abaixo para salvar a configuração do dashboard.
          </DialogDescription>
          
          <div className="mt-4 bg-gray-50 p-2 rounded-md">
            <textarea 
              className="w-full h-64 p-2 font-mono text-sm bg-gray-50 border-0 focus:ring-0" 
              value={exportData}
              readOnly
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(exportData);
                toast({
                  title: "Copiado",
                  description: "O JSON foi copiado para a área de transferência.",
                  variant: "success"
                });
              }}
            >
              Copiar JSON
            </Button>
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Import Dashboard Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
          <DialogTitle>Importar Dashboard</DialogTitle>
          <DialogDescription>
            Cole o JSON da configuração do dashboard para importar.
          </DialogDescription>
          
          <div className="mt-4">
            <textarea 
              className="w-full h-64 p-2 font-mono text-sm border rounded-md" 
              placeholder='{"cards_config": [...], "dashboard_type": "dashboard"}'
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleImportDashboard}
              disabled={!importData.trim()}
            >
              Importar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for the duplicate modal
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm font-medium ${className}`}>{children}</div>
);

// Helper component for the duplicate modal
const Copy = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

export default DashboardManagementContent;
