
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InsightResponse {
  insights: {
    fechadas: { valor: string; comentario: string; trend?: 'up' | 'down' | 'neutral' };
    pendentes: { valor: string; comentario: string; trend?: 'up' | 'down' | 'neutral' };
    canceladas: { valor: string; comentario: string; trend?: 'up' | 'down' | 'neutral' };
    prazo_medio: { valor: string; comentario: string; trend?: 'up' | 'down' | 'neutral' };
    fora_do_prazo: { valor: string; comentario: string; trend?: 'up' | 'down' | 'neutral' };
    [key: string]: { 
      valor: string; 
      comentario: string;
      trend?: 'up' | 'down' | 'neutral';
    };
  };
}

export function useChatGPTInsight(dadosPlanilha: any[] = [], uploadId?: string) {
  const [indicadores, setIndicadores] = useState<InsightResponse['insights'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const gerarInsights = useCallback(async (dados: any[]) => {
    const total = dados.length;
    const statusCount = dados.reduce(
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

    const prazoMedio = calcularPrazoMedio(dados);
    const foraDoPrazo = dados.filter(
      (d) => d.status?.toUpperCase().includes('PENDEN') && d.prazo === 'FORA DO PRAZO'
    ).length;

    const dadosCalculados = {
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
        body: { tipo: 'indicadores', dados: dadosCalculados }
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
  
  // Load data on mount or when dadosPlanilha changes
  useEffect(() => {
    const loadInsights = async () => {
      if (!dadosPlanilha || dadosPlanilha.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const insights = await gerarInsights(dadosPlanilha);
        setIndicadores(insights);
      } catch (err) {
        console.error('Erro ao carregar insights:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar indicadores');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInsights();
  }, [dadosPlanilha, gerarInsights, uploadId]);

  return { indicadores, isLoading, error, gerarInsights };
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
  // Calculate trends based on values
  const fechadasPercent = total > 0 ? (statusCount.fechadas / total) * 100 : 0;
  const pendentesPercent = total > 0 ? (statusCount.pendentes / total) * 100 : 0;
  const canceladasPercent = total > 0 ? (statusCount.canceladas / total) * 100 : 0;
  
  // Determine trends based on thresholds
  const fechadasTrend = fechadasPercent > 60 ? 'up' : fechadasPercent < 30 ? 'down' : 'neutral';
  const pendentesTrend = pendentesPercent > 40 ? 'down' : pendentesPercent < 20 ? 'up' : 'neutral';
  const canceladasTrend = canceladasPercent > 15 ? 'down' : canceladasPercent < 5 ? 'up' : 'neutral';
  const prazoMedioTrend = prazoMedio > 10 ? 'down' : prazoMedio < 5 ? 'up' : 'neutral';
  const foraDoPrazoTrend = foraDoPrazo > 10 ? 'down' : foraDoPrazo < 3 ? 'up' : 'neutral';

  return {
    fechadas: { 
      valor: `${Math.round(fechadasPercent)}%`, 
      comentario: "Finalizadas oficialmente",
      trend: fechadasTrend as 'up' | 'down' | 'neutral'
    },
    pendentes: { 
      valor: `${Math.round(pendentesPercent)}%`, 
      comentario: "Aguardando solução",
      trend: pendentesTrend as 'up' | 'down' | 'neutral'
    },
    canceladas: { 
      valor: `${Math.round(canceladasPercent)}%`, 
      comentario: "Encerradas sem execução",
      trend: canceladasTrend as 'up' | 'down' | 'neutral' 
    },
    prazo_medio: { 
      valor: `${prazoMedio.toFixed(1)} dias`, 
      comentario: "Tempo médio até execução",
      trend: prazoMedioTrend as 'up' | 'down' | 'neutral'
    },
    fora_do_prazo: { 
      valor: `${foraDoPrazo}`, 
      comentario: "Ultrapassaram período",
      trend: foraDoPrazoTrend as 'up' | 'down' | 'neutral'
    }
  };
}
