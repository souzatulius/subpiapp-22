
import React, { useMemo } from 'react';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';

// Update the import path to point to the correct location
import { useChartData as useRankingChartData } from '@/hooks/ranking/useChartData';
import { useChartConfigs } from './useChartConfigs';
import { ChartComponentsCollection } from './types';

export const useRankingChartComponents = () => {
  const { 
    chartData,
    isLoading 
  } = useRankingChartData({ 
    dataInicio: '', 
    dataFim: '', 
    distritos: [], 
    tiposServico: [], 
    status: [] 
  });
  
  const { chartColors } = useChartConfigs();
  
  // Extrair dados dos gráficos ou usar mock caso não estejam disponíveis
  const problemas = chartData?.services?.datasets?.[0]?.data || [];
  const origens = chartData?.status?.datasets?.[0]?.data || [];
  const responseTimes = chartData?.resolutionTime?.datasets?.[0]?.data || [];
  const coordinations = chartData?.occurrences?.datasets?.[0]?.data || [];
  
  // Mock data como fallback
  const mockProblemas = [
    { name: 'Poda de Árvores', value: 45 },
    { name: 'Bueiros', value: 32 },
    { name: 'Remoção de galhos', value: 18 },
    { name: 'Limpeza', value: 25 },
    { name: 'Parques e praças', value: 15 },
  ];
  
  const mockMediaTypes = [
    { name: 'Seg', Quantidade: 10 },
    { name: 'Ter', Quantidade: 15 },
    { name: 'Qua', Quantidade: 12 },
    { name: 'Qui', Quantidade: 18 },
    { name: 'Sex', Quantidade: 22 },
    { name: 'Sáb', Quantidade: 14 },
    { name: 'Dom', Quantidade: 8 },
  ];
  
  // Ranking chart components
  const rankingChartComponents = useMemo<ChartComponentsCollection>(() => ({
    'serviceDiversity': (
      <BarChart 
        data={mockProblemas}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[0] }
        ]}
      />
    ),
    'servicesByDistrict': (
      <BarChart 
        data={[
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
        data={mockProblemas}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[2] }
        ]}
      />
    ),
    'statusDistribution': (
      <BarChart 
        data={[
          { name: 'Imprensa', value: 35 },
          { name: 'SMSUB', value: 45 },
          { name: 'Secom', value: 12 },
          { name: 'Internas', value: 8 },
        ]}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'value', name: 'Quantidade', color: chartColors[3] }
        ]}
      />
    ),
    'timeComparison': (
      <BarChart 
        data={[
          { name: 'Seg', Demandas: 120 },
          { name: 'Ter', Demandas: 90 },
          { name: 'Qua', Demandas: 60 },
          { name: 'Qui', Demandas: 180 },
          { name: 'Sex', Demandas: 75 },
          { name: 'Sáb', Demandas: 30 },
          { name: 'Dom', Demandas: 15 },
        ]}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Dias', color: chartColors[0] }
        ]}
      />
    ),
    'topCompanies': (
      <BarChart 
        data={[
          { name: 'CPO', Demandas: 92 },
          { name: 'CPDU', Demandas: 87 },
          { name: 'Governo Local', Demandas: 82 },
          { name: 'Jurídico', Demandas: 75 },
          { name: 'Finanças', Demandas: 68 },
        ]}
        xAxisDataKey="name"
        bars={[
          { dataKey: 'Demandas', name: 'Concluídas', color: chartColors[1] }
        ]}
      />
    ),
    'statusTransition': (
      <LineChart 
        data={mockMediaTypes}
        xAxisDataKey="name"
        lines={[
          { dataKey: 'Quantidade', name: 'Aberto', color: chartColors[2] },
          { dataKey: 'Quantidade', name: 'Em Andamento', color: chartColors[1] },
          { dataKey: 'Quantidade', name: 'Concluído', color: chartColors[0] }
        ]}
      />
    ),
  }), [chartColors]);

  return { rankingChartComponents };
};
