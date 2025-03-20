
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterOptions, ChartVisibility } from './types';
import DateRangeFilter from './filters/DateRangeFilter';
import StatusFilter from './filters/StatusFilter';
import ServiceTypeFilter from './filters/ServiceTypeFilter';
import DistrictFilter from './filters/DistrictFilter';
import OriginFilter from './filters/OriginFilter';
import MediaTypeFilter from './filters/MediaTypeFilter';
import CoordinationAreaFilter from './filters/CoordinationAreaFilter';
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
  
  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    let newValues = [...filters[filterType]];
    
    if (value === 'Todos') {
      newValues = ['Todos'];
    } else {
      // Remove 'Todos' se estiver presente
      newValues = newValues.filter(v => v !== 'Todos');
      
      // Adiciona ou remove o valor
      if (newValues.includes(value)) {
        newValues = newValues.filter(v => v !== value);
      } else {
        newValues.push(value);
      }
      
      // Se não houver nenhum valor, adiciona 'Todos'
      if (newValues.length === 0) {
        newValues = ['Todos'];
      }
    }
    
    onFiltersChange({ [filterType]: newValues } as any);
  };
  
  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos'],
      serviceTypes: ['Todos'],
      districts: ['Todos'],
      origins: ['Todos'],
      mediaTypes: ['Todos'],
      coordinationAreas: ['Todos']
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <DateRangeFilter 
              dateRange={filters.dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            
            <StatusFilter
              statuses={filters.statuses}
              onStatusChange={(status) => handleFilterChange('statuses', status)}
            />
            
            <ServiceTypeFilter
              serviceTypes={filters.serviceTypes}
              onServiceTypeChange={(type) => handleFilterChange('serviceTypes', type)}
            />
            
            <DistrictFilter
              districts={filters.districts}
              onDistrictChange={(district) => handleFilterChange('districts', district)}
            />
            
            <OriginFilter
              origins={filters.origins}
              onOriginChange={(origin) => handleFilterChange('origins', origin)}
            />
            
            <MediaTypeFilter
              mediaTypes={filters.mediaTypes}
              onMediaTypeChange={(type) => handleFilterChange('mediaTypes', type)}
            />
            
            <CoordinationAreaFilter
              coordinationAreas={filters.coordinationAreas}
              onCoordinationAreaChange={(area) => handleFilterChange('coordinationAreas', area)}
            />
          </div>
          
          <ActiveFilters
            filters={filters}
            onDateRangeClear={() => onFiltersChange({ dateRange: undefined })}
            onFilterChange={handleFilterChange}
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
