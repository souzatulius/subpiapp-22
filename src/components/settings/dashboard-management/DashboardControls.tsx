
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Plus, Smartphone, Monitor, Loader2, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Department {
  id: string;
  descricao: string;
  sigla: string;
}

interface DashboardControlsProps {
  selectedDepartment: string;
  setSelectedDepartment: (departmentId: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (viewType: 'dashboard' | 'communication') => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (isMobile: boolean) => void;
  onAddNewCard: () => void;
  onSaveDashboard: () => Promise<boolean>;
  onResetDashboards?: () => Promise<boolean>;
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
  onResetDashboards,
  isSaving
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');

        if (error) throw error;
        setDepartments(data || []);

        // If no department is selected yet, select the first one or default
        if (!selectedDepartment && data && data.length > 0) {
          setSelectedDepartment(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as coordenações',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSave = async () => {
    const result = await onSaveDashboard();
    if (result) {
      toast({
        title: 'Dashboard salvo',
        description: 'As configurações foram salvas com sucesso',
        variant: 'success'
      });
    }
  };

  const handleReset = async () => {
    if (onResetDashboards) {
      const result = await onResetDashboards();
      if (result) {
        toast({
          title: 'Dashboard resetado',
          description: 'Todos os dashboards foram resetados para as configurações padrão',
          variant: 'success'
        });
        setIsResetDialogOpen(false);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Coordenação</Label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              disabled={isLoading}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão (Todos)</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.sigla || dept.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="viewType">Tipo de Dashboard</Label>
            <Select
              value={selectedViewType}
              onValueChange={(value) => setSelectedViewType(value as 'dashboard' | 'communication')}
            >
              <SelectTrigger id="viewType">
                <SelectValue placeholder="Selecione o tipo de dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Principal</SelectItem>
                <SelectItem value="communication">Comunicação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="mobilePreview" className="cursor-pointer">
              <div className="flex items-center">
                {isMobilePreview ? (
                  <Smartphone className="mr-2 h-5 w-5 text-orange-500" />
                ) : (
                  <Monitor className="mr-2 h-5 w-5 text-blue-500" />
                )}
                <span>
                  {isMobilePreview ? "Visualização Mobile" : "Visualização Desktop"}
                </span>
              </div>
            </Label>
            <Switch
              id="mobilePreview"
              checked={isMobilePreview}
              onCheckedChange={setIsMobilePreview}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onAddNewCard}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
              
              {onResetDashboards && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsResetDialogOpen(true)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Resetar
                </Button>
              )}
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" /> Salvar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar todos os dashboards?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá resetar as configurações do dashboard para todos os usuários.
              Todos os cards personalizados serão removidos.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DashboardControls;
