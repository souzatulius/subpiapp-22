
import React from 'react';
import { X } from 'lucide-react';
import { FilterOptions } from '../types';

interface ActiveFilterBadgesProps {
  filters: FilterOptions;
  onRemoveFilter: (type: string, value: string) => void;
}

const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({ 
  filters, 
  onRemoveFilter 
}) => {
  // Only show tags for active filters (that aren't 'Todos')
  const hasActiveStatuses = filters.statuses && 
    filters.statuses.length > 0 && 
    !filters.statuses.includes('Todos');
  
  const hasActiveDistricts = filters.districts && 
    filters.districts.length > 0 && 
    !filters.districts.includes('Todos');
  
  const hasActiveServiceTypes = filters.serviceTypes && 
    filters.serviceTypes.length > 0 && 
    !filters.serviceTypes.includes('Todos');
  
  const hasActiveDateRange = filters.dateRange && 
    (filters.dateRange.from || filters.dateRange.to);
  
  const hasActiveFilters = hasActiveStatuses || 
    hasActiveDistricts || 
    hasActiveServiceTypes || 
    hasActiveDateRange;
  
  if (!hasActiveFilters) {
    return null;
  }
  
  return (
    <div className="mt-3">
      <div className="text-sm font-medium text-gray-700 mb-1">Filtros ativos</div>
      <div className="flex flex-wrap gap-2">
        {hasActiveStatuses && filters.statuses?.map(status => (
          status !== 'Todos' && (
            <span 
              key={`status-${status}`} 
              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              Status: {status}
              <button 
                onClick={() => onRemoveFilter('status', status)}
                className="ml-1 rounded-full hover:bg-orange-200 p-0.5"
                aria-label={`Remover filtro de status ${status}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        ))}
        
        {hasActiveDistricts && filters.districts?.map(district => (
          district !== 'Todos' && (
            <span 
              key={`district-${district}`} 
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              Distrito: {district}
              <button 
                onClick={() => onRemoveFilter('district', district)}
                className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
                aria-label={`Remover filtro de distrito ${district}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        ))}
        
        {hasActiveServiceTypes && filters.serviceTypes?.map(serviceType => (
          serviceType !== 'Todos' && (
            <span 
              key={`service-${serviceType}`} 
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              Serviço: {serviceType}
              <button 
                onClick={() => onRemoveFilter('serviceType', serviceType)}
                className="ml-1 rounded-full hover:bg-green-200 p-0.5"
                aria-label={`Remover filtro de serviço ${serviceType}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        ))}
        
        {hasActiveDateRange && (
          <span 
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            Período: {filters.dateRange?.from?.toLocaleDateString()} - {filters.dateRange?.to?.toLocaleDateString() || 'atual'}
            <button 
              onClick={() => onRemoveFilter('dateRange', 'all')}
              className="ml-1 rounded-full hover:bg-purple-200 p-0.5"
              aria-label="Remover filtro de período"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ActiveFilterBadges;
