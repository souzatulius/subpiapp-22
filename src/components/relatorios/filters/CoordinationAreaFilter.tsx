
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/relatorios/types';

interface CoordinationAreaFilterProps {
  coordinationAreas: FilterOptions['coordinationAreas'];
  onCoordinationAreaChange: (area: string) => void;
}

const CoordinationAreaFilter: React.FC<CoordinationAreaFilterProps> = ({ 
  coordinationAreas, 
  onCoordinationAreaChange 
}) => {
  return (
    <div className="space-y-2">
      <Label>Área de Coordenação</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por área" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Comunicação', 'Obras', 'Serviços Urbanos', 'Planejamento', 'Cultura', 'Administração'].map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox 
                  id={`area-${area}`} 
                  checked={coordinationAreas.includes(area as any)}
                  onCheckedChange={() => onCoordinationAreaChange(area)}
                />
                <label 
                  htmlFor={`area-${area}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {area}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CoordinationAreaFilter;
