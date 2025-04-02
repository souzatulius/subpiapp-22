import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CardStats } from './types';
import { ReportFilters } from '../useReportsData';

export const useCardStatsData = () => {
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
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  const fetchCardStats = useCallback(async (filters: ReportFilters = {}) => {
    setIsLoadingCards(true);
    try {
      // Construir filtros para as consultas
      let dateFilter = {};
      if (filters.dateRange?.from) {
        dateFilter = {
          horario_publicacao: { 
            gte: filters.dateRange.from.toISOString(),
            ...(filters.dateRange.to ? { lte: filters.dateRange.to.toISOString() } : {})
          }
        };
      }
      
      // Definir datas para comparação
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      
      const previousMonth = new Date();
      previousMonth.setMonth(today.getMonth() - 2);

      // Buscar total de demandas atual
      const { count: demandasCount, error: demandasError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .gte('horario_publicacao', lastMonth.toISOString());
      
      if (demandasError) throw demandasError;
      
      // Buscar total de demandas do período anterior para comparação
      const { count: demandasAnteriorCount, error: demandasAnteriorError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .gte('horario_publicacao', previousMonth.toISOString())
        .lt('horario_publicacao', lastMonth.toISOString());
        
      if (demandasAnteriorError) throw demandasAnteriorError;
      
      const demandasVariacao = demandasAnteriorCount && demandasAnteriorCount > 0 ? 
        Math.round(((demandasCount - demandasAnteriorCount) / demandasAnteriorCount) * 100) : 0;
      
      // Buscar total de notas oficiais
      const { count: notasCount, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .gte('criado_em', lastMonth.toISOString());
      
      if (notasError) throw notasError;
      
      // Buscar total de notas oficiais do período anterior
      const { count: notasAnteriorCount, error: notasAnteriorError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .gte('criado_em', previousMonth.toISOString())
        .lt('criado_em', lastMonth.toISOString());
        
      if (notasAnteriorError) throw notasAnteriorError;
      
      const notasVariacao = notasAnteriorCount && notasAnteriorCount > 0 ? 
        Math.round(((notasCount - notasAnteriorCount) / notasAnteriorCount) * 100) : 0;

      // Buscar tempo médio de resposta (calculado como a diferença entre criação e resposta)
      const { data: respostasData, error: respostasError } = await supabase
        .from('demandas')
        .select(`
          id, 
          horario_publicacao, 
          respostas:respostas_demandas(criado_em)
        `)
        .gte('horario_publicacao', lastMonth.toISOString())
        .not('respostas', 'is', null);
      
      if (respostasError) throw respostasError;
      
      // Buscar tempo médio de resposta do período anterior
      const { data: respostasAnteriorData, error: respostasAnteriorError } = await supabase
        .from('demandas')
        .select(`
          id, 
          horario_publicacao, 
          respostas:respostas_demandas(criado_em)
        `)
        .gte('horario_publicacao', previousMonth.toISOString())
        .lt('horario_publicacao', lastMonth.toISOString())
        .not('respostas', 'is', null);
      
      if (respostasAnteriorError) throw respostasAnteriorError;
      
      // Calcular tempo médio atual
      let tempoTotal = 0;
      let contagemRespondidas = 0;
      
      if (respostasData && respostasData.length > 0) {
        respostasData.forEach(demanda => {
          if (demanda.respostas && demanda.respostas.length > 0) {
            const dataResposta = new Date(demanda.respostas[0].criado_em);
            const dataCriacao = new Date(demanda.horario_publicacao);
            const diferencaDias = (dataResposta.getTime() - dataCriacao.getTime()) / (1000 * 3600 * 24);
            tempoTotal += diferencaDias;
            contagemRespondidas++;
          }
        });
      }
      
      const tempoMedio = contagemRespondidas > 0 ? Number((tempoTotal / contagemRespondidas).toFixed(1)) : 0;
      
      // Calcular tempo médio anterior
      let tempoTotalAnterior = 0;
      let contagemRespondidasAnterior = 0;
      
      if (respostasAnteriorData && respostasAnteriorData.length > 0) {
        respostasAnteriorData.forEach(demanda => {
          if (demanda.respostas && demanda.respostas.length > 0) {
            const dataResposta = new Date(demanda.respostas[0].criado_em);
            const dataCriacao = new Date(demanda.horario_publicacao);
            const diferencaDias = (dataResposta.getTime() - dataCriacao.getTime()) / (1000 * 3600 * 24);
            tempoTotalAnterior += diferencaDias;
            contagemRespondidasAnterior++;
          }
        });
      }
      
      const tempoMedioAnterior = contagemRespondidasAnterior > 0 ? 
        tempoTotalAnterior / contagemRespondidasAnterior : 0;
      
      // Variação no tempo médio (negativo é melhor - respondeu mais rápido)
      const tempoRespostaVariacao = tempoMedioAnterior > 0 ? 
        Math.round(((tempoMedio - tempoMedioAnterior) / tempoMedioAnterior) * 100) * -1 : 0;
      
      // Buscar taxa de aprovação (notas aprovadas / total de notas)
      const { count: notasAprovadas, error: aprovacaoError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada')
        .gte('criado_em', lastMonth.toISOString());
      
      if (aprovacaoError) throw aprovacaoError;
      
      // Buscar taxa de aprovação do período anterior
      const { count: notasAprovadasAnterior, error: aprovacaoAnteriorError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada')
        .gte('criado_em', previousMonth.toISOString())
        .lt('criado_em', lastMonth.toISOString());
      
      if (aprovacaoAnteriorError) throw aprovacaoAnteriorError;
      
      const taxaAprovacao = notasCount > 0 ? Math.round((notasAprovadas / notasCount) * 100) : 0;
      const taxaAprovacaoAnterior = notasAnteriorCount > 0 ? 
        Math.round((notasAprovadasAnterior / notasAnteriorCount) * 100) : 0;
      
      const aprovacaoVariacao = taxaAprovacaoAnterior > 0 ? 
        Math.round(((taxaAprovacao - taxaAprovacaoAnterior) / taxaAprovacaoAnterior) * 100) : 0;
      
      // Atualizar os dados dos cards
      setCardStats({
        totalDemandas: demandasCount || 0,
        demandasVariacao,
        totalNotas: notasCount || 0,
        notasVariacao,
        tempoMedioResposta: tempoMedio,
        tempoRespostaVariacao,
        taxaAprovacao,
        aprovacaoVariacao
      });
    } catch (error) {
      console.error('Erro ao buscar dados para os cards:', error);
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  return {
    cardStats,
    fetchCardStats,
    isLoadingCards
  };
};
