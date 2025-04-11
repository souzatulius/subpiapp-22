
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

  return null; // Return null instead of rendering the div since it's unnecessary
};

export default RankingFilters;
