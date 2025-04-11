
import { useState } from 'react';
import { ChartItem } from '../types';

export const useChartItems = () => {
  const [items, setItems] = useState<ChartItem[]>([
    {
      id: 'status-distribution',
      title: 'Distribuição por Status',
      description: 'Visão geral dos serviços por status',
      component: 'StatusDistributionChart',
      isVisible: true,
      analysis: 'A maioria dos serviços está em andamento, seguido por pendentes e concluídos.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 1245
    },
    {
      id: 'top-companies',
      title: 'Empresas com mais Demandas',
      description: 'Ranking de empresas com maior número de solicitações',
      component: 'TopCompaniesChart',
      isVisible: true,
      analysis: 'As empresas A, B e C são responsáveis por 65% de todas as demandas registradas.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 354
    },
    {
      id: 'district-distribution',
      title: 'Demandas por Distrito',
      description: 'Distribuição geográfica das demandas por distrito',
      component: 'DistrictDistributionChart',
      isVisible: true,
      analysis: 'O distrito Central concentra 40% das demandas, seguido pelo Norte com 25%.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 892
    },
    {
      id: 'services-department',
      title: 'Serviços por Departamento',
      description: 'Distribuição dos serviços entre departamentos',
      component: 'ServicesByDepartmentChart',
      isVisible: true,
      analysis: 'O departamento de Manutenção lidera com 35% dos serviços, seguido por Infraestrutura com 28%.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 736
    },
    {
      id: 'services-district',
      title: 'Serviços por Distrito',
      description: 'Análise dos tipos de serviço por distrito',
      component: 'ServicesByDistrictChart',
      isVisible: true,
      analysis: 'Manutenção de vias é o serviço mais solicitado em todos os distritos.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 578
    },
    {
      id: 'time-comparison',
      title: 'Comparação Temporal',
      description: 'Evolução das demandas ao longo do tempo',
      component: 'TimeComparisonChart',
      isVisible: true,
      analysis: 'Houve um aumento de 22% nas demandas em relação ao mesmo período do ano anterior.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 1452
    },
    {
      id: 'daily-demands',
      title: 'Demandas Diárias',
      description: 'Variação no número de demandas por dia da semana',
      component: 'DailyDemandsChart',
      isVisible: true,
      analysis: 'Segunda-feira é o dia com maior número de registros, enquanto domingo tem o menor.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 245
    },
    {
      id: 'status-transition',
      title: 'Transição de Status',
      description: 'Fluxo das demandas entre diferentes status',
      component: 'StatusTransitionChart',
      isVisible: true,
      analysis: '25% das demandas permanecem no status "Em Análise" por mais de 5 dias.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 634
    },
    {
      id: 'closure-time',
      title: 'Tempo para Conclusão',
      description: 'Análise do tempo necessário para concluir demandas',
      component: 'ClosureTimeChart',
      isVisible: true,
      analysis: 'O tempo médio para conclusão é de 8,3 dias, com desvio padrão de 3,2 dias.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 893
    },
    {
      id: 'neighborhood-comparison',
      title: 'Comparação de Bairros',
      description: 'Análise comparativa entre diferentes bairros',
      component: 'NeighborhoodComparisonChart',
      isVisible: true,
      analysis: 'Os bairros Centro, Vila Nova e Jardim apresentam padrões similares de demandas.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 542
    },
    {
      id: 'district-efficiency',
      title: 'Eficiência por Distrito',
      description: 'Radar de eficiência na resolução por distrito',
      component: 'DistrictEfficiencyRadar',
      isVisible: true,
      analysis: 'O distrito Sul apresenta a maior eficiência, com 87% de resolução no prazo.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 723
    },
    {
      id: 'external-districts',
      title: 'Distritos Externos',
      description: 'Demandas originadas de distritos externos',
      component: 'ExternalDistrictsChart',
      isVisible: true,
      analysis: '15% das demandas são originadas de distritos que não pertencem à área de atuação direta.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 312
    },
    {
      id: 'efficiency-impact',
      title: 'Impacto na Eficiência',
      description: 'Análise de fatores que impactam a eficiência',
      component: 'EfficiencyImpactChart',
      isVisible: true,
      analysis: 'Volume de demandas e disponibilidade de recursos são os fatores de maior impacto.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 678
    },
    {
      id: 'critical-status',
      title: 'Status Críticos',
      description: 'Identificação de status com maior tempo de permanência',
      component: 'CriticalStatusChart',
      isVisible: true,
      analysis: '"Em aprovação" é o status onde as demandas permanecem por mais tempo.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 389
    },
    {
      id: 'service-diversity',
      title: 'Diversidade de Serviços',
      description: 'Análise da variedade de serviços solicitados',
      component: 'ServiceDiversityChart',
      isVisible: true,
      analysis: 'Cada distrito solicita em média 12 tipos diferentes de serviços por mês.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 456
    },
    {
      id: 'district-performance',
      title: 'Performance de Distritos',
      description: 'Análise comparativa da performance entre distritos',
      component: 'DistrictPerformanceChart',
      isVisible: true,
      analysis: 'Os distritos Leste e Norte apresentaram melhoria de 15% na eficiência.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 824
    },
    {
      id: 'service-types',
      title: 'Tipos de Serviço',
      description: 'Distribuição por tipos de serviço solicitados',
      component: 'ServiceTypesChart',
      isVisible: true,
      analysis: 'Manutenção de vias e iluminação pública representam 40% das solicitações.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 567
    },
    {
      id: 'resolution-time',
      title: 'Tempo de Resolução',
      description: 'Análise do tempo necessário para resolução por tipo',
      component: 'ResolutionTimeChart',
      isVisible: true,
      analysis: 'Serviços de água e esgoto possuem o menor tempo médio de resolução (3,2 dias).',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 713
    },
    {
      id: 'responsibility',
      title: 'Responsabilidade',
      description: 'Distribuição de responsabilidades por departamento',
      component: 'ResponsibilityChart',
      isVisible: true,
      analysis: 'O departamento de Operações é responsável por 45% das demandas em aberto.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 432
    },
    {
      id: 'evolution',
      title: 'Evolução Anual',
      description: 'Análise da evolução das demandas ao longo dos anos',
      component: 'EvolutionChart',
      isVisible: true,
      analysis: 'Crescimento médio anual de 8% nas demandas nos últimos 3 anos.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 921
    },
    {
      id: 'department-comparison',
      title: 'Comparativo por Departamento',
      description: 'Comparação de desempenho entre departamentos',
      component: 'DepartmentComparisonChart',
      isVisible: true,
      analysis: 'O departamento de Zeladoria apresenta o melhor índice de satisfação (92%).',
      isAnalysisExpanded: false,
      showAnalysisOnly: false,
      value: 648
    }
  ]);

  const toggleVisibility = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isVisible: !item.isVisible } : item
    ));
  };

  const toggleAnalysis = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isAnalysisExpanded: !item.isAnalysisExpanded } : item
    ));
  };

  const toggleView = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, showAnalysisOnly: !item.showAnalysisOnly } : item
    ));
  };

  const reorderItems = (reorderedItems: ChartItem[]) => {
    setItems(reorderedItems);
  };

  return { items, toggleVisibility, toggleAnalysis, toggleView, reorderItems };
};

export default useChartItems;
