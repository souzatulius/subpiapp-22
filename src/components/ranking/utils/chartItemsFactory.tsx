
import React from 'react';
import { ChartVisibility, ChartItem } from '../types';

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
  
  // District Performance Chart
  if (chartVisibility.districtPerformance) {
    items.push({
      id: 'districtPerformance',
      title: 'Performance por Distrito',
      component: <div>District Performance Chart</div>,
      isVisible: !hiddenCharts.includes('districtPerformance'),
      analysis: 'Análise da performance por distrito',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    });
  }
  
  // Status Distribution Chart
  if (chartVisibility.statusDistribution) {
    items.push({
      id: 'statusDistribution',
      title: 'Distribuição por Status',
      component: <div>Status Distribution Chart</div>,
      isVisible: !hiddenCharts.includes('statusDistribution'),
      analysis: 'Análise da distribuição de status',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
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
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    });
  }
  
  // Top Companies Chart
  if (chartVisibility.topCompanies) {
    items.push({
      id: 'topCompanies',
      title: 'Top Empresas',
      component: <div>Top Companies Chart</div>,
      isVisible: !hiddenCharts.includes('topCompanies'),
      analysis: 'Análise das principais empresas',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    });
  }
  
  // Responsibility Chart
  if (chartVisibility.responsibility) {
    items.push({
      id: 'responsibility',
      title: 'Responsabilidade',
      component: <div>Responsibility Chart</div>,
      isVisible: !hiddenCharts.includes('responsibility'),
      analysis: 'Análise da responsabilidade',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    });
  }
  
  return items;
}
