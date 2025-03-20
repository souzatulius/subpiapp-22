
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX, Filter } from 'lucide-react';

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({ onReset, onApply }) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button 
        variant="outline" 
        onClick={onReset}
      >
        <FilterX className="mr-2 h-4 w-4" />
        Limpar Filtros
      </Button>
      <Button 
        onClick={onApply}
      >
        <Filter className="mr-2 h-4 w-4" />
        Aplicar Filtros
      </Button>
    </div>
  );
};

export default FilterActions;
