
import React, { useMemo } from 'react';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';

// Fix the import path to use the local hook instead of the ranking one
import { useChartData } from '../useChartData';
import { useChartConfigs } from './useChartConfigs';
import { ChartComponentsCollection } from './types';

export const useRankingChartComponents = () => {
  const { 
    problemas,
    origens,
    responseTimes,
    coordinations,
    mediaTypes,
    isLoading 
  } = useChartData();
  
  const { chartColors } = useChartConfigs();
  
  // Ensure data is always an array with a proper fallback
  const ensureArray = (data: any[] | null | undefined) => Array.isArray(data) ? data : [];
  
  // Ranking chart components
  const rankingChartComponents = useMemo<ChartComponentsCollection>(() => ({
    'serviceDiversity': (
      <BarChart 
        data={ensureArray(problemas)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'servicesByDistrict': (
      <BarChart 
        data={ensureArray(coordinations)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Quantidade', color: chartColors[1] }
        ]}
      />
    ),
    'serviceTypes': (
      <BarChart 
        data={ensureArray(problemas)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[2] }
        ]}
      />
    ),
    'statusDistribution': (
      <BarChart 
        data={ensureArray(origens)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[3] }
        ]}
      />
    ),
    'timeComparison': (
      <BarChart 
        data={ensureArray(responseTimes)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Dias', color: chartColors[0] }
        ]}
      />
    ),
    'topCompanies': (
      <BarChart 
        data={ensureArray(coordinations)}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Concluídas', color: chartColors[1] }
        ]}
      />
    ),
    'statusTransition': (
      <LineChart 
        data={ensureArray(mediaTypes)}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Quantidade', name: 'Aberto', color: chartColors[2] },
          { dataKey: 'Quantidade', name: 'Em Andamento', color: chartColors[1] },
          { dataKey: 'Quantidade', name: 'Concluído', color: chartColors[0] }
        ]}
      />
    ),
  }), [problemas, origens, responseTimes, coordinations, mediaTypes, chartColors]);

  return { rankingChartComponents, isLoading };
};
