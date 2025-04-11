
import React from 'react';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { ChartItem } from './types';

export const useChartItems = (): ChartItem[] => {
  return [
    {
      id: 'districtPerformance',
      title: 'Desempenho por Distrito',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Análise de performance por região',
      groupKey: 'performance'
    },
    {
      id: 'serviceTypes',
      title: 'Tipos de Serviços',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Distribuição dos serviços solicitados',
      groupKey: 'services'
    },
    {
      id: 'resolutionTime',
      title: 'Tempo de Resolução',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Tempo médio de atendimento',
      groupKey: 'performance'
    },
    {
      id: 'responsibility',
      title: 'Responsabilidades',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Distribuição de atribuições',
      groupKey: 'management'
    },
    {
      id: 'evolution',
      title: 'Evolução Temporal',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Análise ao longo do tempo',
      groupKey: 'time'
    },
    {
      id: 'departmentComparison',
      title: 'Comparação de Departamentos',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Comparativo entre áreas',
      groupKey: 'management'
    },
    {
      id: 'oldestPendingList',
      title: 'Pendências Antigas',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Ordens de serviço pendentes há mais tempo',
      groupKey: 'pending'
    },
    {
      id: 'statusDistribution',
      title: 'Distribuição por Status',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Análise do status das demandas',
      groupKey: 'status'
    },
    {
      id: 'topCompanies',
      title: 'Melhores Empresas',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Ranking de prestadores de serviço',
      groupKey: 'companies'
    },
    {
      id: 'districtDistribution',
      title: 'Distribuição por Distrito',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Cobertura geográfica das demandas',
      groupKey: 'geography'
    },
    {
      id: 'servicesByDepartment',
      title: 'Serviços por Departamento',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Quais áreas atendem quais tipos de serviço',
      groupKey: 'services'
    },
    {
      id: 'servicesByDistrict',
      title: 'Serviços por Distrito',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Quais serviços são mais solicitados em cada região',
      groupKey: 'geography'
    },
    {
      id: 'timeComparison',
      title: 'Comparativo Temporal',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Análise comparativa entre períodos',
      groupKey: 'time'
    },
    {
      id: 'dailyDemands',
      title: 'Demandas Diárias',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Volume de solicitações por dia',
      groupKey: 'time'
    },
    {
      id: 'statusTransition',
      title: 'Transição de Status',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Como as demandas avançam de status',
      groupKey: 'status'
    },
    {
      id: 'closureTime',
      title: 'Tempo até Fechamento',
      icon: <LineChart className="h-5 w-5" />,
      description: 'Dias até conclusão de serviços',
      groupKey: 'performance'
    },
    {
      id: 'neighborhoodComparison',
      title: 'Comparação de Bairros',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Desempenho entre diferentes bairros',
      groupKey: 'geography'
    },
    {
      id: 'districtEfficiencyRadar',
      title: 'Radar de Eficiência',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Análise multidimensional de distritos',
      groupKey: 'performance'
    },
    {
      id: 'externalDistricts',
      title: 'Distritos Externos',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Demandas fora da região de atuação',
      groupKey: 'geography'
    },
    {
      id: 'efficiencyImpact',
      title: 'Impacto na Eficiência',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Fatores que afetam o desempenho',
      groupKey: 'analysis'
    },
    {
      id: 'criticalStatus',
      title: 'Status Críticos',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Identificação de pontos de atenção',
      groupKey: 'status'
    },
    {
      id: 'serviceDiversity',
      title: 'Diversidade de Serviços',
      icon: <PieChart className="h-5 w-5" />,
      description: 'Análise da variedade de demandas',
      groupKey: 'services'
    }
  ];
};

export default useChartItems;
