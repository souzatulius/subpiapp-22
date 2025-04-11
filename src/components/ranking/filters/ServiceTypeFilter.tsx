
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/ranking/types';

interface ServiceTypeFilterProps {
  serviceTypes: FilterOptions['serviceTypes'];
  onServiceTypeChange: (types: string[]) => void; // Changed from (type: string) => void
}

const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({ serviceTypes, onServiceTypeChange }) => {
  const types = ['Todos', 'Iluminação', 'Buraco', 'Entulho', 'Esgoto'];
  
  const handleTypeChange = (type: string) => {
    if (type === 'Todos') {
      onServiceTypeChange(['Todos']);
    } else {
      // Remove 'Todos' if it's in the array and add the new type
      const currentTypes = serviceTypes || [];
      const newTypes = currentTypes.includes('Todos')
        ? [type]
        : currentTypes.includes(type)
          ? currentTypes.filter(t => t !== type)
          : [...currentTypes, type];
      
      // If no types are selected, select 'Todos'
      if (newTypes.length === 0) {
        onServiceTypeChange(['Todos']);
      } else {
        onServiceTypeChange(newTypes);
      }
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tipos de Serviço</h3>
      <div className="space-y-1">
        {types.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`}
              checked={serviceTypes ? serviceTypes.includes(type) : false}
              onCheckedChange={() => handleTypeChange(type)}
            />
            <Label 
              htmlFor={`type-${type}`}
              className="text-sm cursor-pointer"
            >
              {type}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypeFilter;
