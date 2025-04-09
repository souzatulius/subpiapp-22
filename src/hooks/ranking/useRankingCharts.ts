
import { useState, useEffect } from 'react';
import { ChartConfig, ChartVisibility } from '@/types/ranking';

export const useRankingCharts = () => {
  // Mock chart visibility state
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>({
    evServ: true,
    serviceDistribution: true,
    executionTime: true,
    districtsWronglyIncluded: true,
    compByArea: true,
    top10OldestPending: true,
    bottlenecks: true,
    idealRanking: true,
    sgzRanking: true,
    attentionPoints: true
  });

  // Mock charts data
  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: 'evServ',
      title: 'Evolução de Serviços em Andamento',
      subtitle: 'Quantidade de pedidos por status',
      value: '157',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Evolução</div>,
    },
    {
      id: 'serviceDistribution',
      title: 'Distribuição por Serviço',
      subtitle: 'Tipos de serviços mais demandados',
      value: '45%',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Distribuição</div>,
    },
    {
      id: 'executionTime',
      title: 'Tempo Médio de Execução',
      subtitle: 'Dias até finalização por tipo de serviço',
      value: '18,5 dias',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Tempo</div>,
    },
    {
      id: 'districtsWronglyIncluded',
      title: 'Distritos Incluídos Erroneamente',
      subtitle: 'Locais fora da área de atuação',
      value: '12',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Distritos</div>,
    },
    {
      id: 'compByArea',
      title: 'Comparativo por Áreas',
      subtitle: 'Desempenho por coordenação',
      value: 'CTO 87%',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico Comparativo</div>,
    },
    {
      id: 'top10OldestPending',
      title: 'Top 10 Pendências Antigas',
      subtitle: 'Ordens de serviço com maior tempo em aberto',
      value: '245 dias',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Pendências</div>,
    },
    {
      id: 'bottlenecks',
      title: 'Gargalos Identificados',
      subtitle: 'Principais pontos de atenção',
      value: '5 críticos',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Gargalos</div>,
    },
    {
      id: 'idealRanking',
      title: 'Ranking Ideal',
      subtitle: 'Posição sem fatores externos',
      value: '2º lugar',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Ranking</div>,
    },
    {
      id: 'sgzRanking',
      title: 'SGZ vs Ranking',
      subtitle: 'Comparação entre sistemas',
      value: '60% match',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de SGZ</div>,
    },
    {
      id: 'attentionPoints',
      title: 'Pontos de Atenção',
      subtitle: 'Principais problemas identificados',
      value: '8 pontos',
      component: <div className="h-full w-full flex items-center justify-center">Gráfico de Pontos</div>,
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState('overview');
  const [planilhaData, setPlanilhaData] = useState<any[]>([]);
  const [painelData, setPainelData] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);

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
    setUploadId('mock-upload-id');
  }, []);

  return {
    charts,
    isLoading,
    refreshData,
    chartVisibility,
    toggleChartVisibility,
    lastUpdated,
    currentTab,
    setCurrentTab,
    planilhaData,
    painelData,
    uploadId
  };
};
