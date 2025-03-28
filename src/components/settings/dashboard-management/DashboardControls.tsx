
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

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
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  selectedViewType,
  setSelectedViewType
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
        <CardDescription>Escolha as opções de visualização</CardDescription>
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
      </CardContent>
    </Card>
  );
};

export default DashboardControls;
