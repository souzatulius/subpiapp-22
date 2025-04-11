
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { FilterOptions } from '@/components/ranking/types';
import StatusFilter from './StatusFilter';
import ServiceTypeFilter from './ServiceTypeFilter';
import DistrictsFilter from './DistrictsFilter';
import DepartmentFilter from './DepartmentFilter';
import ResponsibilityFilter from './ResponsibilityFilter';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface FilterSectionProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onApplyFilters: () => void;
  isLoading?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterOptions,
  onFilterChange,
  onApplyFilters,
  isLoading = false
}) => {
  const [dateRange, setDateRange] = useState(filterOptions.dateRange || { from: null, to: null });
  const [status, setStatus] = useState<string[]>(filterOptions.status || []);
  const [serviceTypes, setServiceTypes] = useState<string[]>(filterOptions.serviceTypes || []);
  const [distritos, setDistritos] = useState<string[]>(filterOptions.distritos || []);
  const [departamento, setDepartamento] = useState<string[]>(filterOptions.departamento || []);
  const [responsavel, setResponsavel] = useState<string[]>(filterOptions.responsavel || []);
  const { showFeedback } = useAnimatedFeedback();

  // Update local state when filterOptions change
  useEffect(() => {
    setDateRange(filterOptions.dateRange || { from: null, to: null });
    setStatus(filterOptions.status || []);
    setServiceTypes(filterOptions.serviceTypes || []);
    setDistritos(filterOptions.distritos || []);
    setDepartamento(filterOptions.departamento || []);
    setResponsavel(filterOptions.responsavel || []);
  }, [filterOptions]);

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
    onFilterChange({ ...filterOptions, dateRange: range });
  };

  const handleStatusChange = (selectedStatus: string[]) => {
    setStatus(selectedStatus);
    onFilterChange({ ...filterOptions, status: selectedStatus });
  };

  const handleServiceTypeChange = (types: string[]) => {
    setServiceTypes(types);
    onFilterChange({ ...filterOptions, serviceTypes: types });
  };

  const handleDistritoChange = (selectedDistritos: string[]) => {
    setDistritos(selectedDistritos);
    onFilterChange({ ...filterOptions, distritos: selectedDistritos });
  };

  const handleDepartmentChange = (selectedDeps: string[]) => {
    setDepartamento(selectedDeps);
    onFilterChange({ ...filterOptions, departamento: selectedDeps });
  };

  const handleResponsavelChange = (selectedResps: string[]) => {
    setResponsavel(selectedResps);
    onFilterChange({ ...filterOptions, responsavel: selectedResps });
  };

  const handleApply = () => {
    onApplyFilters();
    showFeedback('success', 'Filtros aplicados com sucesso', { duration: 2000 });
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      dateRange: { from: null, to: null },
      status: [],
      serviceTypes: [],
      distritos: [],
      departamento: [],
      responsavel: []
    };
    
    setDateRange(clearedFilters.dateRange);
    setStatus(clearedFilters.status);
    setServiceTypes(clearedFilters.serviceTypes);
    setDistritos(clearedFilters.distritos);
    setDepartamento(clearedFilters.departamento);
    setResponsavel(clearedFilters.responsavel);
    
    onFilterChange(clearedFilters);
    onApplyFilters();
    showFeedback('success', 'Filtros removidos', { duration: 2000 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Período</h3>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder="Selecione o período"
        />
      </div>
      
      <StatusFilter 
        statuses={status} 
        onStatusChange={handleStatusChange}
      />
      
      <ServiceTypeFilter
        serviceTypes={serviceTypes} 
        onServiceTypeChange={handleServiceTypeChange} 
      />
      
      <DistrictsFilter 
        distritos={distritos} 
        onDistrictsChange={handleDistritoChange} 
      />
      
      <DepartmentFilter 
        departamentos={departamento} 
        onDepartmentChange={handleDepartmentChange} 
      />
      
      <ResponsibilityFilter 
        responsaveis={responsavel} 
        onResponsibilityChange={handleResponsavelChange} 
      />
      
      <div className="flex space-x-2 pt-4">
        <Button 
          onClick={handleApply} 
          variant="default"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
        </Button>
        
        <Button 
          onClick={handleClearFilters} 
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
