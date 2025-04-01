
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw, RefreshCw, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardControlsProps {
  dashboardType: 'dashboard' | 'communication';
  department: string;
  onDepartmentChange: (department: string) => void;
  onResetDashboard: () => Promise<void>;
  onSaveDashboard: () => Promise<void>;
}

export const DashboardControls: React.FC<DashboardControlsProps> = ({ 
  dashboardType,
  department,
  onDepartmentChange,
  onResetDashboard,
  onSaveDashboard
}) => {
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(department);
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch departments list
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');

        if (error) {
          throw error;
        }

        if (data) {
          setDepartments(data);
          
          // Set default department if none selected
          if (!selectedDepartment && data.length > 0) {
            setSelectedDepartment(data[0].id);
            onDepartmentChange(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Falha ao carregar departamentos',
          variant: 'destructive'
        });
      }
    };

    fetchDepartments();
  }, [setSelectedDepartment, selectedDepartment]);

  // Fix the handleResetDashboard function to avoid recursive types
  const handleResetDashboard = async () => {
    setIsResetting(true);
    try {
      await onResetDashboard();
      toast({
        title: 'Dashboard resetado',
        description: 'O dashboard padrão foi restaurado com sucesso',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error resetting dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao resetar o dashboard',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSaveDashboard = async () => {
    setIsSaving(true);
    try {
      await onSaveDashboard();
      toast({
        title: 'Dashboard salvo',
        description: 'As configurações do dashboard foram salvas com sucesso',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao salvar o dashboard',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    onDepartmentChange(value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
      <div className="md:w-64">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Departamento
        </label>
        <Select 
          value={selectedDepartment} 
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resetar Dashboard</AlertDialogTitle>
              <AlertDialogDescription>
                Isso irá reverter o dashboard para as configurações padrão. 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetDashboard} disabled={isResetting}>
                {isResetting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Sim, resetar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button onClick={handleSaveDashboard} disabled={isSaving}>
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar como padrão
        </Button>
      </div>
    </div>
  );
};
