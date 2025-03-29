
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatGPTInsight = (dadosPlanilha: any[] | null, uploadId?: string) => {
  const [indicadores, setIndicadores] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrGenerateInsights = async () => {
      if (!dadosPlanilha || dadosPlanilha.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Verificar se existem insights previamente gerados para este upload
        if (uploadId) {
          const { data: existingInsights } = await supabase
            .from('painel_zeladoria_insights')
            .select('*')
            .eq('painel_id', uploadId)
            .single();

          if (existingInsights) {
            setIndicadores(existingInsights.indicadores);
            setIsLoading(false);
            return;
          }
        }

        // Se não houver insights salvos, gerar novos (sem usar IA por enquanto)
        const insightsGerados = gerarInsightsEstatisticos(dadosPlanilha);
        
        // Salvar insights gerados no banco de dados se houver uploadId
        if (uploadId) {
          const { error: saveError } = await supabase
            .from('painel_zeladoria_insights')
            .insert({
              painel_id: uploadId,
              indicadores: insightsGerados
            });
            
          if (saveError) {
            console.error('Erro ao salvar insights:', saveError);
          }
        }
        
        setIndicadores(insightsGerados);
      } catch (err) {
        console.error('Erro ao buscar ou gerar insights:', err);
        setError('Falha ao gerar indicadores');
        // Fallback para indicadores gerados estatisticamente
        setIndicadores(gerarInsightsEstatisticos(dadosPlanilha));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateInsights();
  }, [dadosPlanilha, uploadId]);

  return { indicadores, isLoading, error };
};

// Função para gerar insights estatísticos sem depender de IA
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
  
  // Retornar insights estruturados
  return {
    fechadas: {
      valor: `${porcentagemFechadas.toFixed(1)}%`,
      comentario: `${osFechadas} de ${totalOS} OS foram concluídas. ${
        porcentagemFechadas > 70 
          ? "Excelente taxa de conclusão!"
          : porcentagemFechadas > 50 
            ? "Taxa de conclusão moderada."
            : "Há oportunidade para melhorar a taxa de conclusão."
      }`
    },
    pendentes: {
      valor: `${porcentagemPendentes.toFixed(1)}%`,
      comentario: `${osPendentes} OS ainda estão pendentes de atendimento. ${
        porcentagemPendentes < 20 
          ? "Baixa quantidade de pendências!"
          : porcentagemPendentes < 40 
            ? "Volume moderado de pendências."
            : "Alto volume de pendências a resolver."
      }`
    },
    canceladas: {
      valor: `${porcentagemCanceladas.toFixed(1)}%`,
      comentario: `${osCanceladas} OS foram canceladas. ${
        porcentagemCanceladas < 10 
          ? "Baixa taxa de cancelamento."
          : porcentagemCanceladas < 20 
            ? "Taxa de cancelamento dentro do esperado."
            : "Taxa de cancelamento elevada, verificar causas."
      }`
    },
    prazo_medio: {
      valor: `${tempoMedioAtendimento.toFixed(1)} dias`,
      comentario: `Tempo médio para atendimento das OS. ${
        tempoMedioAtendimento < 15 
          ? "Prazo bastante satisfatório!"
          : tempoMedioAtendimento < 30 
            ? "Prazo de atendimento adequado."
            : "Prazo médio elevado, verificar gargalos."
      }`
    },
    fora_do_prazo: {
      valor: `${osForaPrazo} OS`,
      comentario: `OS pendentes há mais de 30 dias. ${
        osForaPrazo === 0 
          ? "Não há OS fora do prazo!"
          : osForaPrazo < 10 
            ? "Poucos casos fora do prazo."
            : "Quantidade significativa de OS fora do prazo."
      }`
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
