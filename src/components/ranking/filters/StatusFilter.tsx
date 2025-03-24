
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions, OrderStatus } from '@/components/ranking/types';

interface StatusFilterProps {
  statuses: FilterOptions['statuses'];
  onStatusChange: (status: OrderStatus) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statuses, onStatusChange }) => {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Planejar', 'Novo', 'Aprovado', 'Concluído', 'NOVO', 'CONC', 'PREPLAN', 'PRECANC', 'AB', 'PE'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox 
                  id={`status-${status}`} 
                  checked={statuses.includes(status as OrderStatus)}
                  onCheckedChange={() => onStatusChange(status as OrderStatus)}
                />
                <label 
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
