
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '../types';

interface StatusBadgeFilterProps {
  statuses: OrderStatus[];
  onStatusChange: (status: string) => void;
}

const StatusBadgeFilter: React.FC<StatusBadgeFilterProps> = ({
  statuses,
  onStatusChange
}) => {
  const statusOptions = ['Todos', 'NOVO', 'CONC', 'PREPLAN', 'PRECANC', 'AB', 'PE'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <div className="flex flex-wrap gap-1">
        {statusOptions.map((status) => (
          <Badge
            key={status}
            variant={statuses.includes(status as OrderStatus) ? "default" : "outline"}
            className={`cursor-pointer ${
              statuses.includes(status as OrderStatus) ? 'bg-orange-500 hover:bg-orange-600' : ''
            } ${['PREPLAN', 'PRECANC'].includes(status) ? 'border-red-300' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default StatusBadgeFilter;
