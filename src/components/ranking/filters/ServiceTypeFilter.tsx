
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/ranking/types';

interface ServiceTypeFilterProps {
  serviceTypes: FilterOptions['serviceTypes'];
  onServiceTypeChange: (type: string) => void;
}

const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({ serviceTypes, onServiceTypeChange }) => {
  return (
    <div className="space-y-2">
      <Label>Tipo de Serviço</Label>
      <Select>
        <SelectTrigger className="border-orange-200">
          <SelectValue placeholder="Filtrar por serviço" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Tapa-buraco', 'Poda de árvore', 'Recapeamento', 'Limpeza de boca de lobo', 'Manutenção de calçada'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={serviceTypes.includes(type as any)}
                  onCheckedChange={() => onServiceTypeChange(type)}
                  className="border-orange-400 data-[state=checked]:bg-orange-600"
                />
                <label 
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceTypeFilter;
