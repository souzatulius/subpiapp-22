
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InsightResponse {
  insights: {
    fechadas: { valor: string; comentario: string };
    pendentes: { valor: string; comentario: string };
    canceladas: { valor: string; comentario: string };
    prazo_medio: { valor: string; comentario: string };
    fora_do_prazo: { valor: string; comentario: string };
    [key: string]: { valor: string; comentario: string };
  };
}

export function useChatGPTInsight() {
  const gerarInsights = useCallback(async (dadosPlanilha: any[]) => {
    const total = dadosPlanilha.length;
    const statusCount = dadosPlanilha.reduce(
      (acc, item) => {
        const status = item.status?.toUpperCase();
        if (!status) return acc;
        if (status.includes('FECHAD')) acc.fechadas++;
        else if (status.includes('PENDEN')) acc.pendentes++;
        else if (status.includes('CANCEL')) acc.canceladas++;
        else if (status.includes('CONC')) acc.conc++;
        return acc;
      },
      { fechadas: 0, pendentes: 0, canceladas: 0, conc: 0 }
    );

    const prazoMedio = calcularPrazoMedio(dadosPlanilha);
    const foraDoPrazo = dadosPlanilha.filter(
      (d) => d.status?.toUpperCase().includes('PENDEN') && d.prazo === 'FORA DO PRAZO'
    ).length;

    const dados = {
      total,
      fechadas: statusCount.fechadas,
      pendentes: statusCount.pendentes,
      canceladas: statusCount.canceladas,
      conc: statusCount.conc,
      prazoMedio,
      foraDoPrazo
    };

    try {
      // Usar a função supabase.functions.invoke em vez de fetch diretamente
      const { data, error } = await supabase.functions.invoke<InsightResponse>('generate-ranking-insights', {
        body: { tipo: 'indicadores', dados }
      });

      if (error) {
        console.error('Erro ao chamar a edge function:', error);
        throw new Error(error.message);
      }

      return data?.insights || getDefaultInsights(statusCount, total, prazoMedio, foraDoPrazo);
    } catch (err) {
      console.error('Erro ao gerar insights:', err);
      // Fallback para valores padrão em caso de erro
      return getDefaultInsights(statusCount, total, prazoMedio, foraDoPrazo);
    }
  }, []);

  return { gerarInsights };
}

function calcularPrazoMedio(planilha: any[]) {
  const concluidas = planilha.filter((d) => d.status?.toUpperCase().includes('FECHAD'));
  const dias = concluidas.map((d) => {
    const abertura = new Date(d.data_abertura);
    const fechamento = new Date(d.data_fechamento);
    return (fechamento.getTime() - abertura.getTime()) / (1000 * 60 * 60 * 24);
  }).filter((n) => !isNaN(n));

  if (dias.length === 0) return 0;
  return dias.reduce((a, b) => a + b, 0) / dias.length;
}

function getDefaultInsights(
  statusCount: { fechadas: number; pendentes: number; canceladas: number; conc: number },
  total: number,
  prazoMedio: number,
  foraDoPrazo: number
) {
  return {
    fechadas: { 
      valor: `${Math.round((statusCount.fechadas / total) * 100)}%`, 
      comentario: "Taxa de conclusão de ordens de serviço." 
    },
    pendentes: { 
      valor: `${Math.round((statusCount.pendentes / total) * 100)}%`, 
      comentario: "Ordens de serviço ainda não concluídas." 
    },
    canceladas: { 
      valor: `${Math.round((statusCount.canceladas / total) * 100)}%`, 
      comentario: "Ordens de serviço canceladas." 
    },
    prazo_medio: { 
      valor: `${prazoMedio.toFixed(1)} dias`, 
      comentario: "Tempo médio para conclusão das ordens de serviço." 
    },
    fora_do_prazo: { 
      valor: `${foraDoPrazo} OS`, 
      comentario: "Ordens de serviço que ultrapassaram o prazo estabelecido." 
    }
  };
}
