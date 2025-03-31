
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, MessageSquareReply, Smartphone, Monitor, Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client'; 

interface Department {
  id: string;
  descricao: string;
  sigla?: string | null;
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments with sigla from Supabase
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao', { ascending: true });
        
        if (error) {
          console.error('Error fetching departments:', error);
          return;
        }
        
        // Add a default "all" option
        const allDepartments = [
          { id: 'default', descricao: 'Padrão (Todos)', sigla: 'ALL' },
          ...data
        ];
        
        setDepartments(allDepartments);
        
        if (!selectedDepartment && allDepartments.length > 0) {
          setSelectedDepartment(allDepartments[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, [selectedDepartment, setSelectedDepartment]);

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações</h3>
          
          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Coordenação</Label>
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.sigla ? dept.sigla : dept.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoading && <p className="text-xs text-gray-500">Carregando coordenações...</p>}
          </div>

          {/* Dashboard Type Selection */}
          <div className="space-y-2">
            <Label>Tipo de Dashboard</Label>
            <div className="flex space-x-2">
              <Button 
                variant={selectedViewType === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setSelectedViewType('dashboard')}
                className="flex-1"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Padrão
              </Button>
              <Button 
                variant={selectedViewType === 'communication' ? 'default' : 'outline'}
                onClick={() => setSelectedViewType('communication')}
                className="flex-1"
              >
                <MessageSquareReply className="h-4 w-4 mr-2" />
                Comunicação
              </Button>
            </div>
          </div>
          
          {/* Device Preview Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="mobile-preview">Visualização Mobile</Label>
            <div className="flex items-center space-x-2">
              <Monitor className={`h-4 w-4 ${!isMobilePreview ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch 
                id="mobile-preview" 
                checked={isMobilePreview}
                onCheckedChange={setIsMobilePreview}
              />
              <Smartphone className={`h-4 w-4 ${isMobilePreview ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
        
        {selectedViewType === 'dashboard' && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full mb-2"
              onClick={onAddNewCard}
            >
              + Adicionar Card
            </Button>
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={onSaveDashboard}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dashboard
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardControls;
