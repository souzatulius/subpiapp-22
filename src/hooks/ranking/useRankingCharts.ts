import { useState, useEffect } from 'react';
import { ChartConfig } from '@/types/ranking';
import { ChartVisibility } from '@/components/ranking/types';

export const useRankingCharts = () => {
  // Initialize chart visibility state with the correct structure
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    districtPerformance: true,
    serviceTypes: true,
    resolutionTime: true,
    responsibility: true,
    evolution: true,
    departmentComparison: true,
    oldestPendingList: true,
    statusDistribution: true,
    topCompanies: true,
    districtDistribution: true,
    servicesByDepartment: true,
    servicesByDistrict: true,
    timeComparison: true,
    dailyDemands: true,
    statusTransition: true,
    closureTime: true,
    neighborhoodComparison: true,
    districtEfficiencyRadar: true,
    externalDistricts: true,
    efficiencyImpact: true,
    criticalStatus: true,
    serviceDiversity: true,
  });

  // Mock charts data
  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: 'evServ',
      title: 'Evolução de Serviços em Andamento',
      subtitle: 'Quantidade de pedidos por status',
      value: '157',
      component: "Gráfico de Evolução"
    },
    {
      id: 'serviceDistribution',
      title: 'Distribuição por Serviço',
      subtitle: 'Tipos de serviços mais demandados',
      value: '45%',
      component: "Gráfico de Distribuição"
    },
    {
      id: 'executionTime',
      title: 'Tempo Médio de Execução',
      subtitle: 'Dias até finalização por tipo de serviço',
      value: '18,5 dias',
      component: "Gráfico de Tempo"
    },
    {
      id: 'districtsWronglyIncluded',
      title: 'Distritos Incluídos Erroneamente',
      subtitle: 'Locais fora da área de atuação',
      value: '12',
      component: "Gráfico de Distritos"
    },
    {
      id: 'compByArea',
      title: 'Comparativo por Áreas',
      subtitle: 'Desempenho por coordenação',
      value: 'CTO 87%',
      component: "Gráfico Comparativo"
    },
    {
      id: 'top10OldestPending',
      title: 'Top 10 Pendências Antigas',
      subtitle: 'Ordens de serviço com maior tempo em aberto',
      value: '245 dias',
      component: "Gráfico de Pendências"
    },
    {
      id: 'bottlenecks',
      title: 'Gargalos Identificados',
      subtitle: 'Principais pontos de atenção',
      value: '5 críticos',
      component: "Gráfico de Gargalos"
    },
    {
      id: 'idealRanking',
      title: 'Ranking Ideal',
      subtitle: 'Posição sem fatores externos',
      value: '2º lugar',
      component: "Gráfico de Ranking"
    },
    {
      id: 'sgzRanking',
      title: 'SGZ vs Ranking',
      subtitle: 'Comparação entre sistemas',
      value: '60% match',
      component: "Gráfico de SGZ"
    },
    {
      id: 'attentionPoints',
      title: 'Pontos de Atenção',
      subtitle: 'Principais problemas identificados',
      value: '8 pontos',
      component: "Gráfico de Pontos"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState('overview');
  const [planilhaData, setPlanilhaData] = useState<any[]>([]);
  const [painelData, setPainelData] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);
  const [sgzData, setSgzData] = useState<any[] | null>([]);

  // Toggle chart visibility
  const toggleChartVisibility = (chartId: string) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  };

  // Mock data refresh function
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Initialize mock data
  useEffect(() => {
    setPlanilhaData([{ id: 1, name: 'Mock Data' }]);
    setPainelData([{ id: 1, name: 'Painel Data' }]);
    setSgzData([{ id: 1, name: 'SGZ Data' }]);
    setUploadId('mock-upload-id');
  }, []);

  return {
    charts,
    isLoading,
    refreshData,
    chartVisibility,
    toggleChartVisibility,
    setChartVisibility,
    lastUpdated,
    currentTab,
    setCurrentTab,
    planilhaData,
    setPlanilhaData,
    painelData,
    setPainelData,
    sgzData,
    setSgzData,
    uploadId,
    setUploadId
  };
};
