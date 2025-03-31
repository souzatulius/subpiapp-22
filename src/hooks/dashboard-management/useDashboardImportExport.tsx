
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDashboardImportExport = (selectedDepartment: string, selectedViewType: 'dashboard' | 'communication') => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState('');

  const handleExportDashboard = async () => {
    try {
      const { data, error } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
        .single();
      
      if (error) throw error;
      
      if (data && data.cards_config) {
        const exportObj = {
          department: selectedDepartment,
          view_type: selectedViewType,
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
  
  const handleImportDashboard = async () => {
    try {
      const importedData = JSON.parse(importData);
      
      if (!importedData.cards_config || !Array.isArray(importedData.cards_config)) {
        throw new Error("Formato inválido. É necessário um array 'cards_config'.");
      }
      
      const { error } = await supabase
        .from('department_dashboards')
        .upsert({
          department: selectedDepartment,
          view_type: selectedViewType,
          cards_config: JSON.stringify(importedData.cards_config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'department,view_type'
        });
      
      if (error) throw error;
      
      toast({
        title: "Importação concluída",
        description: "A configuração de dashboard foi importada com sucesso.",
        variant: "success"
      });
      
      setIsImportModalOpen(false);
      
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
  
  const handleRestoreDefault = async () => {
    try {
      await supabase
        .from('department_dashboards')
        .delete()
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType);
      
      toast({
        title: "Dashboard restaurado",
        description: "O dashboard foi restaurado para o modelo padrão.",
        variant: "success"
      });
      
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

  return {
    isExportModalOpen,
    setIsExportModalOpen,
    exportData,
    setExportData,
    isImportModalOpen,
    setIsImportModalOpen,
    importData,
    setImportData,
    handleExportDashboard,
    handleImportDashboard,
    handleRestoreDefault
  };
};
