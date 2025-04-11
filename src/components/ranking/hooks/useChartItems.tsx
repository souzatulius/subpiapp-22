
import React, { useState, useEffect } from 'react';
import { ChartItem } from '../../../types/ranking';
import { generateFakeAnalysis } from './useChartItemsState';
import InsufficientDataMessage from '../charts/InsufficientDataMessage';

interface UseChartItemsProps {
  chartData: any;
  isLoading: boolean;
  sgzData: any[] | null;
  painelData: any[] | null;
  isSimulationActive: boolean;
  hasData: boolean;
}

export const useChartItems = ({
  chartData,
  isLoading,
  sgzData,
  painelData,
  isSimulationActive,
  hasData
}: UseChartItemsProps) => {
  const [chartItems, setChartItems] = useState<ChartItem[]>([]);

  // Generate chart items based on available data
  useEffect(() => {
    // Mock chart components for demo purposes
    const EvolutionChart = () => 
      hasData ? 
        <div>Evolution Chart</div> : 
        <InsufficientDataMessage message="Dados insuficientes para mostrar evolução" />;
    
    const ServiceTypesChart = () => 
      hasData ? 
        <div>Service Types Chart</div> : 
        <InsufficientDataMessage message="Dados insuficientes para mostrar tipos de serviço" />;
    
    const ResolutionTimeChart = () => 
      hasData ? 
        <div>Resolution Time Chart</div> : 
        <InsufficientDataMessage message="Dados insuficientes para calcular tempos de resolução" />;
    
    const items: ChartItem[] = [
      {
        id: 'evolution-chart',
        title: 'Serviços em Andamento',
        component: <EvolutionChart />,
        isVisible: true,
        analysis: generateFakeAnalysis('Evolução'),
        isAnalysisExpanded: false,
        showAnalysisOnly: false
      },
      {
        id: 'service-types-chart',
        title: 'Distribuição por Tipo de Serviço',
        component: <ServiceTypesChart />,
        isVisible: true,
        analysis: generateFakeAnalysis('Tipos de Serviço'),
        isAnalysisExpanded: false,
        showAnalysisOnly: false
      },
      {
        id: 'resolution-time-chart',
        title: 'Tempo Médio de Execução',
        component: <ResolutionTimeChart />,
        isVisible: true,
        analysis: generateFakeAnalysis('Tempo de Execução'),
        isAnalysisExpanded: false,
        showAnalysisOnly: false
      }
    ];
    
    setChartItems(items);
  }, [sgzData, painelData, isLoading, chartData, isSimulationActive, hasData]);
  
  return { chartItems };
};
