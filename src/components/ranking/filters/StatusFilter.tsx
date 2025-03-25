
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterOptions } from '@/components/ranking/types';

interface StatusFilterProps {
  statuses: FilterOptions['statuses'];
  onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statuses, onStatusChange }) => {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select>
        <SelectTrigger className="border-orange-200">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <div className="space-y-1 p-1">
            {['Todos', 'Concluído', 'PREPLAN', 'PRECANC', 'Aprovado', 'Em Andamento'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox 
                  id={`status-${status}`} 
                  checked={statuses.includes(status as any)}
                  onCheckedChange={() => onStatusChange(status)}
                  className="border-orange-400 data-[state=checked]:bg-orange-600"
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
