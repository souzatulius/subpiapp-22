
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIWithRetry } from '@/hooks/useOpenAIWithRetry';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { useRankingCharts } from './useRankingCharts';

// Add a type for the API response
interface InsightResponse {
  indicadores: Record<string, { valor: string; comentario: string }>;
  error?: string;
}

// Add a cache for OpenAI results
const insightsCache = new Map<string, any>();

export const useChatGPTInsight = (dadosPlanilha: any[] | null, uploadId?: string) => {
  const [indicadores, setIndicadores] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { callWithRetry, isLoading: isApiLoading } = useOpenAIWithRetry();
  const { showFeedback, updateFeedbackProgress, updateFeedbackMessage } = useAnimatedFeedback();
  const { setInsightsProgress, insightsProgress } = useRankingCharts();

  useEffect(() => {
    const fetchOrGenerateInsights = async () => {
      if (!dadosPlanilha || dadosPlanilha.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setInsightsProgress(10);
      showFeedback('loading', 'Gerando análise inteligente...', { 
        duration: 0, 
        progress: 10,
        stage: 'Iniciando análise'
      });
      
      try {
        // Check cache first if we have a cache key (uploadId)
        if (uploadId && insightsCache.has(uploadId)) {
          console.log('Using cached insights for upload', uploadId);
          setIndicadores(insightsCache.get(uploadId));
          setInsightsProgress(100);
          updateFeedbackProgress(100, 'Análise inteligente recuperada do cache');
          setIsLoading(false);
          return;
        }
        
        // Check for existing insights in database
        if (uploadId) {
          setInsightsProgress(20);
          updateFeedbackProgress(20, 'Verificando análises existentes...');
          
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
            setInsightsProgress(100);
            updateFeedbackProgress(100, 'Análise inteligente recuperada com sucesso');
            setTimeout(() => {
              showFeedback('success', 'Análise inteligente carregada', { duration: 2000 });
            }, 500);
            setIsLoading(false);
            return;
          }
        }

        // Progress update
        setInsightsProgress(30);
        updateFeedbackProgress(30, 'Enviando dados para processamento...');

        // Generate new insights using edge function with retry mechanism
        const response = await callWithRetry<InsightResponse>(
          'generate-sgz-insights', 
          { dados_sgz: dadosPlanilha, upload_id: uploadId },
          { maxRetries: 2, timeoutMs: 20000 }
        );
        
        if (!response) {
          throw new Error('Failed to generate insights');
        }
        
        if (response.error) {
          throw new Error(`Erro na análise: ${response.error}`);
        }
        
        // Progress update
        setInsightsProgress(90);
        updateFeedbackProgress(90, 'Finalizando análise...');
        
        setIndicadores(response.indicadores);
        
        // Update cache
        if (uploadId) {
          insightsCache.set(uploadId, response.indicadores);
        }
        
        // Final progress update
        setInsightsProgress(100);
        updateFeedbackProgress(100, 'Análise inteligente concluída');
        
        // Transition to success message
        setTimeout(() => {
          showFeedback('success', 'Análise inteligente gerada com sucesso', { duration: 2000 });
        }, 500);
      } catch (err: any) {
        console.error('Erro ao buscar ou gerar insights:', err);
        setError(err.message || 'Falha ao gerar indicadores');
        
        // Show error in feedback
        updateFeedbackMessage('Erro na geração de análise, usando estatísticas básicas', 'warning');
        
        // Fallback to static insights
        const fallbackInsights = gerarInsightsEstatisticos(dadosPlanilha);
        setIndicadores(fallbackInsights);
        
        setInsightsProgress(100);
        updateFeedbackProgress(100);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateInsights();
  }, [dadosPlanilha, uploadId, callWithRetry, showFeedback, updateFeedbackProgress, updateFeedbackMessage, setInsightsProgress]);

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
