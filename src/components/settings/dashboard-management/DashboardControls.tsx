
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { MoveHorizontal, Save, Plus, Smartphone, Monitor } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DashboardControlsProps {
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (value: 'dashboard' | 'communication') => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (value: boolean) => void;
  onAddNewCard: () => void;
  onSaveDashboard: () => void;
  isSaving: boolean;
}

interface Department {
  id: string;
  descricao: string;
  sigla?: string;
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
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');

        if (error) {
          console.error('Error fetching departments:', error);
          return;
        }

        setDepartments(data || []);
        // Set default department if none selected
        if (!selectedDepartment && data && data.length > 0) {
          setSelectedDepartment(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Function to format department display text with acronym if available
  const getDepartmentDisplayText = (dept: Department): string => {
    if (dept.sigla) {
      return `${dept.descricao} (${dept.sigla})`;
    }
    return dept.descricao;
  };

  return (
    <div className="border rounded-lg bg-white p-4 space-y-6">
      <h2 className="text-lg font-semibold mb-4">Controles do Dashboard</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="department">Coordenação</Label>
          {isLoadingDepartments ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500">Carregando coordenações...</span>
            </div>
          ) : (
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {getDepartmentDisplayText(dept)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="viewType">Tipo de Visualização</Label>
          <Select 
            value={selectedViewType} 
            onValueChange={(value) => setSelectedViewType(value as 'dashboard' | 'communication')}
          >
            <SelectTrigger id="viewType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard Padrão</SelectItem>
              <SelectItem value="communication">Comunicação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="mobilePreview" 
            checked={isMobilePreview}
            onCheckedChange={setIsMobilePreview}
            className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-blue-500"
          />
          <Label htmlFor="mobilePreview" className="cursor-pointer flex items-center">
            {isMobilePreview ? 
              <Smartphone className="h-4 w-4 mr-2 text-orange-500" /> : 
              <Monitor className="h-4 w-4 mr-2 text-blue-500" />
            }
            {isMobilePreview ? "Visualização Mobile" : "Visualização Desktop"}
          </Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Button 
          onClick={onAddNewCard} 
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Novo Card
        </Button>

        <Button 
          onClick={onSaveDashboard} 
          variant="default" 
          size="sm"
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Salvar Dashboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardControls;
