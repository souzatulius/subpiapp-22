
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIWithRetry } from '@/hooks/useOpenAIWithRetry';
import { toast } from 'sonner';

// Add a cache for OpenAI results
const insightsCache = new Map<string, any>();

export const useChatGPTInsight = (dadosPlanilha: any[] | null, uploadId?: string) => {
  const [indicadores, setIndicadores] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { callWithRetry, isLoading: isApiLoading } = useOpenAIWithRetry();

  useEffect(() => {
    const fetchOrGenerateInsights = async () => {
      if (!dadosPlanilha || dadosPlanilha.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Check cache first if we have a cache key (uploadId)
        if (uploadId && insightsCache.has(uploadId)) {
          console.log('Using cached insights for upload', uploadId);
          setIndicadores(insightsCache.get(uploadId));
          setIsLoading(false);
          return;
        }
        
        // Check for existing insights in database
        if (uploadId) {
          const { data: existingInsights, error: fetchError } = await supabase
            .from('painel_zeladoria_insights')
            .select('*')
            .eq('painel_id', uploadId)
            .maybeSingle();

          if (fetchError) {
            console.warn('Error fetching insights:', fetchError);
          }

          if (existingInsights) {
            setIndicadores(existingInsights.indicadores);
            // Update cache
            insightsCache.set(uploadId, existingInsights.indicadores);
            setIsLoading(false);
            return;
          }
        }

        // Generate new insights using edge function with retry mechanism
        const data = await callWithRetry(
          'generate-sgz-insights', 
          { dados_sgz: dadosPlanilha, upload_id: uploadId },
          { maxRetries: 2, timeoutMs: 20000 }
        );
        
        if (!data) {
          throw new Error('Failed to generate insights');
        }
        
        if (data.error) {
          throw new Error(`Erro na análise: ${data.error}`);
        }
        
        setIndicadores(data.indicadores);
        
        // Update cache
        if (uploadId) {
          insightsCache.set(uploadId, data.indicadores);
        }
        
        // Notify user of success
        toast.success('Análise inteligente gerada com sucesso');
      } catch (err: any) {
        console.error('Erro ao buscar ou gerar insights:', err);
        setError(err.message || 'Falha ao gerar indicadores');
        // Fallback to static insights
        const fallbackInsights = gerarInsightsEstatisticos(dadosPlanilha);
        setIndicadores(fallbackInsights);
        toast.error('Usando análise estatística devido a erro na IA');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateInsights();
  }, [dadosPlanilha, uploadId, callWithRetry]);

  return { indicadores, isLoading, error };
};

// Function to generate statistical insights without AI dependency
function gerarInsightsEstatisticos(dados: any[]) {
  if (!dados || dados.length === 0) {
    return null;
  }
  
  // Contadores para cálculo de porcentagens
  let totalOS = dados.length;
  let osFechadas = 0;
  let osPendentes = 0;
  let osCanceladas = 0;
  let somaTempoAtendimento = 0;
  let osForaPrazo = 0;
  
  // Contar status
  dados.forEach(os => {
    const status = (os.sgz_status || '').toUpperCase();
    const diasAteStatus = parseInt(os.sgz_dias_ate_status_atual) || 0;
    
    somaTempoAtendimento += diasAteStatus;
    
    if (status.includes('CONC') || status.includes('FECHA')) {
      osFechadas++;
    } else if (status.includes('CANC')) {
      osCanceladas++;
    } else {
      osPendentes++;
      
      // Considerar fora do prazo se pendente por mais de 30 dias
      if (diasAteStatus > 30) {
        osForaPrazo++;
      }
    }
  });
  
  // Calcular porcentagens e médias
  const porcentagemFechadas = (osFechadas / totalOS) * 100;
  const porcentagemPendentes = (osPendentes / totalOS) * 100;
  const porcentagemCanceladas = (osCanceladas / totalOS) * 100;
  const tempoMedioAtendimento = somaTempoAtendimento / totalOS;
  
  // Analisar os tipos de serviços mais frequentes
  const tiposServico: Record<string, number> = {};
  dados.forEach(os => {
    const tipo = os.sgz_tipo_servico || 'Não especificado';
    tiposServico[tipo] = (tiposServico[tipo] || 0) + 1;
  });
  
  // Ordenar tipos por frequência
  const tiposOrdenados = Object.entries(tiposServico)
    .sort((a, b) => b[1] - a[1])
    .map(([tipo, qtd]) => ({ tipo, qtd }));
  
  const tipoMaisFrequente = tiposOrdenados[0]?.tipo || 'Não disponível';
  const qtdTipoMaisFrequente = tiposOrdenados[0]?.qtd || 0;
  
  // Distritos com mais OS
  const distritos: Record<string, number> = {};
  dados.forEach(os => {
    const distrito = os.sgz_distrito || 'Não especificado';
    distritos[distrito] = (distritos[distrito] || 0) + 1;
  });
  
  const distritosOrdenados = Object.entries(distritos)
    .sort((a, b) => b[1] - a[1])
    .map(([distrito, qtd]) => ({ distrito, qtd }));
  
  const distritoMaisOS = distritosOrdenados[0]?.distrito || 'Não disponível';
  const qtdDistritoMaisOS = distritosOrdenados[0]?.qtd || 0;
  
  // Retornar insights estruturados com as novas descrições solicitadas
  return {
    fechadas: {
      valor: `${porcentagemFechadas.toFixed(1)}%`,
      comentario: "Ordens de serviço finalizadas oficialmente"
    },
    pendentes: {
      valor: `${porcentagemPendentes.toFixed(1)}%`,
      comentario: "Ainda em aberto, aguardando solução"
    },
    canceladas: {
      valor: `${porcentagemCanceladas.toFixed(1)}%`,
      comentario: "Solicitações encerradas sem execução"
    },
    prazo_medio: {
      valor: `${tempoMedioAtendimento.toFixed(1)} dias`,
      comentario: "Média de dias entre abertura e execução das ordens"
    },
    fora_do_prazo: {
      valor: `${osForaPrazo} OS`,
      comentario: "Ultrapassaram o prazo de atendimento"
    },
    tipo_frequente: {
      valor: tipoMaisFrequente,
      comentario: `O tipo de serviço mais frequente representa ${
        (qtdTipoMaisFrequente / totalOS * 100).toFixed(1)
      }% do total.`
    },
    distrito_destaque: {
      valor: distritoMaisOS,
      comentario: `O distrito com mais demandas representa ${
        (qtdDistritoMaisOS / totalOS * 100).toFixed(1)
      }% do total.`
    }
  };
}
