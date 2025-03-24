
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  onClearFilters,
  onApplyFilters
}) => {
  return (
    <div className="flex justify-between mt-4">
      <Button variant="ghost" onClick={onClearFilters} className="text-gray-500">
        Limpar Todos
      </Button>
      <Button 
        variant="default" 
        onClick={onApplyFilters}
        className="bg-orange-500 hover:bg-orange-600"
      >
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default FilterActions;
