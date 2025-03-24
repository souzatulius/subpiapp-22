
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface FilterHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  isOpen,
  onToggle,
  activeFilterCount
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Filtros</h3>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggle}
        className="flex items-center gap-1"
      >
        <Filter className="h-4 w-4" />
        <span>Filtros</span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default FilterHeader;
