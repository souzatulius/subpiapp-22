
import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RankingFiltersProps {
  onOpenFilterDialog: () => void;
  buttonText?: string;
  lastUpdateText?: string;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({
  onOpenFilterDialog,
  buttonText = 'Filtrar',
  lastUpdateText = 'Última atualização',
  lastUpdated,
  onRefresh
}) => {
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Nunca';
    
    return formatDistanceToNow(lastUpdated, {
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenFilterDialog}
          variant="outline"
          size="sm"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
        
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        {lastUpdateText}: <span className="font-medium">{formatLastUpdated()}</span>
      </div>
    </div>
  );
};

export default RankingFilters;
