
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/relatorios/types';

interface DistrictFilterProps {
  districts: FilterOptions['districts'];
  onDistrictChange: (district: string) => void;
}

const DistrictFilter: React.FC<DistrictFilterProps> = ({ districts, onDistrictChange }) => {
  return (
    <div className="space-y-2">
      <Label>Distrito</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por distrito" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'].map((district) => (
              <div key={district} className="flex items-center space-x-2">
                <Checkbox 
                  id={`district-${district}`} 
                  checked={districts.includes(district as any)}
                  onCheckedChange={() => onDistrictChange(district)}
                />
                <label 
                  htmlFor={`district-${district}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {district}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DistrictFilter;
