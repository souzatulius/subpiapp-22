import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartFilters } from '../types';

interface LocationFiltersProps {
  filters: ChartFilters;
  distritos: string[];
  bairros: string[];
  onFilterChange: (key: keyof ChartFilters, value: string | null) => void;
}

const LocationFilters: React.FC<LocationFiltersProps> = ({ 
  filters, 
  distritos, 
  bairros, 
  onFilterChange 
}) => {
  const [filteredBairros, setFilteredBairros] = useState<string[]>(bairros);
  
  useEffect(() => {
    if (filters.distrito) {
      setFilteredBairros(bairros);
    } else {
      setFilteredBairros(bairros);
    }
  }, [filters.distrito, bairros]);
  
  return (
    <>
      {/* District filter */}
      <div className="space-y-2">
        <Label htmlFor="distrito">Distrito</Label>
        <Select
          value={filters.distrito || "_all"}
          onValueChange={(value) => onFilterChange('distrito', value === "_all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um distrito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos os distritos</SelectItem>
            {distritos.map((distrito) => (
              <SelectItem key={distrito} value={distrito}>
                {distrito}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Neighborhood filter */}
      <div className="space-y-2">
        <Label htmlFor="bairro">Bairro</Label>
        <Select
          value={filters.bairro || "_all"}
          onValueChange={(value) => onFilterChange('bairro', value === "_all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Todos os bairros</SelectItem>
            {filteredBairros.map((bairro) => (
              <SelectItem key={bairro} value={bairro}>
                {bairro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LocationFilters;
