
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/relatorios/types';

interface OriginFilterProps {
  origins: FilterOptions['origins'];
  onOriginChange: (origin: string) => void;
}

const OriginFilter: React.FC<OriginFilterProps> = ({ origins, onOriginChange }) => {
  return (
    <div className="space-y-2">
      <Label>Origem da Demanda</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por origem" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Imprensa', 'Vereadores', 'Políticos', 'Demandas Internas', 'SECOM', 'Ministério Público', 'Ouvidoria'].map((origin) => (
              <div key={origin} className="flex items-center space-x-2">
                <Checkbox 
                  id={`origin-${origin}`} 
                  checked={origins.includes(origin as any)}
                  onCheckedChange={() => onOriginChange(origin)}
                />
                <label 
                  htmlFor={`origin-${origin}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {origin}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OriginFilter;
