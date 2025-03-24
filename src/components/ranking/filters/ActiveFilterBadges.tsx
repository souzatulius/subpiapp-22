
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FilterOptions } from '@/components/ranking/types';

interface ActiveFilterBadgesProps {
  filters: FilterOptions;
  onRemoveFilter: (type: string, value: string) => void;
}

const formatDateforDisplay = (date: Date | string | null | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({ filters, onRemoveFilter }) => {
  const hasActiveFilters = () => {
    return (
      (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes('Todos')) ||
      (filters.districts && filters.districts.length > 0 && !filters.districts.includes('Todos')) ||
      (filters.serviceTypes && filters.serviceTypes.length > 0 && !filters.serviceTypes.includes('Todos')) ||
      filters.dateRange?.from || 
      filters.dateRange?.to
    );
  };

  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <div className="pt-6 pb-2">
      <h3 className="text-sm font-medium mb-2">Filtros ativos:</h3>
      <div className="flex flex-wrap gap-2">
        {/* Status Badges */}
        {filters.statuses && 
         filters.statuses.length > 0 && 
         !filters.statuses.includes('Todos') && 
         filters.statuses.map(status => (
          <Badge 
            key={`status-${status}`}
            variant="outline" 
            className="bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
          >
            Status: {status}
            <button 
              onClick={() => onRemoveFilter('status', status)} 
              className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* District Badges */}
        {filters.districts && 
         filters.districts.length > 0 && 
         !filters.districts.includes('Todos') && 
         filters.districts.map(district => (
          <Badge 
            key={`district-${district}`}
            variant="outline" 
            className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
          >
            Distrito: {district}
            <button 
              onClick={() => onRemoveFilter('district', district)} 
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* Service Type Badges */}
        {filters.serviceTypes && 
         filters.serviceTypes.length > 0 && 
         !filters.serviceTypes.includes('Todos') && 
         filters.serviceTypes.map(serviceType => (
          <Badge 
            key={`serviceType-${serviceType}`}
            variant="outline" 
            className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
          >
            Serviço: {serviceType}
            <button 
              onClick={() => onRemoveFilter('serviceType', serviceType)} 
              className="ml-1 hover:bg-green-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* Date Range Badge */}
        {(filters.dateRange?.from || filters.dateRange?.to) && (
          <Badge 
            variant="outline" 
            className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100"
          >
            Período: {formatDateforDisplay(filters.dateRange?.from)} - {formatDateforDisplay(filters.dateRange?.to)}
            <button 
              onClick={() => onRemoveFilter('dateRange', 'all')} 
              className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFilterBadges;
