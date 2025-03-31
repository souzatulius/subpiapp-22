
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CardStats } from './types';

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

  const fetchCardStats = useCallback(async () => {
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
  }, []);

  return {
    cardStats,
    fetchCardStats
  };
};
