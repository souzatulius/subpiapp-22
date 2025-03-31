
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportsData } from './types';

export const useChartStatsData = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      // Buscar distribuição de demandas por distritos
      const { data: districtData, error: districtError } = await supabase
        .from('demandas')
        .select(`
          bairro_id,
          bairro:bairros!inner(
            nome,
            distrito:distritos!inner(nome)
          )
        `);
      
      if (districtError) throw districtError;
      
      // Processar dados por distrito
      const districtCounts: Record<string, number> = {};
      districtData?.forEach(item => {
        if (item.bairro && item.bairro.distrito) {
          const distrito = item.bairro.distrito.nome;
          districtCounts[distrito] = (districtCounts[distrito] || 0) + 1;
        }
      });
      
      const districts = Object.entries(districtCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);
      
      // Buscar demandas por bairro
      const neighborhoodCounts: Record<string, {value: number, district: string}> = {};
      districtData?.forEach(item => {
        if (item.bairro) {
          const bairro = item.bairro.nome;
          const distrito = item.bairro.distrito?.nome || "Desconhecido";
          neighborhoodCounts[bairro] = neighborhoodCounts[bairro] || { value: 0, district: distrito };
          neighborhoodCounts[bairro].value += 1;
        }
      });
      
      const neighborhoods = Object.entries(neighborhoodCounts)
        .map(([name, data]) => ({ name, district: data.district, value: data.value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Buscar dados a partir dos hooks específicos
      const origins = await fetchOriginData();
      const mediaTypes = await fetchMediaTypeData();
      const responseTimes = await fetchResponseTimeData();
      const services = await fetchServiceData();
      const coordinations = await fetchCoordinationData();
      const statuses = await fetchStatusData();
      const responsibles = await fetchUserData();
      const approvals = await fetchApprovalData();

      // Montar objeto final com todos os dados
      setReportsData({
        districts,
        neighborhoods,
        origins,
        mediaTypes,
        responseTimes,
        services,
        coordinations,
        statuses,
        responsibles,
        approvals
      });
      
    } catch (error) {
      console.error('Erro ao buscar dados para os gráficos:', error);
      // Em caso de erro, usar dados vazios para evitar erros de renderização
      setReportsData({
        districts: [],
        neighborhoods: [],
        origins: [],
        mediaTypes: [],
        responseTimes: [],
        services: [],
        coordinations: [],
        statuses: [],
        responsibles: [],
        approvals: []
      });
    }
  }, []);

  // Funções auxiliares para buscar dados específicos
  const fetchOriginData = async () => {
    try {
      const { data: origemData, error: origemError } = await supabase
        .from('demandas')
        .select(`
          origem_id,
          origem:origens_demandas!inner(descricao)
        `);
      
      if (origemError) throw origemError;
      
      const originCounts: Record<string, number> = {};
      origemData?.forEach(item => {
        if (item.origem) {
          const origem = item.origem.descricao;
          originCounts[origem] = (originCounts[origem] || 0) + 1;
        }
      });
      
      return Object.entries(originCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar dados de origem:', error);
      return [];
    }
  };

  const fetchMediaTypeData = async () => {
    try {
      const { data: midiaData, error: midiaError } = await supabase
        .from('demandas')
        .select(`
          tipo_midia_id,
          tipo_midia:tipos_midia!inner(descricao)
        `)
        .not('tipo_midia_id', 'is', null);
      
      if (midiaError) throw midiaError;
      
      const mediaCounts: Record<string, number> = {};
      midiaData?.forEach(item => {
        if (item.tipo_midia) {
          const midia = item.tipo_midia.descricao;
          mediaCounts[midia] = (mediaCounts[midia] || 0) + 1;
        }
      });
      
      return Object.entries(mediaCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar dados de mídia:', error);
      return [];
    }
  };

  const fetchResponseTimeData = async () => {
    try {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      const responseTimesByMonth: Record<string, number[]> = {};
      
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        responseTimesByMonth[months[monthIndex]] = [];
      }
      
      const { data: responseTimeData, error: responseTimeError } = await supabase
        .from('demandas')
        .select(`
          horario_publicacao,
          respostas:respostas_demandas(criado_em)
        `)
        .not('respostas', 'is', null);
      
      if (responseTimeError) throw responseTimeError;
      
      responseTimeData?.forEach(item => {
        if (item.horario_publicacao && item.respostas && item.respostas.length > 0) {
          const creationDate = new Date(item.horario_publicacao);
          const responseDate = new Date(item.respostas[0].criado_em);
          
          // Verificar se a demanda é dos últimos 6 meses
          if (creationDate.getFullYear() === currentYear || 
              (creationDate.getFullYear() === currentYear - 1 && currentDate.getMonth() < 6)) {
            
            const monthName = months[creationDate.getMonth()];
            if (responseTimesByMonth[monthName]) {
              const daysToRespond = (responseDate.getTime() - creationDate.getTime()) / (1000 * 3600 * 24);
              responseTimesByMonth[monthName].push(daysToRespond);
            }
          }
        }
      });
      
      return Object.entries(responseTimesByMonth)
        .map(([name, times]) => {
          const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
          return { name, value: Math.round(avgTime) };
        })
        .filter(item => item.value > 0)
        .reverse();
    } catch (error) {
      console.error('Erro ao buscar dados de tempo de resposta:', error);
      return [];
    }
  };

  const fetchServiceData = async () => {
    try {
      const { data: servicosData, error: servicosError } = await supabase
        .from('demandas')
        .select(`
          problema_id,
          problema:problemas!inner(descricao)
        `);
      
      if (servicosError) throw servicosError;
      
      const serviceCounts: Record<string, number> = {};
      servicosData?.forEach(item => {
        if (item.problema) {
          const servico = item.problema.descricao;
          serviceCounts[servico] = (serviceCounts[servico] || 0) + 1;
        }
      });
      
      return Object.entries(serviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar dados de serviços:', error);
      return [];
    }
  };

  const fetchCoordinationData = async () => {
    try {
      const { data: coordData, error: coordError } = await supabase
        .from('demandas')
        .select(`
          coordenacao_id,
          coordenacao:coordenacoes!inner(descricao)
        `)
        .not('coordenacao_id', 'is', null);
      
      if (coordError) throw coordError;
      
      const coordCounts: Record<string, number> = {};
      coordData?.forEach(item => {
        if (item.coordenacao) {
          const coord = item.coordenacao.descricao;
          coordCounts[coord] = (coordCounts[coord] || 0) + 1;
        }
      });
      
      return Object.entries(coordCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar dados de coordenação:', error);
      return [];
    }
  };

  const fetchStatusData = async () => {
    try {
      const { data: statusData, error: statusError } = await supabase
        .from('demandas')
        .select('status');
      
      if (statusError) throw statusError;
      
      const statusLabels: Record<string, string> = {
        'pendente': 'Pendentes',
        'em_andamento': 'Em andamento',
        'concluida': 'Concluídas',
        'arquivada': 'Arquivadas',
        'cancelada': 'Canceladas'
      };
      
      const statusCounts: Record<string, number> = {};
      statusData?.forEach(item => {
        const statusLabel = statusLabels[item.status] || item.status;
        statusCounts[statusLabel] = (statusCounts[statusLabel] || 0) + 1;
      });
      
      return Object.entries(statusCounts)
        .map(([name, value]) => ({ name, value }));
    } catch (error) {
      console.error('Erro ao buscar dados de status:', error);
      return [];
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('demandas')
        .select(`
          autor_id,
          autor:usuarios!inner(nome_completo)
        `);
      
      if (userError) throw userError;
      
      const userCounts: Record<string, number> = {};
      userData?.forEach(item => {
        if (item.autor) {
          const nome = item.autor.nome_completo;
          userCounts[nome] = (userCounts[nome] || 0) + 1;
        }
      });
      
      return Object.entries(userCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar dados de usuários:', error);
      return [];
    }
  };

  const fetchApprovalData = async () => {
    try {
      const { data: approvalData, error: approvalError } = await supabase
        .from('notas_oficiais')
        .select('status');
      
      if (approvalError) throw approvalError;
      
      const approvalCounts: Record<string, number> = {
        'Aprovadas pelo Subprefeito': 0,
        'Rejeitadas e reeditadas': 0,
        'Aprovadas sem edição': 0
      };
      
      approvalData?.forEach(item => {
        if (item.status === 'aprovada') {
          approvalCounts['Aprovadas pelo Subprefeito']++;
        } else if (item.status === 'rejeitada') {
          approvalCounts['Rejeitadas e reeditadas']++;
        } else if (item.status === 'pendente') {
          approvalCounts['Aprovadas sem edição']++;
        }
      });
      
      return Object.entries(approvalCounts)
        .map(([name, value]) => ({ name, value }));
    } catch (error) {
      console.error('Erro ao buscar dados de aprovações:', error);
      return [];
    }
  };

  return {
    reportsData,
    fetchChartData
  };
};
