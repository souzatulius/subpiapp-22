
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
  const districtOptions = ['Todos', 'PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
      <div className="flex flex-wrap gap-1">
        {districtOptions.map((district) => (
          <Badge
            key={district}
            variant={districts.includes(district as District) ? "default" : "outline"}
            className={`cursor-pointer ${
              districts.includes(district as District) ? 'bg-orange-500 hover:bg-orange-600' : ''
            }`}
            onClick={() => onDistrictChange(district)}
          >
            {district === 'Todos' ? district : district.split(' ').map(w => w[0]).join('')}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DistrictBadgeFilter;
