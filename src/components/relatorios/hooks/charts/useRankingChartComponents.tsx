
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
  
  // Ranking chart components
  const rankingChartComponents = useMemo<ChartComponentsCollection>(() => ({
    'serviceDiversity': (
      <BarChart 
        data={problemas || []}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'servicesByDistrict': (
      <BarChart 
        data={coordinations || [
          { name: 'CPO', Demandas: 92 },
          { name: 'CPDU', Demandas: 87 },
          { name: 'Governo Local', Demandas: 82 },
          { name: 'Jurídico', Demandas: 75 },
          { name: 'Finanças', Demandas: 68 },
        ]}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Quantidade', color: chartColors[1] }
        ]}
      />
    ),
    'serviceTypes': (
      <BarChart 
        data={problemas || []}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[2] }
        ]}
      />
    ),
    'statusDistribution': (
      <BarChart 
        data={origens || []}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[3] }
        ]}
      />
    ),
    'timeComparison': (
      <BarChart 
        data={responseTimes || []}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Dias', color: chartColors[0] }
        ]}
      />
    ),
    'topCompanies': (
      <BarChart 
        data={coordinations || []}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Concluídas', color: chartColors[1] }
        ]}
      />
    ),
    'statusTransition': (
      <LineChart 
        data={mediaTypes || []}
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
