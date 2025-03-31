
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export interface Department {
  id: string;
  descricao: string;
  sigla?: string;
}

export const useDashboardManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedViewType, setSelectedViewType] = useState<'dashboard' | 'communication'>('dashboard');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [targetDepartment, setTargetDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Function to duplicate dashboard from one department to another
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
      setIsSaving(true);
      const { data: sourceData, error: sourceError } = await supabase
        .from('department_dashboards')
        .select('cards_config')
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType)
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
      
      const { error: saveError } = await supabase
        .from('department_dashboards')
        .upsert({
          department: targetDepartment,
          view_type: selectedViewType,
          cards_config: sourceData.cards_config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
    } finally {
      setIsSaving(false);
    }
  };

  // Load departments from the database
  const loadDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('coordenacoes')
        .select('id, descricao, sigla')
        .order('descricao');
          
      if (error) throw error;
      setDepartments(data || []);
      
      if (!selectedDepartment && data && data.length > 0) {
        setSelectedDepartment(data[0].id);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  return {
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
    setDepartments,
    loadDepartments,
    handleDuplicateDashboard,
    isSaving
  };
};
