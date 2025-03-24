
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FilterOptions, OrderStatus, District } from './types';
import { useFilterVisibility } from './hooks/useFilterVisibility';

// Import individual filter components
import FilterHeader from './filters/FilterHeader';
import AreaTecnicaFilter from './filters/AreaTecnicaFilter';
import StatusBadgeFilter from './filters/StatusBadgeFilter';
import DistrictBadgeFilter from './filters/DistrictBadgeFilter';
import DateRangeFilters from './filters/DateRangeFilters';
import CompanyFilter from './filters/CompanyFilter';
import FilterActions from './filters/FilterActions';
import ActiveFilterBadges from './filters/ActiveFilterBadges';

interface OS156FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  companies: string[];
  onApplyFilters: () => void;
}

const OS156Filters: React.FC<OS156FiltersProps> = ({
  filters,
  onFiltersChange,
  companies,
  onApplyFilters
}) => {
  const { isOpen, toggleFilters, getActiveFilterCount } = useFilterVisibility(filters);

  const handleAreaTecnicaChange = (value: 'Todos' | 'STM' | 'STLP') => {
    onFiltersChange({
      ...filters,
      areas: [value as any]
    });
  };

  const handleStatusChange = (status: string) => {
    let newStatuses = [...filters.statuses];
    
    if (status === 'Todos') {
      newStatuses = ['Todos' as OrderStatus];
    } else {
      // Remove 'Todos' if present
      newStatuses = newStatuses.filter(s => s !== 'Todos');
      
      // Add or remove the status
      if (newStatuses.includes(status as OrderStatus)) {
        newStatuses = newStatuses.filter(s => s !== status);
      } else {
        newStatuses.push(status as OrderStatus);
      }
      
      // If no status is selected, add 'Todos'
      if (newStatuses.length === 0) {
        newStatuses = ['Todos' as OrderStatus];
      }
    }
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleCompanyChange = (company: string) => {
    let newCompanies = [...(filters.companies || [])];
    
    if (company === 'Todos') {
      newCompanies = ['Todos'];
    } else {
      // Remove 'Todos' if present
      newCompanies = newCompanies.filter(c => c !== 'Todos');
      
      // Add or remove the company
      if (newCompanies.includes(company)) {
        newCompanies = newCompanies.filter(c => c !== company);
      } else {
        newCompanies.push(company);
      }
      
      // If no company is selected, add 'Todos'
      if (newCompanies.length === 0) {
        newCompanies = ['Todos'];
      }
    }
    
    onFiltersChange({ ...filters, companies: newCompanies as any });
  };

  const handleDistrictChange = (district: string) => {
    let newDistricts = [...filters.districts];
    
    if (district === 'Todos') {
      newDistricts = ['Todos' as District];
    } else {
      // Remove 'Todos' if present
      newDistricts = newDistricts.filter(d => d !== 'Todos');
      
      // Add or remove the district
      if (newDistricts.includes(district as District)) {
        newDistricts = newDistricts.filter(d => d !== district);
      } else {
        newDistricts.push(district as District);
      }
      
      // If no district is selected, add 'Todos'
      if (newDistricts.length === 0) {
        newDistricts = ['Todos' as District];
      }
    }
    
    onFiltersChange({ ...filters, districts: newDistricts });
  };

  const handleDateChange = (field: 'dataInicio' | 'dataFim', date?: Date) => {
    const dateRange = { ...filters.dateRange };
    
    if (field === 'dataInicio') {
      dateRange.from = date;
    } else {
      dateRange.to = date;
    }
    
    onFiltersChange({
      ...filters,
      dateRange
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos' as OrderStatus],
      serviceTypes: ['Todos'],
      districts: ['Todos' as District],
      areas: ['STM', 'STLP'],
      companies: ['Todos']
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <FilterHeader 
          isOpen={isOpen} 
          onToggle={toggleFilters}
          activeFilterCount={getActiveFilterCount()}
        />
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <AreaTecnicaFilter 
              value={(filters.areas && filters.areas.length > 0) ? filters.areas[0] as any : 'Todos'} 
              onChange={handleAreaTecnicaChange} 
            />
            
            <StatusBadgeFilter 
              statuses={filters.statuses} 
              onStatusChange={handleStatusChange} 
            />
            
            <DistrictBadgeFilter 
              districts={filters.districts as any} 
              onDistrictChange={handleDistrictChange} 
            />
          </div>
          
          {/* Temporarily comment out date range filters until we create the component 
          <DateRangeFilters 
            dataInicio={filters.dateRange?.from} 
            dataFim={filters.dateRange?.to} 
            onDateChange={handleDateChange} 
          />
          */}
          
          <div className="mt-4">
            <CompanyFilter 
              companies={companies} 
              selectedCompanies={filters.companies || ['Todos']} 
              onCompanyChange={handleCompanyChange} 
            />
          </div>
          
          <FilterActions 
            onClearFilters={clearFilters} 
            onApplyFilters={() => {
              onApplyFilters();
              toggleFilters();
            }} 
          />
        </CardContent>
      )}
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <CardContent className="pt-0">
          <ActiveFilterBadges 
            filters={filters}
            onRemoveFilter={(type, value) => {
              // Handle removing filters based on type
              if (type === 'status') {
                onFiltersChange({
                  ...filters,
                  statuses: filters.statuses.filter(s => s !== value)
                });
              } else if (type === 'district') {
                onFiltersChange({
                  ...filters,
                  districts: filters.districts.filter(d => d !== value)
                });
              } else if (type === 'company') {
                onFiltersChange({
                  ...filters,
                  companies: (filters.companies || []).filter(c => c !== value) as any
                });
              } else if (type === 'dateRange') {
                onFiltersChange({
                  ...filters,
                  dateRange: undefined
                });
              }
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default OS156Filters;
