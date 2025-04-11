
import React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface StatusFilterProps {
  status: string[];
  onStatusChange: (status: string[]) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ status, onStatusChange }) => {
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
        selected={status}
        onChange={onStatusChange}
        className="max-w-full"
      />
    </div>
  );
};

export default StatusFilter;
