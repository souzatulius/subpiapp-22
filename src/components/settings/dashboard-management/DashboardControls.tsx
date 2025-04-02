
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, RefreshCw, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface DashboardControlsProps {
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (viewType: 'dashboard' | 'communication') => void;
  onAddNewCard: () => void;
  onSaveDashboard: () => Promise<boolean>;
  onResetDashboards?: () => Promise<boolean>;
  isSaving: boolean;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  selectedViewType,
  setSelectedViewType,
  onAddNewCard,
  onSaveDashboard,
  onResetDashboards,
  isSaving
}) => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { toast } = useToast();

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

          <div className="flex flex-col space-y-2 pt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onAddNewCard}
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar
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
