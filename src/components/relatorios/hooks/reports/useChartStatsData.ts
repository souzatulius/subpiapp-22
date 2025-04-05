import { useState, useEffect } from 'react';
import { ReportsData } from '@/components/relatorios/hooks/reports/types';
import { useSearchParams } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      const previousMonthStart = startOfMonth(subMonths(selectedMonth, 1));
      const previousMonthEnd = endOfMonth(subMonths(selectedMonth, 1));

      const currentMonthStartFormatted = format(currentMonthStart, 'yyyy-MM-dd', { locale: ptBR });
      const currentMonthEndFormatted = format(currentMonthEnd, 'yyyy-MM-dd', { locale: ptBR });
      const previousMonthStartFormatted = format(previousMonthStart, 'yyyy-MM-dd', { locale: ptBR });
      const previousMonthEndFormatted = format(previousMonthEnd, 'yyyy-MM-dd', { locale: ptBR });

      const [
        districtsResponse,
        neighborhoodsResponse,
        originsResponse,
        mediaTypesResponse,
        responseTimesResponse,
        problemasResponse,
        coordinationsResponse,
        statusesResponse,
        responsiblesResponse,
        approvalsResponse
      ] = await Promise.all([
        fetch(`/api/relatorios/distritos?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/bairros?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/origens?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/meios-de-comunicacao?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/tempo-resposta?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/problemas?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/coordenacoes?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/status?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/responsaveis?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`),
        fetch(`/api/relatorios/aprovacoes?start=${currentMonthStartFormatted}&end=${currentMonthEndFormatted}`)
      ]);

      const districtsData = await districtsResponse.json();
      const neighborhoodsData = await neighborhoodsResponse.json();
      const originsData = await originsResponse.json();
      const mediaTypesData = await mediaTypesResponse.json();
      const responseTimesData = await responseTimesResponse.json();
      const problemasData = await problemasResponse.json();
      const coordinationsData = await coordinationsResponse.json();
      const statusesData = await statusesResponse.json();
      const responsiblesData = await responsiblesResponse.json();
      const approvalsData = await approvalsResponse.json();
      
      setReportsData({
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
        districts: districtsData,
        neighborhoods: neighborhoodsData,
        origins: originsData,
        mediaTypes: mediaTypesData,
        responseTimes: responseTimesData,
        problemas: problemasData,
        coordinations: coordinationsData,
        statuses: statusesData,
        responsibles: responsiblesData,
        approvals: approvalsData
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setReportsData({
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedMonth]);

  return { reportsData, isLoading, fetchChartData, selectedMonth, handleMonthChange };
};

export default useChartStatsData;
