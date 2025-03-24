
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OS156FilterOptions, OrderStatus, District } from './types';
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
  filters: OS156FilterOptions;
  onFiltersChange: (filters: OS156FilterOptions) => void;
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
      areaTecnica: value
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
    let newCompanies = [...filters.empresa];
    
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
    
    onFiltersChange({ ...filters, empresa: newCompanies });
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
    onFiltersChange({
      ...filters,
      [field]: date
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: undefined,
      statuses: ['Todos' as OrderStatus],
      serviceTypes: ['Todos'],
      districts: ['Todos' as District],
      areaTecnica: 'Todos',
      empresa: ['Todos'],
      dataInicio: undefined,
      dataFim: undefined
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
              value={filters.areaTecnica} 
              onChange={handleAreaTecnicaChange} 
            />
            
            <StatusBadgeFilter 
              statuses={filters.statuses} 
              onStatusChange={handleStatusChange} 
            />
            
            <DistrictBadgeFilter 
              districts={filters.districts} 
              onDistrictChange={handleDistrictChange} 
            />
          </div>
          
          <DateRangeFilters 
            dataInicio={filters.dataInicio} 
            dataFim={filters.dataFim} 
            onDateChange={handleDateChange} 
          />
          
          <div className="mt-4">
            <CompanyFilter 
              companies={companies} 
              selectedCompanies={filters.empresa} 
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
            onAreaTecnicaChange={handleAreaTecnicaChange}
            onStatusChange={(newStatuses) => onFiltersChange({ ...filters, statuses: newStatuses })}
            onDistrictChange={(newDistricts) => onFiltersChange({ ...filters, districts: newDistricts })}
            onCompanyChange={(newCompanies) => onFiltersChange({ ...filters, empresa: newCompanies })}
            onDateChange={handleDateChange}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default OS156Filters;
