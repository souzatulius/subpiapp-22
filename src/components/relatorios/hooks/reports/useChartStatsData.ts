
import { useState, useEffect, useCallback } from 'react';
import { ReportsData } from './types';

export function useChartStatsData() {
  const [chartData, setChartData] = useState<ReportsData>({
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

  const fetchChartData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Simulated data for charts
      const mockData = {
        districts: [
          { name: 'Pinheiros', value: 42 },
          { name: 'Alto de Pinheiros', value: 23 },
          { name: 'Itaim Bibi', value: 35 },
          { name: 'Jardim Paulista', value: 18 }
        ],
        neighborhoods: [
          { name: 'Pinheiros', district: 'Pinheiros', value: 25 },
          { name: 'Vila Madalena', district: 'Pinheiros', value: 17 },
          { name: 'Jardim Europa', district: 'Jardim Paulista', value: 12 },
          { name: 'Vila Olímpia', district: 'Itaim Bibi', value: 23 },
          { name: 'Brooklin', district: 'Itaim Bibi', value: 12 }
        ],
        origins: [
          { name: 'Email', value: 45 },
          { name: 'WhatsApp', value: 25 },
          { name: 'Telefone', value: 15 },
          { name: 'Presencial', value: 10 },
          { name: 'Instagram', value: 5 }
        ],
        mediaTypes: [
          { name: 'Jornal', value: 35 },
          { name: 'TV', value: 25 },
          { name: 'Rádio', value: 15 },
          { name: 'Portal de Notícias', value: 20 },
          { name: 'Revista', value: 5 }
        ],
        responseTimes: [
          { name: 'Até 2 horas', value: 40 },
          { name: '2 a 6 horas', value: 30 },
          { name: '6 a 12 horas', value: 15 },
          { name: '12 a 24 horas', value: 10 },
          { name: 'Mais de 24 horas', value: 5 }
        ],
        problemas: [
          { name: 'Zeladoria', value: 40 },
          { name: 'Obras', value: 25 },
          { name: 'Trânsito', value: 15 },
          { name: 'Saúde', value: 10 },
          { name: 'Cultura', value: 5 },
          { name: 'Outros', value: 5 }
        ],
        coordinations: [
          { name: 'Comunicação', value: 45 },
          { name: 'Gabinete', value: 25 },
          { name: 'Zeladoria', value: 15 },
          { name: 'Projetos', value: 10 },
          { name: 'Assistência Social', value: 5 }
        ],
        statuses: [
          { name: 'Solicitada', value: 30 },
          { name: 'Em Andamento', value: 40 },
          { name: 'Respondida', value: 20 },
          { name: 'Cancelada', value: 10 }
        ],
        responsibles: [
          { name: 'Ana Silva', value: 25 },
          { name: 'João Pereira', value: 20 },
          { name: 'Maria Souza', value: 15 },
          { name: 'Carlos Mendes', value: 15 },
          { name: 'Outros', value: 25 }
        ],
        approvals: [
          { name: 'Aprovada sem edições', value: 60 },
          { name: 'Aprovada com edições', value: 30 },
          { name: 'Rejeitada', value: 10 }
        ]
      };

      // Create a complete ReportsData object with all required properties
      const newChartData: ReportsData = {
        ...chartData, // Keep the existing cardStats and other data
        districts: mockData.districts,
        neighborhoods: mockData.neighborhoods,
        origins: mockData.origins,
        mediaTypes: mockData.mediaTypes,
        responseTimes: mockData.responseTimes,
        problemas: mockData.problemas,
        coordinations: mockData.coordinations,
        statuses: mockData.statuses,
        responsibles: mockData.responsibles,
        approvals: mockData.approvals,
      };

      setChartData(newChartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Reset to empty arrays in case of error
      setChartData({
        ...chartData,
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
  }, [chartData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { chartData, isLoading, fetchChartData };
}
