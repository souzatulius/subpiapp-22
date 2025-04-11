
import React from 'react';
import { MultiSelect } from '@/components/ui/multiselect';

interface ResponsibilityFilterProps {
  responsaveis: string[];
  onResponsibilityChange: (responsaveis: string[]) => void;
}

const ResponsibilityFilter: React.FC<ResponsibilityFilterProps> = ({ responsaveis, onResponsibilityChange }) => {
  const responsibilityOptions = [
    { value: 'Todos', label: 'Todos os responsáveis' },
    { value: 'Prefeitura', label: 'Prefeitura' },
    { value: 'Subprefeitura', label: 'Subprefeitura' },
    { value: 'Empresa Contratada', label: 'Empresa Contratada' },
    { value: 'Secretaria', label: 'Secretaria' },
    { value: 'Outros', label: 'Outros' }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Responsáveis</h3>
      <MultiSelect
        placeholder="Selecionar responsáveis"
        options={responsibilityOptions}
        selected={responsaveis}
        onChange={onResponsibilityChange}
        className="max-w-full"
      />
    </div>
  );
};

export default ResponsibilityFilter;
