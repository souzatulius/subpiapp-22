
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RankingFiltersProps {
  onOpenFilterDialog: () => void;
  buttonText?: string;
  lastUpdateText?: string;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({ 
  onOpenFilterDialog, 
  buttonText = 'Filtrar',
  lastUpdateText = 'Última atualização'
}) => {
  const lastUpdate = new Date();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center text-sm text-gray-500">
        <Calendar className="h-4 w-4 mr-2" />
        {lastUpdateText}: {format(lastUpdate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
          onClick={onOpenFilterDialog}
        >
          <RefreshCcw className="h-4 w-4" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default RankingFilters;
