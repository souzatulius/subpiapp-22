
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartFilters } from '../types';

interface CategoryFiltersProps {
  filters: ChartFilters;
  classificacoes: string[];
  statusOptions: string[];
  onFilterChange: (key: keyof ChartFilters, value: string | null) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  filters, 
  classificacoes, 
  statusOptions, 
  onFilterChange 
}) => {
  return (
    <>
      {/* Classification filter */}
      <div className="space-y-2">
        <Label htmlFor="classificacao">Classificação</Label>
        <Select
          value={filters.classificacao || ""}
          onValueChange={(value) => onFilterChange('classificacao', value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma classificação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as classificações</SelectItem>
            {classificacoes.map((classificacao) => (
              <SelectItem key={classificacao} value={classificacao}>
                {classificacao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Status filter */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status || ""}
          onValueChange={(value) => onFilterChange('status', value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CategoryFilters;
