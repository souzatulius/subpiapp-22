
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterOptions, ChartVisibility } from './types';
import DateRangeFilter from './filters/DateRangeFilter';
import StatusFilter from './filters/StatusFilter';
import ServiceTypeFilter from './filters/ServiceTypeFilter';
import DistrictFilter from './filters/DistrictFilter';
import ActiveFilters from './filters/ActiveFilters';
import ChartVisibilityManager from './filters/ChartVisibilityManager';

interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  chartVisibility: ChartVisibility;
  onChartVisibilityChange: (visibility: Partial<ChartVisibility>) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  chartVisibility,
  onChartVisibilityChange
}) => {
  const handleDateRangeChange = (range: any) => {
    onFiltersChange({ dateRange: range });
  };
  
  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.statuses];
    
    if (status === 'Todos') {
      newStatuses = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Adiciona ou remove o status
      if (newStatuses.includes(status as any)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status as any);
      }
      
      // Se não houver nenhum status, adiciona 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos'];
      }
    }
    
    onFiltersChange({ statuses: newStatuses as any });
  };
  
  const handleServiceTypeChange = (type: string) => {
    let newTypes = [...filters.serviceTypes];
    
    if (type === 'Todos') {
      newTypes = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newTypes = newTypes.filter(t => t !== 'Todos');
      
      // Adiciona ou remove o tipo
      if (newTypes.includes(type as any)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type as any);
      }
      
      // Se não houver nenhum tipo, adiciona 'Todos'
      if (newTypes.length === 0) {
        newTypes = ['Todos'];
      }
    }
    
    onFiltersChange({ serviceTypes: newTypes as any });
  };
  
  const handleDistrictChange = (district: string) => {
    let newDistricts = [...filters.districts];
    
    if (district === 'Todos') {
      newDistricts = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newDistricts = newDistricts.filter(d => d !== 'Todos');
      
      // Adiciona ou remove o distrito
      if (newDistricts.includes(district as any)) {
        newDistricts = newDistricts.filter(d => d !== district);
      } else {
        newDistricts.push(district as any);
      }
      
      // Se não houver nenhum distrito, adiciona 'Todos'
      if (newDistricts.length === 0) {
        newDistricts = ['Todos'];
      }
    }
    
    onFiltersChange({ districts: newDistricts as any });
  };
  
  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos'],
      serviceTypes: ['Todos'],
      districts: ['Todos']
    });
  };
  
  const handleChartVisibilityToggle = (chart: keyof ChartVisibility) => {
    onChartVisibilityChange({ 
      [chart]: !chartVisibility[chart] 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Gerenciamento de Exibição</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DateRangeFilter 
              dateRange={filters.dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            
            <StatusFilter
              statuses={filters.statuses}
              onStatusChange={handleStatusChange}
            />
            
            <ServiceTypeFilter
              serviceTypes={filters.serviceTypes}
              onServiceTypeChange={handleServiceTypeChange}
            />
            
            <DistrictFilter
              districts={filters.districts}
              onDistrictChange={handleDistrictChange}
            />
          </div>
          
          <ActiveFilters
            filters={filters}
            onDateRangeClear={() => onFiltersChange({ dateRange: undefined })}
            onStatusChange={handleStatusChange}
            onServiceTypeChange={handleServiceTypeChange}
            onDistrictChange={handleDistrictChange}
            onClearAllFilters={clearFilters}
          />
          
          <ChartVisibilityManager
            chartVisibility={chartVisibility}
            onChartVisibilityToggle={handleChartVisibilityToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
