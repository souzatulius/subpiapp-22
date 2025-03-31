
import React from 'react';
import { useChartData } from './charts/useChartData';
import { useMainChartComponents } from './charts/useMainChartComponents';
import { useRankingChartComponents } from './charts/useRankingChartComponents';

export interface ChartData {
  name: string;
  value?: number;
  Demandas?: number;
  Quantidade?: number;
  Notas?: number;
  Respostas?: number;
  Solicitações?: number;
  Satisfação?: number;
}

export const useChartComponents = () => {
  const chartData = useChartData();
  const { chartComponents } = useMainChartComponents();
  const { rankingChartComponents } = useRankingChartComponents();

  return {
    chartComponents,
    rankingChartComponents,
    ...chartData
  };
};
