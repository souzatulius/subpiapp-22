
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { District } from '../types';

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
      case 'PINHEIROS': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'ALTO DE PINHEIROS': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'JARDIM PAULISTA': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'ITAIM BIBI': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'EXTERNO': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Todos': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
      <div className="flex flex-wrap gap-2">
        {allDistricts.map((district) => (
          <Badge
            key={district}
            variant="outline"
            className={`cursor-pointer ${
              districts.includes(district as District)
                ? getDistrictColor(district) + ' ring-2 ring-offset-1 ring-gray-400'
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => onDistrictChange(district)}
          >
            {district}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DistrictBadgeFilter;
