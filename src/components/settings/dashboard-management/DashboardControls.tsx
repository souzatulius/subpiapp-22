
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Save, Smartphone, Monitor } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Coordination {
  id: string;
  descricao: string;
  sigla?: string;
}

interface DashboardControlsProps {
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedViewType: 'dashboard' | 'communication';
  setSelectedViewType: (viewType: 'dashboard' | 'communication') => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (isMobile: boolean) => void;
  onAddNewCard: () => void;
  onSaveDashboard: () => void;
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
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCoordinations() {
      try {
        setIsLoading(true);
        
        // Fetch coordinations from areas_coordenacao where is_supervision is false
        const { data, error } = await supabase
          .from('areas_coordenacao')
          .select('id, descricao, sigla')
          .eq('is_supervision', false)
          .order('descricao');
        
        if (error) {
          console.error('Error fetching coordinations:', error);
          return;
        }
        
        setCoordinations(data || []);
      } catch (error) {
        console.error('Failed to fetch coordinations:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCoordinations();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Visualizar como</Label>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Select 
              value={selectedDepartment} 
              onValueChange={(value) => setSelectedDepartment(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão (Todos)</SelectItem>
                {coordinations.map((coordination) => (
                  <SelectItem key={coordination.id} value={coordination.id}>
                    {coordination.descricao}
                    {coordination.sigla ? ` (${coordination.sigla})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-3">
          <Label>Tipo de visualização</Label>
          <RadioGroup 
            value={selectedViewType} 
            onValueChange={(value) => setSelectedViewType(value as 'dashboard' | 'communication')}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dashboard" id="dashboard" />
              <Label htmlFor="dashboard" className="cursor-pointer">Dashboard Inicial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="communication" id="communication" />
              <Label htmlFor="communication" className="cursor-pointer">Página de Comunicação</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Formato da Tela</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="mobile-preview"
              checked={isMobilePreview}
              onCheckedChange={setIsMobilePreview}
              className="data-[state=checked]:bg-orange-500"
            />
            <div className="flex items-center justify-between flex-1">
              <Label htmlFor="mobile-preview" className="flex items-center text-sm text-gray-600">
                {isMobilePreview ? (
                  <>
                    <Smartphone className="h-4 w-4 mr-1" /> 
                    Mobile
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4 mr-1" /> 
                    Desktop
                  </>
                )}
              </Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Button 
          onClick={onAddNewCard}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Card
        </Button>
        
        <Button 
          onClick={onSaveDashboard} 
          disabled={isSaving}
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Padrão
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardControls;
