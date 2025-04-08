
import React, { useMemo } from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { AreaChart } from '../charts/AreaChart';
import { useChartData } from './charts/useChartData';
import { useChartConfigs } from './charts/useChartConfigs';

export const useChartComponents = () => {
  const { 
    problemas, 
    origens, 
    responseTimes, 
    coordinations, 
    mediaTypes, 
    isLoading 
  } = useChartData();
  
  const { chartColors } = useChartConfigs();

  // Prepare chart components based on the available data
  const chartComponents = useMemo(() => {
    // Return empty/placeholder charts if data is loading or not available
    if (isLoading) {
      return {
        distribuicaoPorTemas: (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ),
        origemDemandas: (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-orange-500 border-r-transparent border-b-orange-200 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ),
        tempoMedioResposta: (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ),
        performanceArea: (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-orange-500 border-r-transparent border-b-orange-200 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ),
        notasEmitidas: (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-transparent rounded-full animate-spin"></div>
          </div>
        )
      };
    }

    return {
      distribuicaoPorTemas: (
        <PieChart 
          data={problemas && problemas.length > 0 ? problemas : [{ name: 'Sem dados', value: 1 }]}
          colorSet="default"
          showLabels={true}
          showOnlyPercentage={true}
        />
      ),
      origemDemandas: (
        <BarChart 
          data={origens && origens.length > 0 ? origens : [{ name: 'Sem dados', value: 0 }]}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'value', name: 'Solicitações', color: chartColors[1] }
          ]}
        />
      ),
      tempoMedioResposta: (
        <LineChart 
          data={responseTimes && responseTimes.length > 0 ? responseTimes : [{ name: 'Sem dados', Demandas: 0, Aprovacao: 0 }]}
          xAxisDataKey="name"
          yAxisTicks={[10, 20, 50, 60, 90]} 
          lines={[
            { dataKey: 'Demandas', name: 'Respostas da coordenação', color: chartColors[0] },
            { dataKey: 'Aprovacao', name: 'Aprovação da nota', color: chartColors[1] }
          ]}
        />
      ),
      performanceArea: (
        <BarChart 
          data={coordinations && coordinations.length > 0 ? coordinations : [{ name: 'Sem dados', Demandas: 0 }]}
          xAxisDataKey="name"
          bars={[
            { dataKey: 'Demandas', name: 'Demandas no mês', color: chartColors[1] }
          ]}
          horizontal={true}
        />
      ),
      notasEmitidas: (
        <AreaChart 
          data={mediaTypes && mediaTypes.length > 0 ? mediaTypes : [{ name: 'Sem dados', Quantidade: 0 }]}
          xAxisDataKey="name"
          areas={[
            { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0], fillOpacity: 0.6 }
          ]}
        />
      )
    };
  }, [problemas, origens, responseTimes, coordinations, mediaTypes, isLoading, chartColors]);

  return { chartComponents };
};
