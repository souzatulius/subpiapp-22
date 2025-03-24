
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';

interface FilterActionsProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  onClearFilters,
  onApplyFilters
}) => {
  return (
    <div className="flex justify-end space-x-2 mt-4 border-t pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="flex items-center"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Limpar Filtros
      </Button>
      <Button
        size="sm"
        onClick={onApplyFilters}
        className="flex items-center bg-orange-500 hover:bg-orange-600"
      >
        <Filter className="mr-2 h-4 w-4" />
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default FilterActions;
