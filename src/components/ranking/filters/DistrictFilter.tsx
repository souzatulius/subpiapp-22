
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/ranking/types';

interface DistrictFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
}

const DistrictFilter: React.FC<DistrictFilterProps> = ({ filters, onFiltersChange }) => {
  const distritos = ['Todos', 'Pinheiros', 'Alto de Pinheiros', 'Itaim Bibi', 'Jardim Paulista'];
  
  const handleDistrictsChange = (district: string) => {
    if (district === 'Todos') {
      onFiltersChange({ distritos: ['Todos'] });
    } else {
      // Remove 'Todos' if it's in the array and add the new district
      const currentDistritos = filters.distritos || [];
      const newDistritos = currentDistritos.includes('Todos') 
        ? [district]
        : currentDistritos.includes(district)
          ? currentDistritos.filter(d => d !== district)
          : [...currentDistritos, district];
      
      // If no districts are selected, select 'Todos'
      if (newDistritos.length === 0) {
        onFiltersChange({ distritos: ['Todos'] });
      } else {
        onFiltersChange({ distritos: newDistritos });
      }
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Distritos</h3>
      <div className="space-y-1">
        {distritos.map((district) => (
          <div key={district} className="flex items-center space-x-2">
            <Checkbox 
              id={`district-${district}`}
              checked={filters.distritos ? filters.distritos.includes(district) : false}
              onCheckedChange={() => handleDistrictsChange(district)}
            />
            <Label 
              htmlFor={`district-${district}`}
              className="text-sm cursor-pointer"
            >
              {district}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictFilter;
