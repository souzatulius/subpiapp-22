
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DateRangeFilter from './filters/DateRangeFilter';
import StatusFilter from './filters/StatusFilter';
import DistrictFilter from './filters/DistrictFilter';
import ServiceTypeFilter from './filters/ServiceTypeFilter';
import CompanyFilter from './filters/CompanyFilter';
import AreaTecnicaFilter from './filters/AreaTecnicaFilter';
import FilterActions from './filters/FilterActions';
import ActiveFilterBadges from './filters/ActiveFilterBadges';
import { FilterOptions, OrderStatus, District, AreaTecnica } from './types';

interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  companies: string[];
  districts: string[];
  serviceTypes: string[];
  statuses: string[];
  onRemoveFilter: (type: string, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSaveChartConfig?: () => void;
  lastUpdated?: string | null;
  isProcessing?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  companies,
  districts,
  serviceTypes,
  statuses,
  onRemoveFilter,
  onApplyFilters,
  onClearFilters,
  onSaveChartConfig,
  lastUpdated,
  isProcessing = false
}) => {
  // Handle status change
  const handleStatusChange = (status: string) => {
    let newStatuses: OrderStatus[];
    
    if (status === 'Todos') {
      newStatuses = ['Todos'];
    } else if (filters.statuses.includes(status as OrderStatus)) {
      newStatuses = filters.statuses.filter(s => s !== status);
      if (newStatuses.length === 0 || (newStatuses.length === 1 && newStatuses[0] === 'Todos')) {
        newStatuses = ['Todos'];
      }
    } else {
      newStatuses = filters.statuses.filter(s => s !== 'Todos');
      newStatuses.push(status as OrderStatus);
    }
    
    onFiltersChange({ statuses: newStatuses });
  };
  
  // Handle district change
  const handleDistrictChange = (district: string) => {
    let newDistricts: District[];
    
    if (district === 'Todos') {
      newDistricts = ['Todos'];
    } else if (filters.districts.includes(district as District)) {
      newDistricts = filters.districts.filter(d => d !== district);
      if (newDistricts.length === 0 || (newDistricts.length === 1 && newDistricts[0] === 'Todos')) {
        newDistricts = ['Todos'];
      }
    } else {
      newDistricts = filters.districts.filter(d => d !== 'Todos');
      newDistricts.push(district as District);
    }
    
    onFiltersChange({ districts: newDistricts });
  };
  
  // Handle service type change
  const handleServiceTypeChange = (serviceType: string) => {
    let newServiceTypes: string[];
    
    if (serviceType === 'Todos') {
      newServiceTypes = ['Todos'];
    } else if (filters.serviceTypes.includes(serviceType)) {
      newServiceTypes = filters.serviceTypes.filter(s => s !== serviceType);
      if (newServiceTypes.length === 0 || (newServiceTypes.length === 1 && newServiceTypes[0] === 'Todos')) {
        newServiceTypes = ['Todos'];
      }
    } else {
      newServiceTypes = filters.serviceTypes.filter(s => s !== 'Todos').concat(serviceType);
    }
    
    onFiltersChange({ serviceTypes: newServiceTypes });
  };
  
  // Handle company change
  const handleCompanyChange = (company: string) => {
    let newCompanies: string[];
    
    if (company === 'Todos') {
      newCompanies = ['Todos'];
    } else if (filters.companies?.includes(company)) {
      newCompanies = filters.companies.filter(c => c !== company);
      if (newCompanies.length === 0 || (newCompanies.length === 1 && newCompanies[0] === 'Todos')) {
        newCompanies = ['Todos'];
      }
    } else {
      newCompanies = (filters.companies || []).filter(c => c !== 'Todos').concat(company);
    }
    
    onFiltersChange({ companies: newCompanies });
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFiltersChange({ dateRange: range });
  };

  // Handle area change
  const handleAreaChange = (area: AreaTecnica) => {
    let newAreas: AreaTecnica[];
    
    if (area === 'Todos') {
      newAreas = ['STM', 'STLP'];
    } else {
      newAreas = [area];
    }
    
    onFiltersChange({ areas: newAreas });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusFilter
            statuses={filters.statuses}
            onStatusChange={handleStatusChange}
          />
          
          <DistrictFilter
            districts={filters.districts}
            onDistrictChange={handleDistrictChange}
          />
          
          <ServiceTypeFilter
            serviceTypes={filters.serviceTypes}
            onServiceTypeChange={handleServiceTypeChange}
          />
          
          <DateRangeFilter
            dateRange={filters.dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          
          <CompanyFilter
            companies={companies}
            selectedCompanies={filters.companies || ['Todos']}
            onCompanyChange={handleCompanyChange}
          />
          
          <AreaTecnicaFilter
            value={filters.areas && filters.areas.length === 1 ? filters.areas[0] : 'Todos'}
            onChange={handleAreaChange}
          />
        </div>
        
        <ActiveFilterBadges 
          filters={filters}
          onRemoveFilter={onRemoveFilter}
        />
        
        <FilterActions
          onClearFilters={onClearFilters}
          onApplyFilters={onApplyFilters}
          onSaveChartConfig={onSaveChartConfig}
          lastUpdated={lastUpdated}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
};

export default FilterSection;
