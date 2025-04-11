
import { useMemo } from 'react';
import { ChartItem } from '../types';
import DistrictPerformanceChart from '../charts/DistrictPerformanceChart';
import ServiceTypesChart from '../charts/ServiceTypesChart';
import ResolutionTimeChart from '../charts/ResolutionTimeChart';
import ResponsibilityChart from '../charts/ResponsibilityChart';
import EvolutionChart from '../charts/EvolutionChart';
import DepartmentComparisonChart from '../charts/DepartmentComparisonChart';
import OldestPendingList from '../charts/OldestPendingList';
import StatusDistributionChart from '../charts/StatusDistributionChart';
import ServiceDiversityChart from '../charts/ServiceDiversityChart';
import TimeComparisonChart from '../charts/TimeComparisonChart';
import StatusTransitionChart from '../charts/StatusTransitionChart';

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
  
  const chartItems = useMemo<ChartItem[]>(() => {
    if (!hasData && !isLoading) return [];
    
    const chartComponents = [
      {
        id: 'districtPerformance',
        title: 'Performance por Distrito',
        component: <DistrictPerformanceChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Análise de desempenho por distrito, considerando tempo de resolução e eficiência no atendimento das demandas.',
        isVisible: true
      },
      {
        id: 'serviceTypes',
        title: 'Tipos de Serviço',
        component: <ServiceTypesChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Distribuição dos diferentes tipos de serviço solicitados, destacando as áreas com maior demanda.',
        isVisible: true
      },
      {
        id: 'resolutionTime',
        title: 'Tempo de Resolução',
        component: <ResolutionTimeChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Análise do tempo médio para resolução de demandas, segmentado por tipo de serviço e distrito.',
        isVisible: true
      },
      {
        id: 'responsibility',
        title: 'Responsabilidade',
        component: <ResponsibilityChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      painelData={painelData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Distribuição de responsabilidades entre departamentos e setores, indicando carga de trabalho e eficiência.',
        isVisible: true
      },
      {
        id: 'evolution',
        title: 'Evolução de Demandas',
        component: <EvolutionChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      painelData={painelData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Tendência temporal de abertura e fechamento de demandas, mostrando padrões sazonais e evolução ao longo do tempo.',
        isVisible: true
      },
      {
        id: 'departmentComparison',
        title: 'Comparativo de Departamentos',
        component: <DepartmentComparisonChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Comparação de desempenho entre departamentos, considerando volume de demandas e tempo médio de resolução.',
        isVisible: true
      },
      {
        id: 'oldestPendingList',
        title: 'Demandas Mais Antigas',
        component: <OldestPendingList 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Lista das demandas pendentes mais antigas, destacando casos críticos que necessitam atenção prioritária.',
        isVisible: true
      },
      {
        id: 'statusDistribution',
        title: 'Distribuição por Status',
        component: <StatusDistributionChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Visualização da proporção de demandas em cada status, permitindo identificar gargalos no processo.',
        isVisible: true
      },
      {
        id: 'serviceDiversity',
        title: 'Diversidade de Serviços',
        component: <ServiceDiversityChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Análise da variedade de serviços solicitados, destacando a complexidade de operações por distrito.',
        isVisible: true
      },
      {
        id: 'timeComparison',
        title: 'Comparativo de Tempo',
        component: <TimeComparisonChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Comparação do tempo médio de resolução entre diferentes serviços e departamentos ao longo do tempo.',
        isVisible: true
      },
      {
        id: 'statusTransition',
        title: 'Transição de Status',
        component: <StatusTransitionChart 
                      data={chartData} 
                      sgzData={sgzData} 
                      isLoading={isLoading} 
                      isSimulationActive={isSimulationActive} 
                   />,
        analysis: 'Evolução da transição entre status, identificando padrões e possíveis melhorias no fluxo de trabalho.',
        isVisible: true
      }
    ];
    
    return chartComponents;
  }, [chartData, isLoading, sgzData, painelData, isSimulationActive, hasData]);
  
  return { chartItems };
};
