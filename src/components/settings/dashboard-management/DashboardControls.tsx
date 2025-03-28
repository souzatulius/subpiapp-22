
import React from 'react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Escolha as opções de visualização</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Visualizar como</Label>
          <Select 
            value={selectedDepartment} 
            onValueChange={(value) => setSelectedDepartment(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão (Todos)</SelectItem>
              <SelectItem value="comunicacao">Coordenação de Comunicação</SelectItem>
              <SelectItem value="zeladoria">Coordenação de Zeladoria</SelectItem>
              <SelectItem value="tecnologia">Coordenação de Tecnologia</SelectItem>
              <SelectItem value="administracao">Coordenação Administrativa</SelectItem>
              <SelectItem value="financeira">Coordenação Financeira</SelectItem>
            </SelectContent>
          </Select>
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
