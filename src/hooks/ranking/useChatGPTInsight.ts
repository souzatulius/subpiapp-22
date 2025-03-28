
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

        // Primeiro verifica se já temos insights salvos para este upload
        if (uploadId) {
          const { data: existingInsights, error: fetchError } = await supabase
            .from('painel_zeladoria_insights')
            .select('indicadores')
            .eq('painel_id', uploadId)
            .order('data_geracao', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!fetchError && existingInsights) {
            setIndicadores(existingInsights.indicadores as Indicadores);
            setIsLoading(false);
            return;
          }
        }

        // Se não tiver dados salvos, gera novos insights
        const response = await fetch('/functions/v1/generate-sgz-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            dados_sgz: dadosPlanilha,
            upload_id: uploadId
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao gerar insights. Serviço indisponível.');
        }

        const data = await response.json();
        setIndicadores(data.indicadores);
      } catch (err: any) {
        console.error('Erro ao gerar insights:', err);
        setError(err.message || 'Erro ao gerar insights');
        toast.error('Não foi possível gerar análises de IA: ' + (err.message || 'Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    gerarInsights();
  }, [dadosPlanilha, uploadId]);

  return { indicadores, isLoading, error };
};
