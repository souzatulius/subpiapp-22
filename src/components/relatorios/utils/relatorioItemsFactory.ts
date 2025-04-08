import { RelatorioItem } from '../hooks/useRelatorioItemsState';
import { nanoid } from 'nanoid';

interface CreateRelatorioItemsOptions {
  chartData: any;
  chartComponents: any;
  isLoading: boolean;
  hiddenItems: string[];
  expandedAnalyses: string[];
  analysisOnlyItems: string[];
}

export const createRelatorioItems = ({
  chartData,
  chartComponents,
  isLoading,
  hiddenItems,
  expandedAnalyses,
  analysisOnlyItems
}: CreateRelatorioItemsOptions): RelatorioItem[] => {
  const items: RelatorioItem[] = [];

  items.push({
    id: 'distribuicaoPorTemas',
    title: 'Distribuição por Temas',
    subtitle: 'Análise da distribuição de temas nas demandas',
    highlight: 'Obras Públicas lidera com 45%',
    component: chartComponents.TematicPieChart,
    props: {
      data: chartData.districts || [],
      dataKey: 'value',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9', '#8E9196'],
      showPercentage: true,
      showLabelsOutside: true
    },
    isHidden: hiddenItems.includes('distribuicaoPorTemas'),
    isAnalysisExpanded: expandedAnalyses.includes('distribuicaoPorTemas'),
    analysisText: 'Análise detalhada dos temas mais frequentes nas demandas. A categoria de Obras Públicas lidera com 45% do total, seguida por questões relacionadas a contratos e licitações.',
    isAnalysisOnly: analysisOnlyItems.includes('distribuicaoPorTemas'),
    order: 1
  });

  items.push({
    id: 'origemDemandas',
    title: 'Origem das Demandas',
    subtitle: 'Distribuição das demandas por origem',
    highlight: 'Imprensa representa 60%',
    component: chartComponents.DonutChart,
    props: {
      data: chartData.origins || [],
      dataKey: 'value',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9'],
      showPercentage: true,
      showLabelsOutside: true
    },
    isHidden: hiddenItems.includes('origemDemandas'),
    isAnalysisExpanded: expandedAnalyses.includes('origemDemandas'),
    analysisText: 'Análise da origem das demandas, com a Imprensa representando 60% do total, seguida por SMSUB com 25%.',
    isAnalysisOnly: analysisOnlyItems.includes('origemDemandas'),
    order: 2
  });

  items.push({
    id: 'tempoMedioResposta',
    title: 'Tempo Médio de Resposta',
    subtitle: 'Tempo médio de resposta por dia da semana',
    highlight: 'Melhor tempo na Quarta-feira',
    component: chartComponents.LineChart,
    props: {
      data: chartData.responseTimes || [],
      dataKey: 'Demandas',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9'],
      showPercentage: false,
      showLabelsOutside: false
    },
    isHidden: hiddenItems.includes('tempoMedioResposta'),
    isAnalysisExpanded: expandedAnalyses.includes('tempoMedioResposta'),
    analysisText: 'Análise do tempo médio de resposta por dia da semana, com o melhor tempo sendo registrado na Quarta-feira.',
    isAnalysisOnly: analysisOnlyItems.includes('tempoMedioResposta'),
    order: 3
  });

  items.push({
    id: 'performanceArea',
    title: 'Performance por Área',
    subtitle: 'Performance das áreas em relação às demandas',
    highlight: 'CPO lidera com 92%',
    component: chartComponents.BarChart,
    props: {
      data: chartData.coordinations || [],
      dataKey: 'Demandas',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9'],
      showPercentage: false,
      showLabelsOutside: false
    },
    isHidden: hiddenItems.includes('performanceArea'),
    isAnalysisExpanded: expandedAnalyses.includes('performanceArea'),
    analysisText: 'Análise da performance por área, com CPO liderando com 92% de performance em relação às demandas.',
    isAnalysisOnly: analysisOnlyItems.includes('performanceArea'),
    order: 4
  });

  items.push({
    id: 'notasEmitidas',
    title: 'Notas Emitidas',
    subtitle: 'Número de notas emitidas por status',
    highlight: '75% das notas são aprovadas',
    component: chartComponents.PieChart,
    props: {
      data: chartData.statuses || [],
      dataKey: 'value',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9'],
      showPercentage: true,
      showLabelsOutside: true
    },
    isHidden: hiddenItems.includes('notasEmitidas'),
    isAnalysisExpanded: expandedAnalyses.includes('notasEmitidas'),
    analysisText: 'Análise do número de notas emitidas por status, com 75% das notas sendo aprovadas.',
    isAnalysisOnly: analysisOnlyItems.includes('notasEmitidas'),
    order: 5
  });
  
  // Add new e-SIC items
  items.push({
    id: 'temasESIC',
    title: 'Demandas do e-SIC',
    subtitle: 'Temas dos Processos',
    highlight: '32% são Obras Públicas',
    component: chartComponents.TematicPieChart,
    props: {
      data: chartData.origins || [],
      dataKey: 'value',
      nameKey: 'name',
      colors: ['#F97316', '#6E59A5', '#403E43', '#0EA5E9', '#8E9196'],
      showPercentage: true,
      showLabelsOutside: true
    },
    isHidden: hiddenItems.includes('temasESIC'),
    isAnalysisExpanded: expandedAnalyses.includes('temasESIC'),
    analysisText: 'Análise detalhada dos temas mais frequentes nas solicitações de acesso à informação. A categoria de Obras Públicas lidera com 32% do total, seguida por questões relacionadas a contratos e licitações.',
    isAnalysisOnly: analysisOnlyItems.includes('temasESIC'),
    order: 7
  });
  
  items.push({
    id: 'resolucaoESIC',
    title: 'Resolução do e-SIC',
    subtitle: 'Respostas e justificativas para solicitações',
    highlight: '76% respondidas no prazo',
    component: chartComponents.StackedBarChart,
    props: {
      data: chartData.statuses || [],
      colors: ['#F97316', '#403E43', '#6E59A5', '#0EA5E9'],
      dataKey: 'name',
      bars: [
        { dataKey: 'Respondidas', stackId: 'a' },
        { dataKey: 'Justificadas', stackId: 'a' },
        { dataKey: 'Pendentes', stackId: 'a' }
      ]
    },
    isHidden: hiddenItems.includes('resolucaoESIC'),
    isAnalysisExpanded: expandedAnalyses.includes('resolucaoESIC'),
    analysisText: 'Análise da resolução das solicitações e-SIC. 76% das demandas são respondidas dentro do prazo, enquanto 15% são justificadas com base legal e 9% ainda estão em processamento. A taxa de resolução está acima da média das subprefeituras.',
    isAnalysisOnly: analysisOnlyItems.includes('resolucaoESIC'),
    order: 8
  });
  
  // Sort items by order
  return items.sort((a, b) => a.order - b.order);
};
