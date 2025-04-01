
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface Department {
  id: string;
  descricao: string;
  sigla: string | null;
}

interface DashboardControlsProps {
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (viewType: 'dashboard' | 'communication') => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (isMobile: boolean) => void;
  onAddNewCard: () => void;
  onSaveDashboard: () => Promise<boolean>;
  isSaving: boolean;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  selectedViewType,
  setSelectedViewType,
  isMobilePreview,
  setIsMobilePreview,
  onAddNewCard,
  onSaveDashboard,
  isSaving
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao', { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          setDepartments(data);
          // Set default selection if none selected
          if (!selectedDepartment && data.length > 0) {
            setSelectedDepartment(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, [setSelectedDepartment, selectedDepartment]);

  const handleResetDashboard = async () => {
    setIsResetting(true);
    try {
      // Delete the department dashboard config first
      const { error: deleteDashboardError } = await supabase
        .from('department_dashboards')
        .delete()
        .eq('department', selectedDepartment)
        .eq('view_type', selectedViewType);

      if (deleteDashboardError) {
        throw deleteDashboardError;
      }

      // Reset all user dashboard configs for this department
      const { error: updateUserDashboardsError } = await supabase
        .from('user_dashboard')
        .delete()
        .eq('department_id', selectedDepartment);

      // Note: We're not reporting this error as it's non-critical
      if (updateUserDashboardsError) {
        console.warn('Could not reset user dashboards:', updateUserDashboardsError);
      }

      // Reload the page to reset the dashboard state
      window.location.reload();
    } catch (error) {
      console.error('Error resetting dashboard:', error);
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  // Find the current department name or acronym to display
  const getDepartmentDisplay = () => {
    const currentDept = departments.find(d => d.id === selectedDepartment);
    return currentDept?.sigla || currentDept?.descricao || 'Selecione uma coordenação';
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border shadow-sm">
      <div>
        <h3 className="text-lg font-medium mb-4">Controles do Dashboard</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Coordenação</Label>
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
              disabled={isLoading}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Selecione uma coordenação">
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  ) : (
                    getDepartmentDisplay()
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.sigla || department.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="view-type">Tipo de Visualização</Label>
            <Select 
              value={selectedViewType} 
              onValueChange={(value) => setSelectedViewType(value as 'dashboard' | 'communication')}
            >
              <SelectTrigger id="view-type">
                <SelectValue placeholder="Selecione um tipo">
                  {selectedViewType === 'dashboard' ? 'Dashboard' : 'Comunicação'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="communication">Comunicação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setIsMobilePreview(false)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  !isMobilePreview 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setIsMobilePreview(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isMobilePreview 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4">
        <Button onClick={onAddNewCard} variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        
        <div className="flex flex-col space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setShowResetConfirm(true)} 
                  variant="outline" 
                  className="w-full justify-start border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  Resetar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restaura o dashboard padrão para todos os usuários desta coordenação</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            onClick={onSaveDashboard} 
            disabled={isSaving}
            className="w-full justify-start"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar Dashboard da Coordenação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá restaurar o dashboard padrão para todos os usuários desta coordenação. 
              Todas as personalizações individuais serão perdidas. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetDashboard}
              className="bg-red-600 hover:bg-red-700"
            >
              Resetar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardControls;
