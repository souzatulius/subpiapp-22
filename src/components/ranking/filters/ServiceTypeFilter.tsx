
import React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface ServiceTypeFilterProps {
  serviceTypes: string[];
  onServiceTypeChange: (types: string[]) => void;
}

const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({ serviceTypes, onServiceTypeChange }) => {
  const typeOptions = [
    { value: 'Todos', label: 'Todos os tipos' },
    { value: 'Tapa-Buraco', label: 'Tapa-Buraco' },
    { value: 'Poda de Árvore', label: 'Poda de Árvore' },
    { value: 'Limpeza de Bueiros', label: 'Limpeza de Bueiros' },
    { value: 'Remoção de Entulho', label: 'Remoção de Entulho' },
    { value: 'Iluminação Pública', label: 'Iluminação Pública' },
    { value: 'Manutenção de Calçada', label: 'Manutenção de Calçada' }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Tipo de Serviço</h3>
      <MultiSelect
        placeholder="Selecionar tipos de serviço"
        options={typeOptions}
        selected={serviceTypes}
        onChange={onServiceTypeChange}
        className="max-w-full"
      />
    </div>
  );
};

export default ServiceTypeFilter;
