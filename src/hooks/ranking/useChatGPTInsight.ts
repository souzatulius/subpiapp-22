
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Indicador {
  valor: string;
  comentario: string;
}

interface Indicadores {
  fechadas: Indicador;
  pendentes: Indicador;
  canceladas: Indicador;
  prazo_medio: Indicador;
  fora_do_prazo: Indicador;
}

interface ChatGPTInsightResult {
  indicadores: Indicadores | null;
  isLoading: boolean;
  error: string | null;
}

export const useChatGPTInsight = (dadosPlanilha: any[], uploadId?: string): ChatGPTInsightResult => {
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dadosPlanilha || dadosPlanilha.length === 0) {
      setIsLoading(false);
      return;
    }

    const gerarInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

        // Chamar a edge function via SDK do Supabase
        const { data, error: invokeError } = await supabase.functions.invoke('generate-ranking-insights', {
          body: { tipo: 'indicadores', dados }
        });

        if (invokeError) {
          throw new Error(`Falha ao chamar a edge function: ${invokeError.message}`);
        }

        if (data && data.insights) {
          setIndicadores(data.insights as Indicadores);
        } else {
          throw new Error('Formato de resposta inválido da edge function');
        }
      } catch (err: any) {
        console.error('Erro ao gerar insights:', err);
        setError(err.message || 'Erro ao gerar insights');
        toast.error('Não foi possível gerar análises de IA: ' + (err.message || 'Erro desconhecido'));
        
        // Fallback para valores padrão em caso de erro
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
        
        setIndicadores({
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
        });
      } finally {
        setIsLoading(false);
      }
    };

    gerarInsights();
  }, [dadosPlanilha]);

  return { indicadores, isLoading, error };
};

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
