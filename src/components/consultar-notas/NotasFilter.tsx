
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface NotasFilterProps {
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

const NotasFilter: React.FC<NotasFilterProps> = ({ 
  selectedStatus, 
  setSelectedStatus 
}) => {
  // Status options
  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'excluida', label: 'Excluída' }
  ];

  // Toggle a status in the selectedStatus array
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
      <div>
        <Label htmlFor="status-filter">Status</Label>
        <Select
          value={selectedStatus.length === 1 ? selectedStatus[0] : 'multiple'}
          onValueChange={(value) => {
            if (value !== 'multiple') {
              toggleStatus(value);
            }
          }}
        >
          <SelectTrigger id="status-filter" className="w-full">
            <SelectValue placeholder="Selecione o status">
              {selectedStatus.length === 0 
                ? 'Todos os status' 
                : selectedStatus.length === 1 
                  ? statusOptions.find(o => o.value === selectedStatus[0])?.label 
                  : `${selectedStatus.length} status selecionados`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NotasFilter;
