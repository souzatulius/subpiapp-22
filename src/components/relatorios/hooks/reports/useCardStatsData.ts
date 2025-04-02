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
    aprovacaoVariacao: 0,
    notasAguardando: 0,
    notasEditadas: 0,
    notasAprovadas: 0
  });
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  const fetchCardStats = useCallback(async (filters: ReportFilters = {}) => {
    console.log('Iniciando fetchCardStats com filtros:', filters);
    setIsLoadingCards(true);
    
    try {
      // Definir datas para comparação
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      
      console.log('Datas para comparação:', { 
        today: today.toISOString(),
        yesterday: yesterday.toISOString(),
        currentMonth: currentMonth.toISOString(),
        lastMonth: lastMonth.toISOString()
      });
      
      // 1. Buscar total de demandas de hoje
      const { count: demandasHoje, error: demandasHojeError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .gte('horario_publicacao', today.toISOString());
      
      if (demandasHojeError) {
        console.error('Erro ao buscar demandas de hoje:', demandasHojeError);
        throw demandasHojeError;
      }
      
      console.log('Demandas de hoje:', demandasHoje);
      
      // 2. Buscar total de demandas de ontem para comparação
      const { count: demandasOntem, error: demandasOntemError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .gte('horario_publicacao', yesterday.toISOString())
        .lt('horario_publicacao', today.toISOString());
      
      if (demandasOntemError) {
        console.error('Erro ao buscar demandas de ontem:', demandasOntemError);
        throw demandasOntemError;
      }
      
      console.log('Demandas de ontem:', demandasOntem);
      
      // Calcular variação percentual
      const demandasVariacao = demandasOntem && demandasOntem > 0 ? 
        Math.round(((demandasHoje - demandasOntem) / demandasOntem) * 100) : 0;
      
      // 3. Buscar total de notas oficiais
      const { count: totalNotas, error: totalNotasError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true });
      
      if (totalNotasError) {
        console.error('Erro ao buscar total de notas:', totalNotasError);
        throw totalNotasError;
      }
      
      console.log('Total de notas:', totalNotas);
      
      // 4. Buscar notas do mês atual
      const { count: notasMesAtual, error: notasMesAtualError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .gte('criado_em', currentMonth.toISOString())
        .lt('criado_em', nextMonth.toISOString());
      
      if (notasMesAtualError) {
        console.error('Erro ao buscar notas do mês atual:', notasMesAtualError);
        throw notasMesAtualError;
      }
      
      // 5. Buscar notas do mês anterior
      const { count: notasMesAnterior, error: notasMesAnteriorError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .gte('criado_em', lastMonth.toISOString())
        .lt('criado_em', currentMonth.toISOString());
      
      if (notasMesAnteriorError) {
        console.error('Erro ao buscar notas do mês anterior:', notasMesAnteriorError);
        throw notasMesAnteriorError;
      }
      
      // Calcular variação percentual
      const notasVariacao = notasMesAnterior && notasMesAnterior > 0 ? 
        Math.round(((notasMesAtual - notasMesAnterior) / notasMesAnterior) * 100) : 0;
      
      // 6. Buscar notas aguardando aprovação
      const { count: notasAguardando, error: notasAguardandoError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (notasAguardandoError) {
        console.error('Erro ao buscar notas aguardando aprovação:', notasAguardandoError);
        throw notasAguardandoError;
      }
      
      console.log('Notas aguardando aprovação:', notasAguardando);
      
      // 7. Buscar tempo médio de resposta das demandas - AGORA EM HORAS
      const { data: respostasData, error: respostasError } = await supabase
        .from('demandas')
        .select(`
          id, 
          horario_publicacao, 
          respostas:respostas_demandas(criado_em)
        `)
        .not('respostas', 'is', null);
      
      if (respostasError) {
        console.error('Erro ao buscar tempo de resposta:', respostasError);
        throw respostasError;
      }
      
      // Calcular tempo médio de resposta EM HORAS
      let tempoTotalHoras = 0;
      let contagemRespostas = 0;
      
      if (respostasData && respostasData.length > 0) {
        respostasData.forEach(demanda => {
          if (demanda.respostas && demanda.respostas.length > 0) {
            const dataDemanda = new Date(demanda.horario_publicacao);
            const dataResposta = new Date(demanda.respostas[0].criado_em);
            const diferencaHoras = (dataResposta.getTime() - dataDemanda.getTime()) / (1000 * 3600);
            tempoTotalHoras += diferencaHoras;
            contagemRespostas++;
          }
        });
      }
      
      const tempoMedioResposta = contagemRespostas > 0 ? 
        Number((tempoTotalHoras / contagemRespostas).toFixed(1)) : 0;
      
      console.log('Tempo médio de resposta (horas):', tempoMedioResposta);
      
      // Buscar tempos de resposta do mês atual para comparação
      const { data: respostasMesAtualData, error: respostasMesAtualError } = await supabase
        .from('demandas')
        .select(`
          id, 
          horario_publicacao, 
          respostas:respostas_demandas(criado_em)
        `)
        .gte('horario_publicacao', currentMonth.toISOString())
        .lt('horario_publicacao', nextMonth.toISOString())
        .not('respostas', 'is', null);
      
      if (respostasMesAtualError) {
        console.error('Erro ao buscar respostas do mês atual:', respostasMesAtualError);
        throw respostasMesAtualError;
      }
      
      // Calcular tempo médio do mês atual EM HORAS
      let tempoTotalMesAtual = 0;
      let contagemRespostasMesAtual = 0;
      
      if (respostasMesAtualData && respostasMesAtualData.length > 0) {
        respostasMesAtualData.forEach(demanda => {
          if (demanda.respostas && demanda.respostas.length > 0) {
            const dataDemanda = new Date(demanda.horario_publicacao);
            const dataResposta = new Date(demanda.respostas[0].criado_em);
            const diferencaHoras = (dataResposta.getTime() - dataDemanda.getTime()) / (1000 * 3600);
            tempoTotalMesAtual += diferencaHoras;
            contagemRespostasMesAtual++;
          }
        });
      }
      
      const tempoMesAtual = contagemRespostasMesAtual > 0 ?
        tempoTotalMesAtual / contagemRespostasMesAtual : 0;
      
      // Calcular variação percentual no tempo de resposta
      const tempoRespostaVariacao = tempoMesAtual > 0 && tempoMedioResposta > 0 ? 
        Math.round(((tempoMesAtual - tempoMedioResposta) / tempoMedioResposta) * 100) : 0;
      
      // 8. Buscar taxa de aprovação de notas
      const { count: notasAprovadas, error: notasAprovadasError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada');
      
      if (notasAprovadasError) {
        console.error('Erro ao buscar notas aprovadas:', notasAprovadasError);
        throw notasAprovadasError;
      }
      
      // Calcular taxa de aprovação
      const taxaAprovacao = totalNotas > 0 ? 
        Math.round((notasAprovadas / totalNotas) * 100) : 0;
      
      // 9. Buscar notas que foram editadas (através do histórico)
      const { count: notasEditadasCount, error: notasEditadasError } = await supabase
        .from('notas_historico_edicoes')
        .select('*', { count: 'exact', head: true })
        .gte('criado_em', currentMonth.toISOString());
      
      if (notasEditadasError) {
        console.error('Erro ao buscar notas editadas:', notasEditadasError);
        throw notasEditadasError;
      }
      
      // Calcular percentual de notas que foram editadas
      const notasEditadasPerc = notasMesAtual > 0 ? 
        Math.round((notasEditadasCount / notasMesAtual) * 100) : 0;
      
      // 10. Calcular variação na taxa de aprovação
      // Buscar taxa de aprovação do mês anterior
      const { count: notasAprovadasAnterior, error: notasAprovadasAnteriorError } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada')
        .gte('criado_em', lastMonth.toISOString())
        .lt('criado_em', currentMonth.toISOString());
      
      if (notasAprovadasAnteriorError) {
        console.error('Erro ao buscar notas aprovadas do mês anterior:', notasAprovadasAnteriorError);
        throw notasAprovadasAnteriorError;
      }
      
      const taxaAprovacaoAnterior = notasMesAnterior > 0 ? 
        Math.round((notasAprovadasAnterior / notasMesAnterior) * 100) : 0;
      
      const aprovacaoVariacao = taxaAprovacaoAnterior > 0 ? 
        taxaAprovacao - taxaAprovacaoAnterior : 0;
      
      console.log('Estatísticas processadas:', {
        demandasHoje,
        demandasVariacao,
        totalNotas,
        notasVariacao,
        notasAguardando,
        tempoMedioResposta,
        tempoRespostaVariacao,
        taxaAprovacao,
        aprovacaoVariacao,
        notasEditadasPerc,
        notasAprovadas
      });
      
      // Atualizar os dados dos cards
      setCardStats({
        totalDemandas: demandasHoje || 0,
        demandasVariacao,
        totalNotas: totalNotas || 0,
        notasVariacao,
        tempoMedioResposta,
        tempoRespostaVariacao,
        taxaAprovacao,
        aprovacaoVariacao,
        notasAguardando: notasAguardando || 0,
        notasEditadas: notasEditadasPerc,
        notasAprovadas: notasAprovadas || 0
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
