
import { useState, useEffect } from 'react';
import { ReportsData } from '@/components/relatorios/hooks/reports/types';
import { useSearchParams } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados mocados para os gráficos
const mockDistrictsData = [
  { name: 'Alto de Pinheiros', value: 45 },
  { name: 'Pinheiros', value: 32 },
  { name: 'Jardim Paulista', value: 28 },
  { name: 'Itaim Bibi', value: 25 },
  { name: 'Perdizes', value: 15 },
];

const mockNeighborhoodsData = [
  { name: 'Vila Madalena', value: 25 },
  { name: 'Jardim Europa', value: 18 },
  { name: 'Vila Olímpia', value: 22 },
  { name: 'Higienópolis', value: 12 },
  { name: 'Brooklin', value: 15 },
];

const mockOriginsData = [
  { name: 'Imprensa', value: 35 },
  { name: 'SMSUB', value: 45 },
  { name: 'Secom', value: 12 },
  { name: 'Internas', value: 8 },
];

const mockMediaTypesData = [
  { name: 'Online', value: 48 },
  { name: 'Impresso', value: 12 },
  { name: 'TV', value: 25 },
  { name: 'Rádio', value: 15 },
];

const mockResponseTimesData = [
  { name: 'Seg', Demandas: 120, Aprovacao: 140 },
  { name: 'Ter', Demandas: 90, Aprovacao: 100 },
  { name: 'Qua', Demandas: 60, Aprovacao: 80 },
  { name: 'Qui', Demandas: 180, Aprovacao: 190 },
  { name: 'Sex', Demandas: 75, Aprovacao: 85 },
  { name: 'Sáb', Demandas: 30, Aprovacao: 35 },
  { name: 'Dom', Demandas: 15, Aprovacao: 18 },
];

const mockProblemasData = [
  { name: 'Poda de Árvores', Quantidade: 45 },
  { name: 'Bueiros', Quantidade: 32 },
  { name: 'Remoção de galhos', Quantidade: 18 },
  { name: 'Limpeza', Quantidade: 25 },
  { name: 'Parques e praças', Quantidade: 15 },
];

const mockCoordinationsData = [
  { name: 'CPO', Demandas: 92 },
  { name: 'CPDU', Demandas: 87 },
  { name: 'Governo Local', Demandas: 82 },
  { name: 'Jurídico', Demandas: 75 },
  { name: 'Finanças', Demandas: 68 },
];

const mockStatusesData = [
  { name: 'Pendente', value: 25 },
  { name: 'Em andamento', value: 40 },
  { name: 'Concluído', value: 35 },
];

const mockResponsiblesData = [
  { name: 'Coordenador 1', Demandas: 45 },
  { name: 'Coordenador 2', Demandas: 35 },
  { name: 'Coordenador 3', Demandas: 28 },
  { name: 'Coordenador 4', Demandas: 22 },
  { name: 'Coordenador 5', Demandas: 18 },
];

const mockApprovalsData = [
  { name: 'Aprovadas sem alteração', value: 55 },
  { name: 'Aprovadas com alteração', value: 35 },
  { name: 'Reprovadas', value: 10 },
];

const useChartStatsData = () => {
  const [reportsData, setReportsData] = useState<ReportsData>({
    cardStats: {
      totalDemandas: 0,
      demandasVariacao: 0,
      totalNotas: 0,
      notasVariacao: 0,
      tempoMedioResposta: 0,
      tempoRespostaVariacao: 0,
      taxaAprovacao: 0,
      aprovacaoVariacao: 0,
      notasAprovadas: 0,
      notasEditadas: 0,
      noticiasPublicas: 0,
      totalReleases: 0,
      noticiasVariacao: 0,
      notasAguardando: 0
    },
    chartData: {},
    districts: [],
    neighborhoods: [],
    origins: [],
    mediaTypes: [],
    responseTimes: [],
    problemas: [],
    coordinations: [],
    statuses: [],
    responsibles: [],
    approvals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const paramMonth = searchParams.get('month');
    const paramYear = searchParams.get('year');

    if (paramMonth && paramYear) {
      return new Date(Number(paramYear), Number(paramMonth) - 1, 1);
    }

    return new Date();
  });

  useEffect(() => {
    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();
    setSearchParams({ month: month.toString(), year: year.toString() });
  }, [selectedMonth, setSearchParams]);

  const handleMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const currentMonthStart = startOfMonth(selectedMonth);
      const currentMonthEnd = endOfMonth(selectedMonth);

      console.log('Buscando dados dos gráficos para:', format(currentMonthStart, 'MMMM yyyy', { locale: ptBR }));
      
      // Simular tempo de carregamento
      setTimeout(() => {
        // Usar dados mocados ao invés de tentar buscar da API
        setReportsData({
          cardStats: {
            totalDemandas: 120,
            demandasVariacao: 15,
            totalNotas: 85,
            notasVariacao: 8,
            tempoMedioResposta: 24,
            tempoRespostaVariacao: -5,
            taxaAprovacao: 92,
            aprovacaoVariacao: 3,
            notasAprovadas: 78,
            notasEditadas: 7,
            noticiasPublicas: 65,
            totalReleases: 20,
            noticiasVariacao: 12,
            notasAguardando: 15
          },
          chartData: {},
          districts: mockDistrictsData,
          neighborhoods: mockNeighborhoodsData,
          origins: mockOriginsData,
          mediaTypes: mockMediaTypesData,
          responseTimes: mockResponseTimesData,
          problemas: mockProblemasData,
          coordinations: mockCoordinationsData,
          statuses: mockStatusesData,
          responsibles: mockResponsiblesData,
          approvals: mockApprovalsData
        });
        
        setIsLoading(false);
        console.log('Dados dos gráficos carregados (mockados)');
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
      
      // Em caso de erro, carregar dados mockados
      setReportsData({
        cardStats: {
          totalDemandas: 120,
          demandasVariacao: 15,
          totalNotas: 85,
          notasVariacao: 8,
          tempoMedioResposta: 24,
          tempoRespostaVariacao: -5,
          taxaAprovacao: 92,
          aprovacaoVariacao: 3,
          notasAprovadas: 78,
          notasEditadas: 7,
          noticiasPublicas: 65,
          totalReleases: 20,
          noticiasVariacao: 12,
          notasAguardando: 15
        },
        chartData: {},
        districts: mockDistrictsData,
        neighborhoods: mockNeighborhoodsData,
        origins: mockOriginsData,
        mediaTypes: mockMediaTypesData,
        responseTimes: mockResponseTimesData,
        problemas: mockProblemasData,
        coordinations: mockCoordinationsData,
        statuses: mockStatusesData,
        responsibles: mockResponsiblesData,
        approvals: mockApprovalsData
      });
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedMonth]);

  return { reportsData, isLoading, fetchChartData, selectedMonth, handleMonthChange };
};

export default useChartStatsData;
