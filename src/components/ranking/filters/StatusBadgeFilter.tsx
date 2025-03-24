
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
  // All possible statuses including new ones
  const allStatuses = [
    'Todos', 'NOVO', 'AB', 'PE', 'APROVADO', 'PREPLAN', 
    'PRECANC', 'EMAND', 'CONC', 'FECHADO'
  ];

  // Color mapping for status badges
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'NOVO': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'AB': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'PE': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'APROVADO': return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      case 'PREPLAN': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'PRECANC': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'EMAND': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'CONC': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'FECHADO': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'Todos': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <div className="flex flex-wrap gap-2">
        {allStatuses.map((status) => (
          <Badge
            key={status}
            variant="outline"
            className={`cursor-pointer ${
              statuses.includes(status as OrderStatus)
                ? getStatusColor(status) + ' ring-2 ring-offset-1 ring-gray-400'
                : 'bg-white hover:bg-gray-100'
            }`}
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
