
import React from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ isOpen, onToggle, activeFilterCount }) => {
  return (
    <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-medium">Filtros</h3>
        {activeFilterCount > 0 && (
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            {activeFilterCount}
          </Badge>
        )}
      </div>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </div>
  );
};

export default FilterHeader;
