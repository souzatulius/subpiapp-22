
import React from 'react';
import { ChartVisibility } from '../types';
import { ChartItem } from '../hooks/useChartItemsState';

interface CreateChartItemsProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  hiddenCharts: string[];
  expandedAnalyses: string[];
  analysisOnlyCharts: string[];
}

export function createChartItems(props: CreateChartItemsProps): ChartItem[] {
  // This is a stub implementation - replace with actual chart components
  const { chartVisibility, hiddenCharts } = props;
  
  const items: ChartItem[] = [];
  
  // Status Distribution Chart
  if (chartVisibility.statusDistribution) {
    items.push({
      id: 'statusDistribution',
      title: 'Distribuição de Status',
      component: <div>Status Distribution Chart</div>,
      isVisible: !hiddenCharts.includes('statusDistribution'),
      analysis: 'Análise da distribuição de status',
    });
  }
  
  // Resolution Time Chart
  if (chartVisibility.resolutionTime) {
    items.push({
      id: 'resolutionTime',
      title: 'Tempo de Resolução',
      component: <div>Resolution Time Chart</div>,
      isVisible: !hiddenCharts.includes('resolutionTime'),
      analysis: 'Análise do tempo de resolução',
    });
  }
  
  // Companies Chart
  if (chartVisibility.topCompanies) {
    items.push({
      id: 'topCompanies',
      title: 'Principais Empresas',
      component: <div>Top Companies Chart</div>,
      isVisible: !hiddenCharts.includes('topCompanies'),
      analysis: 'Análise das principais empresas',
    });
  }
  
  return items;
}
