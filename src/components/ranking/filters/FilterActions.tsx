
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter, Save } from 'lucide-react';
import { toast } from 'sonner';

interface FilterActionsProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onSaveChartConfig?: () => void;
  lastUpdated?: string | null;
  isProcessing?: boolean;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  onClearFilters,
  onApplyFilters,
  onSaveChartConfig,
  lastUpdated,
  isProcessing = false
}) => {
  return (
    <div className="flex flex-col space-y-3 mt-4 border-t pt-4">
      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Última atualização: {lastUpdated}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center"
          disabled={isProcessing}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
        
        {onSaveChartConfig && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onSaveChartConfig();
              toast.success("Configuração dos gráficos salva com sucesso!");
            }}
            className="flex items-center"
            disabled={isProcessing}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Config.
          </Button>
        )}
        
        <Button
          size="sm"
          onClick={onApplyFilters}
          className="flex items-center bg-orange-500 hover:bg-orange-600"
          disabled={isProcessing}
        >
          <Filter className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterActions;
