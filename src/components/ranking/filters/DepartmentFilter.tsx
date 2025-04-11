
import React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface DepartmentFilterProps {
  departamentos: string[];
  onDepartmentChange: (departamentos: string[]) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ departamentos, onDepartmentChange }) => {
  const departmentOptions = [
    { value: 'Todos', label: 'Todos os departamentos' },
    { value: 'CPDU', label: 'CPDU' },
    { value: 'SMSUB', label: 'SMSUB' },
    { value: 'SPOBRAS', label: 'SPOBRAS' },
    { value: 'ILUME', label: 'ILUME' },
    { value: 'SIURB', label: 'SIURB' },
    { value: 'COHAB', label: 'COHAB' }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Departamentos</h3>
      <MultiSelect
        placeholder="Selecionar departamentos"
        options={departmentOptions}
        selected={departamentos}
        onChange={onDepartmentChange}
        className="max-w-full"
      />
    </div>
  );
};

export default DepartmentFilter;
