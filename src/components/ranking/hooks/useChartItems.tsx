
import React, { useState, useEffect } from 'react';
import { ChartItem } from './useChartItemsState';
import EvolutionChart from '../charts/EvolutionChart';
import ServiceTypesChart from '../charts/ServiceTypesChart';
import ResolutionTimeChart from '../charts/ResolutionTimeChart';
import DistrictPerformanceChart from '../charts/DistrictPerformanceChart';
import DepartmentComparisonChart from '../charts/DepartmentComparisonChart';
import OldestPendingList from '../charts/OldestPendingList';
import ResponsibilityChart from '../charts/ResponsibilityChart';
import RankingSimulationChart from '../charts/RankingSimulationChart';
import SgzRankingComparisonChart from '../charts/SgzRankingComparisonChart';
import AttentionPointsChart from '../charts/AttentionPointsChart';

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
    if (hasData) {
      const items: ChartItem[] = [
        {
          id: 'evolution-chart',
          title: 'Serviços em Andamento',
          component: (
            <EvolutionChart 
              data={chartData.evolution || {}} 
              sgzData={sgzData} 
              painelData={painelData} 
              isLoading={isLoading} 
              isSimulationActive={isSimulationActive} 
            />
          ),
          isVisible: true,
          analysis: 'Análise da evolução diária e semanal das porcentagens de OS Fechadas, Pendentes e Canceladas.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'service-types-chart',
          title: 'Distribuição por Tipo de Serviço',
          component: <ServiceTypesChart data={chartData.serviceTypes || {}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Distribuição de ordens de serviço por tipo/categoria de serviço.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'resolution-time-chart',
          title: 'Tempo Médio de Execução',
          component: <ResolutionTimeChart data={chartData.resolutionTime || {}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Análise do tempo médio de execução por tipo de serviço.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'district-performance-chart',
          title: 'Distritos incluídos indevidamente',
          component: <DistrictPerformanceChart data={chartData.districtPerformance || {}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Comparativo de performance entre os distritos, mostrando taxa de resolução e tempo médio.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'department-comparison-chart',
          title: 'Comparação por Áreas Técnicas',
          component: <DepartmentComparisonChart data={chartData.departmentComparison || {}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Comparação entre os departamentos técnicos: STLP, STM e STPO.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'oldest-pending-list',
          title: 'Top 10 Pendências Mais Antigas',
          component: <OldestPendingList data={chartData.oldestPending || {}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Lista das 10 ordens de serviço pendentes mais antigas.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'responsibility-chart',
          title: 'Gargalos e Problemas',
          component: <ResponsibilityChart data={chartData.responsibility || {}} sgzData={sgzData} painelData={painelData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Distribuição das ordens de serviço entre responsabilidade da Subprefeitura e entidades externas.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        // Adding the new charts
        {
          id: 'ranking-simulation-chart',
          title: 'Como estaria nosso ranking',
          component: <RankingSimulationChart data={{}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Simulação do ranking da subprefeitura sem interferências externas e com OS corretamente fechadas.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'sgz-ranking-comparison-chart',
          title: 'SGZ x Ranking das Subs',
          component: <SgzRankingComparisonChart data={{}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Avaliação de detalhes das OS e o que não é levado em consideração no ranking oficial.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        },
        {
          id: 'attention-points-chart',
          title: 'Pontos de Atenção',
          component: <AttentionPointsChart data={{}} sgzData={sgzData} isLoading={isLoading} isSimulationActive={isSimulationActive} />,
          isVisible: true,
          analysis: 'Avaliação de problemas com registro no Portal 156 e ordens de serviço paradas.',
          isAnalysisExpanded: false,
          showAnalysisOnly: false
        }
      ];
      
      setChartItems(items);
    }
  }, [sgzData, painelData, isLoading, chartData, isSimulationActive, hasData]);
  
  return { chartItems };
};
