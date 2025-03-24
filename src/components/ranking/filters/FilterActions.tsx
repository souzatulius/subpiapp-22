
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Filter, Download, FileBarChart } from 'lucide-react';

interface FilterActionsProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onExportData?: () => void;
  onRegenerateCharts?: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  onClearFilters,
  onApplyFilters,
  onExportData,
  onRegenerateCharts
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          onClick={onClearFilters} 
          className="text-gray-500"
          size="sm"
        >
          Limpar Todos
        </Button>
        
        {onRegenerateCharts && (
          <Button 
            variant="outline" 
            onClick={onRegenerateCharts}
            className="text-orange-500 border-orange-300"
            size="sm"
          >
            <RotateCw className="mr-1 h-4 w-4" />
            Atualizar Gráficos
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        {onExportData && (
          <Button 
            variant="outline" 
            onClick={onExportData}
            className="text-gray-700"
            size="sm"
          >
            <Download className="mr-1 h-4 w-4" />
            Exportar Dados
          </Button>
        )}
        
        <Button 
          variant="default" 
          onClick={onApplyFilters}
          className="bg-orange-500 hover:bg-orange-600"
          size="sm"
        >
          <Filter className="mr-1 h-4 w-4" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterActions;
