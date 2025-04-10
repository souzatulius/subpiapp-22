import React from 'react';
import { useDemandasPorCoordenacao } from '@/hooks/dashboard/useDemandasPorCoordenacao';
import GroupedBarChart from '@/components/dashboard/charts/GroupedBarChart';
import { Loader2 } from 'lucide-react';

interface OriginsDemandChartCompactProps {
  className?: string;
  color?: string;
  title?: string;
  subtitle?: string;
}

const OriginsDemandChartCompact: React.FC<OriginsDemandChartCompactProps> = ({ 
  className = '',
  color,
  title,
  subtitle
}) => {
  const { chartData, isLoading, error, refresh } = useDemandasPorCoordenacao();

  return (
    <div className={`w-full h-full ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500 text-xs">
          <p>Erro ao carregar dados</p>
        </div>
      ) : !chartData ? (
        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
          <p>Nenhum dado disponível</p>
        </div>
      ) : (
        <GroupedBarChart 
          data={chartData}
          height={190} // Altura reduzida para caber no card
          className="p-2"
          compact={true} // Indica que é uma versão compacta
        />
      )}
    </div>
  );
};

export default OriginsDemandChartCompact;
