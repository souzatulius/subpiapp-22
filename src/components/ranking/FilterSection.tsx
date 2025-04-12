import React from 'react';
import { cn } from '@/lib/utils';
import { MultiSelect } from '@/components/ui/multiselect';

interface FilterSectionProps {
  statuses: { label: string; value: string }[];
  serviceTypes: { label: string; value: string }[];
  districts: { label: string; value: string }[];
  departments: { label: string; value: string }[];
  responsibilities: { label: string; value: string }[];
  selectedStatus: string[];
  selectedServiceType: string[];
  selectedDistricts: string[];
  selectedDepartments: string[];
  selectedResponsibility: string[];
  onStatusChange: (value: string[]) => void;
  onServiceTypeChange: (value: string[]) => void;
  onDistrictChange: (value: string[]) => void;
  onDepartmentChange: (value: string[]) => void;
  onResponsibilityChange: (value: string[]) => void;
  className?: string;
}

const StatusFilter: React.FC<{ statuses: { label: string; value: string }[]; selectedStatus: string[]; onChange: (value: string[]) => void }> = ({ statuses, selectedStatus, onChange }) => (
  <MultiSelect
    options={statuses}
    selected={selectedStatus}
    onChange={onChange}
    placeholder="Filtrar por Status"
  />
);

const ServiceTypeFilter: React.FC<{ serviceTypes: { label: string; value: string }[]; selectedTypes: string[]; onChange: (value: string[]) => void }> = ({ serviceTypes, selectedTypes, onChange }) => (
  <MultiSelect
    options={serviceTypes}
    selected={selectedTypes}
    onChange={onChange}
    placeholder="Filtrar por Tipo de Serviço"
  />
);

const DistrictsFilter: React.FC<{ districts: { label: string; value: string }[]; selectedDistricts: string[]; onChange: (value: string[]) => void }> = ({ districts, selectedDistricts, onChange }) => (
  <MultiSelect
    options={districts}
    selected={selectedDistricts}
    onChange={onChange}
    placeholder="Filtrar por Distrito"
  />
);

const DepartmentFilter: React.FC<{ departments: { label: string; value: string }[]; selectedDepartments: string[]; onChange: (value: string[]) => void }> = ({ departments, selectedDepartments, onChange }) => (
  <MultiSelect
    options={departments}
    selected={selectedDepartments}
    onChange={onChange}
    placeholder="Filtrar por Departamento"
  />
);

const ResponsibilityFilter: React.FC<{ responsibilities: { label: string; value: string }[]; selectedResponsibility: string[]; onChange: (value: string[]) => void }> = ({ responsibilities, selectedResponsibility, onChange }) => (
  <MultiSelect
    options={responsibilities}
    selected={selectedResponsibility}
    onChange={onChange}
    placeholder="Filtrar por Responsabilidade"
  />
);

const FilterSection = ({
  statuses,
  serviceTypes,
  districts,
  departments,
  responsibilities,
  selectedStatus,
  selectedServiceType,
  selectedDistricts,
  selectedDepartments,
  selectedResponsibility,
  onStatusChange,
  onServiceTypeChange,
  onDistrictChange,
  onDepartmentChange,
  onResponsibilityChange,
  className
}: FilterSectionProps) => {

  return (
    <div className={cn("space-y-4", className)}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusFilter 
          statuses={statuses} 
          selectedStatus={selectedStatus} 
          onChange={(status: string[]) => onStatusChange(status)} 
        />
        
        <ServiceTypeFilter 
          serviceTypes={serviceTypes} 
          selectedTypes={selectedServiceType} 
          onChange={(types: string[]) => onServiceTypeChange(types)} 
        />
        
        <DistrictsFilter 
          districts={districts} 
          selectedDistricts={selectedDistricts} 
          onChange={onDistrictChange} 
        />
        
        <DepartmentFilter 
          departments={departments} 
          selectedDepartments={selectedDepartments} 
          onChange={onDepartmentChange} 
        />
        
        <ResponsibilityFilter 
          responsibilities={responsibilities} 
          selectedResponsibility={selectedResponsibility} 
          onChange={onResponsibilityChange} 
        />
      </div>
    </div>
  );
};

export default FilterSection;
