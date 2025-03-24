
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { District } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface DistrictBadgeFilterProps {
  districts: District[];
  onDistrictChange: (district: string) => void;
}

const DistrictBadgeFilter: React.FC<DistrictBadgeFilterProps> = ({
  districts,
  onDistrictChange
}) => {
  // All possible districts
  const allDistricts = [
    'Todos', 
    'PINHEIROS', 
    'ALTO DE PINHEIROS', 
    'JARDIM PAULISTA', 
    'ITAIM BIBI',
    'EXTERNO'
  ];

  // Color mapping for district badges
  const getDistrictColor = (district: string): string => {
    switch(district) {
      case 'PINHEIROS': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'ALTO DE PINHEIROS': return 'bg-orange-200 text-orange-800 hover:bg-orange-300';
      case 'JARDIM PAULISTA': return 'bg-orange-300 text-orange-800 hover:bg-orange-400';
      case 'ITAIM BIBI': return 'bg-orange-400 text-orange-800 hover:bg-orange-500';
      case 'EXTERNO': return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'Todos': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
      <div className="flex flex-wrap gap-2">
        {allDistricts.map((district) => {
          const isSelected = districts.includes(district as District);
          return (
            <Badge
              key={district}
              variant="outline"
              className={`cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? getDistrictColor(district) + ' ring-2 ring-offset-1 ring-gray-400'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => onDistrictChange(district)}
            >
              {isSelected ? (
                <Eye className="h-3 w-3 mr-1" />
              ) : (
                <EyeOff className="h-3 w-3 mr-1" />
              )}
              {district}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default DistrictBadgeFilter;
