
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemandasPorCoordenacao } from '@/hooks/dashboard/useDemandasPorCoordenacao';
import GroupedBarChart from '@/components/dashboard/charts/GroupedBarChart';
import { Loader2 } from 'lucide-react';

interface OriginsDemandChartProps {
  className?: string;
  hideHeader?: boolean;
}

const OriginsDemandChart: React.FC<OriginsDemandChartProps> = ({ 
  className = '',
  hideHeader = false
}) => {
  const { chartData, isLoading, error, refresh } = useDemandasPorCoordenacao();

  return (
    <Card className={`bg-white overflow-hidden ${className}`}>
      {!hideHeader && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-blue-700">
              Origem das Demandas
            </CardTitle>
            <button
              onClick={() => refresh()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Comparativo semanal de demandas e notas</p>
        </CardHeader>
      )}
      <CardContent className={hideHeader ? "pt-2" : ""}>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">
            <p>Erro ao carregar dados: {error}</p>
          </div>
        ) : !chartData ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <p>Nenhum dado disponível</p>
          </div>
        ) : (
          <GroupedBarChart 
            data={chartData}
            height={300}
            className="mt-2"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OriginsDemandChart;
