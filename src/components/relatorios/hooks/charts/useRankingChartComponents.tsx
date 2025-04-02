
import React, { useMemo } from 'react';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';

import { useChartData } from './useChartData';
import { useChartConfigs } from './useChartConfigs';
import { ChartComponentsCollection } from './types';

export const useRankingChartComponents = () => {
  const { 
    serviceDiversityData,
    servicesByDistrictData,
    serviceTypesData,
    statusDistributionData,
    timeComparisonData,
    topCompaniesData,
    statusTransitionData
  } = useChartData();
  
  const { chartColors } = useChartConfigs();
  
  // Ranking chart components
  const rankingChartComponents = useMemo<ChartComponentsCollection>(() => ({
    'serviceDiversity': (
      <BarChart 
        data={serviceDiversityData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'servicesByDistrict': (
      <BarChart 
        data={servicesByDistrictData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[1] }
        ]}
      />
    ),
    'serviceTypes': (
      <BarChart 
        data={serviceTypesData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[2] }
        ]}
      />
    ),
    'statusDistribution': (
      <BarChart 
        data={statusDistributionData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Quantidade', name: 'Quantidade', color: chartColors[3] }
        ]}
      />
    ),
    'timeComparison': (
      <BarChart 
        data={timeComparisonData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Dias', name: 'Dias', color: chartColors[0] }
        ]}
      />
    ),
    'topCompanies': (
      <BarChart 
        data={topCompaniesData}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Concluídas', name: 'Concluídas', color: chartColors[1] }
        ]}
      />
    ),
    'statusTransition': (
      <LineChart 
        data={statusTransitionData}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Aberto', name: 'Aberto', color: chartColors[2] },
          { dataKey: 'EmAndamento', name: 'Em Andamento', color: chartColors[1] },
          { dataKey: 'Concluído', name: 'Concluído', color: chartColors[0] }
        ]}
      />
    ),
  }), [
    serviceDiversityData,
    servicesByDistrictData,
    serviceTypesData,
    statusDistributionData,
    timeComparisonData,
    topCompaniesData,
    statusTransitionData,
    chartColors
  ]);

  return { rankingChartComponents };
};
