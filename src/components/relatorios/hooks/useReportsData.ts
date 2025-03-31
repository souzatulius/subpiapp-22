
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CardStats {
  totalDemandas: number;
  demandasVariacao: number;
  totalNotas: number;
  notasVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
}

export const useReportsData = (filters: any) => {
  const [reportsData, setReportsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardStats, setCardStats] = useState<CardStats>({
    totalDemandas: 0,
    demandasVariacao: 0,
    totalNotas: 0,
    notasVariacao: 0,
    tempoMedioResposta: 0,
    tempoRespostaVariacao: 0,
    taxaAprovacao: 0,
    aprovacaoVariacao: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Primeiro, buscamos os dados dos cards
        await fetchCardStats();
        
        // Em seguida, buscamos os dados para os gráficos
        await fetchChartData();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados de relatórios:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Função para buscar dados reais dos cards
  const fetchCardStats = async () => {
    try {
      // Buscar total de demandas
      const { data: demandasData, error: demandasError } = await supabase
        .from('demandas')
        .select('count', { count: 'exact' });
      
      if (demandasError) throw demandasError;
      
      // Buscar total de notas oficiais
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('count', { count: 'exact' });
      
      if (notasError) throw notasError;
      
      // Buscar tempo médio de resposta (calculado como a diferença entre criação e resposta)
      const { data: tempoRespostaData, error: tempoRespostaError } = await supabase
        .from('demandas')
        .select(`
          id, 
          criado_em:horario_publicacao, 
          respostas:respostas_demandas(criado_em)
        `)
        .not('respostas', 'is', null);
      
      if (tempoRespostaError) throw tempoRespostaError;
      
      let tempoTotal = 0;
      let contagemRespondidas = 0;
      
      if (tempoRespostaData && tempoRespostaData.length > 0) {
        tempoRespostaData.forEach(demanda => {
          if (demanda.respostas && demanda.respostas.length > 0) {
            const dataResposta = new Date(demanda.respostas[0].criado_em);
            const dataCriacao = new Date(demanda.criado_em);
            const diferencaDias = (dataResposta.getTime() - dataCriacao.getTime()) / (1000 * 3600 * 24);
            tempoTotal += diferencaDias;
            contagemRespondidas++;
          }
        });
      }
      
      const tempoMedio = contagemRespondidas > 0 ? tempoTotal / contagemRespondidas : 0;
      
      // Buscar taxa de aprovação (notas aprovadas / total de notas)
      const { data: notasAprovadas, error: aprovacaoError } = await supabase
        .from('notas_oficiais')
        .select('count', { count: 'exact' })
        .eq('status', 'aprovada');
      
      if (aprovacaoError) throw aprovacaoError;
      
      const totalDemandas = demandasData?.[0]?.count || 0;
      const totalNotas = notasData?.[0]?.count || 0;
      const aprovadas = notasAprovadas?.[0]?.count || 0;
      const taxaAprovacao = totalNotas > 0 ? Math.round((aprovadas / totalNotas) * 100) : 0;

      // Calcular variações (comparação com mês anterior)
      // Para este exemplo, vamos usar valores simulados para as variações
      // Em uma implementação real, você calcularia comparando com dados do mês anterior
      
      // Atualizar os dados dos cards
      setCardStats({
        totalDemandas: totalDemandas,
        demandasVariacao: 12, // Valor simulado
        totalNotas: totalNotas,
        notasVariacao: 4, // Valor simulado
        tempoMedioResposta: tempoMedio,
        tempoRespostaVariacao: -15, // Valor simulado (negativo pois melhorou)
        taxaAprovacao: taxaAprovacao,
        aprovacaoVariacao: 5 // Valor simulado
      });
    } catch (error) {
      console.error('Erro ao buscar dados para os cards:', error);
    }
  };

  // Função para buscar dados reais para os gráficos
  const fetchChartData = async () => {
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
      
      // Buscar demandas por origem
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
      
      const origins = Object.entries(originCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      
      // Buscar dados por tipo de mídia
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
      
      const mediaTypes = Object.entries(mediaCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
      
      // Buscar dados de tempo de resposta por mês
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
      
      const responseTimes = Object.entries(responseTimesByMonth)
        .map(([name, times]) => {
          const avgTime = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
          return { name, value: Math.round(avgTime) };
        })
        .filter(item => item.value > 0)
        .reverse();
      
      // Buscar serviços mais requisitados
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
      
      const services = Object.entries(serviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
      
      // Buscar demandas por coordenação - CORRIGIDO AQUI
      const { data: coordData, error: coordError } = await supabase
        .from('demandas')
        .select(`
          coordenacao_id,
          problemas!inner(
            supervisao_tecnica_id,
            supervisoes_tecnicas!inner(
              coordenacao:coordenacoes!inner(descricao)
            )
          )
        `)
        .not('coordenacao_id', 'is', null);
      
      if (coordError) throw coordError;
      
      const coordCounts: Record<string, number> = {};
      coordData?.forEach(item => {
        if (item.problemas && 
            item.problemas.supervisoes_tecnicas && 
            item.problemas.supervisoes_tecnicas.coordenacao) {
          const coord = item.problemas.supervisoes_tecnicas.coordenacao.descricao;
          coordCounts[coord] = (coordCounts[coord] || 0) + 1;
        }
      });
      
      const coordinations = Object.entries(coordCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
      
      // Buscar demandas por status
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
      
      const statuses = Object.entries(statusCounts)
        .map(([name, value]) => ({ name, value }));
      
      // Buscar usuários responsáveis por mais demandas
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
      
      const responsibles = Object.entries(userCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
      
      // Buscar aprovações de notas
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
      
      const approvals = Object.entries(approvalCounts)
        .map(([name, value]) => ({ name, value }));

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
  };

  return {
    reportsData,
    isLoading,
    cardStats
  };
};
