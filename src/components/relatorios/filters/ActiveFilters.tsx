
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FilterOptions } from '@/components/relatorios/types';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onDateRangeClear: () => void;
  onFilterChange: (filterType: keyof FilterOptions, value: string) => void;
  onClearAllFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onDateRangeClear,
  onFilterChange,
  onClearAllFilters
}) => {
  const hasActiveFilters = 
    filters.dateRange?.from || 
    filters.statuses[0] !== 'Todos' || 
    filters.serviceTypes[0] !== 'Todos' || 
    filters.districts[0] !== 'Todos' ||
    filters.origins[0] !== 'Todos' ||
    filters.mediaTypes[0] !== 'Todos' ||
    filters.coordinationAreas[0] !== 'Todos';

  if (!hasActiveFilters) return null;

  const renderFilterBadges = (
    filterType: keyof Omit<FilterOptions, 'dateRange'>, 
    label: string
  ) => {
    if (filters[filterType][0] === 'Todos') return null;
    
    return (filters[filterType] as string[]).map(value => (
      <Badge key={`${filterType}-${value}`} variant="secondary" className="flex items-center gap-1">
        <span>{label}: {value}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-4 w-4 p-0 ml-1"
          onClick={() => onFilterChange(filterType, value)}
        >
          ✕
        </Button>
      </Badge>
    ));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.dateRange?.from && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>Período: </span>
          {format(filters.dateRange.from, 'dd/MM/yyyy')}
          {filters.dateRange.to && ` - ${format(filters.dateRange.to, 'dd/MM/yyyy')}`}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1"
            onClick={onDateRangeClear}
          >
            ✕
          </Button>
        </Badge>
      )}
      
      {renderFilterBadges('statuses', 'Status')}
      {renderFilterBadges('serviceTypes', 'Serviço')}
      {renderFilterBadges('districts', 'Distrito')}
      {renderFilterBadges('origins', 'Origem')}
      {renderFilterBadges('mediaTypes', 'Mídia')}
      {renderFilterBadges('coordinationAreas', 'Área')}
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAllFilters}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default ActiveFilters;
