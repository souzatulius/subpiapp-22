
import React from 'react';
import { MultiSelect } from '@/components/ui/multiselect';

interface StatusFilterProps {
  statuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statuses, onStatusChange }) => {
  const statusOptions = [
    { value: 'Todos', label: 'Todos os status' },
    { value: 'Aberto', label: 'Aberto' },
    { value: 'Em Andamento', label: 'Em Andamento' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
    { value: 'Pendente', label: 'Pendente' }
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Status</h3>
      <MultiSelect
        placeholder="Selecionar status"
        options={statusOptions}
        selected={statuses}
        onChange={onStatusChange}
        className="max-w-full"
      />
    </div>
  );
};

export default StatusFilter;
