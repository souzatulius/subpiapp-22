
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FilterOptions } from '@/components/ranking/types';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onDateRangeClear: () => void;
  onStatusChange: (status: string) => void;
  onServiceTypeChange: (type: string) => void;
  onDistrictChange: (district: string) => void;
  onClearAllFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onDateRangeClear,
  onStatusChange,
  onServiceTypeChange,
  onDistrictChange,
  onClearAllFilters
}) => {
  const hasActiveFilters = 
    filters.dateRange?.from || 
    filters.statuses[0] !== 'Todos' || 
    filters.serviceTypes[0] !== 'Todos' || 
    filters.districts[0] !== 'Todos';

  if (!hasActiveFilters) return null;

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
      
      {filters.statuses[0] !== 'Todos' && filters.statuses.map(status => (
        <Badge key={status} variant="secondary" className="flex items-center gap-1">
          <span>Status: {status}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onStatusChange(status)}
          >
            ✕
          </Button>
        </Badge>
      ))}
      
      {filters.serviceTypes[0] !== 'Todos' && filters.serviceTypes.map(type => (
        <Badge key={type} variant="secondary" className="flex items-center gap-1">
          <span>Serviço: {type}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onServiceTypeChange(type)}
          >
            ✕
          </Button>
        </Badge>
      ))}
      
      {filters.districts[0] !== 'Todos' && filters.districts.map(district => (
        <Badge key={district} variant="secondary" className="flex items-center gap-1">
          <span>Distrito: {district}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onDistrictChange(district)}
          >
            ✕
          </Button>
        </Badge>
      ))}
      
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
