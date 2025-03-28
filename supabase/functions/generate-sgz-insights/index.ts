
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dados_sgz, upload_id } = await req.json();
    
    if (!dados_sgz) {
      throw new Error('Dados da planilha SGZ não fornecidos');
    }

    // Preparar um resumo dos dados para enviar para o modelo
    const dadosResumo = {
      totalOS: dados_sgz.length,
      statusDistribuicao: contarPorStatus(dados_sgz),
      distritosDistribuicao: contarPorDistrito(dados_sgz),
      tiposServicoDistribuicao: contarPorTipoServico(dados_sgz),
      tempoMedioResolucao: calcularTempoMedioResolucao(dados_sgz),
    };

    // Preparar contagem para calcular percentuais
    const statusCounts = dadosResumo.statusDistribuicao;
    const total = dados_sgz.length;
    
    // Calcular percentuais e valores para os indicadores
    const fechadasPercent = calcularPercentual(statusCounts['CONCLUIDA'] || 0, total);
    const pendentesPercent = calcularPercentual(statusCounts['EM ANDAMENTO'] || 0, total);
    const canceladasPercent = calcularPercentual(statusCounts['CANCELADA'] || 0, total);
    const prazoMedio = dadosResumo.tempoMedioResolucao.toFixed(1);
    
    // Contar OS fora do prazo (mais de 15 dias)
    const foraDoPrazo = contarForaDoPrazo(dados_sgz);

    // Gerar insights com OpenAI para cada indicador
    const insightFechadas = await gerarInsightOpenAI("Fechadas", fechadasPercent, dadosResumo);
    const insightPendentes = await gerarInsightOpenAI("Pendentes", pendentesPercent, dadosResumo);
    const insightCanceladas = await gerarInsightOpenAI("Canceladas", canceladasPercent, dadosResumo);
    const insightPrazoMedio = await gerarInsightOpenAI("Prazo Médio", prazoMedio, dadosResumo);
    const insightForaPrazo = await gerarInsightOpenAI("Fora do Prazo", foraDoPrazo, dadosResumo);

    // Estruturar a resposta
    const indicadores = {
      fechadas: { 
        valor: `${fechadasPercent}%`, 
        comentario: insightFechadas 
      },
      pendentes: { 
        valor: `${pendentesPercent}%`, 
        comentario: insightPendentes 
      },
      canceladas: { 
        valor: `${canceladasPercent}%`, 
        comentario: insightCanceladas 
      },
      prazo_medio: { 
        valor: `${prazoMedio} dias`, 
        comentario: insightPrazoMedio 
      },
      fora_do_prazo: { 
        valor: `${foraDoPrazo} OS`, 
        comentario: insightForaPrazo 
      }
    };

    // Salvar os insights no banco de dados
    if (upload_id) {
      const { data: painelData, error: painelError } = await supabase
        .from('painel_zeladoria_insights')
        .insert({
          painel_id: upload_id,
          indicadores
        })
        .select();
        
      if (painelError) {
        console.error('Erro ao salvar insights:', painelError);
      }
    }

    return new Response(JSON.stringify({ indicadores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função generate-sgz-insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Função para contar ordens por status
function contarPorStatus(dados: any[]) {
  const contagem = {};
  dados.forEach(item => {
    const status = item.sgz_status || 'NÃO INFORMADO';
    contagem[status] = (contagem[status] || 0) + 1;
  });
  return contagem;
}

// Função para contar ordens por distrito
function contarPorDistrito(dados: any[]) {
  const contagem = {};
  dados.forEach(item => {
    const distrito = item.sgz_distrito || 'NÃO INFORMADO';
    contagem[distrito] = (contagem[distrito] || 0) + 1;
  });
  return contagem;
}

// Função para contar ordens por tipo de serviço
function contarPorTipoServico(dados: any[]) {
  const contagem = {};
  dados.forEach(item => {
    const tipoServico = item.sgz_tipo_servico || 'NÃO INFORMADO';
    contagem[tipoServico] = (contagem[tipoServico] || 0) + 1;
  });
  return contagem;
}

// Função para calcular tempo médio de resolução
function calcularTempoMedioResolucao(dados: any[]) {
  const ordensConcluidas = dados.filter(item => item.sgz_status === 'CONCLUIDA' && item.sgz_dias_ate_status_atual);
  if (ordensConcluidas.length === 0) return 0;
  
  const somaTempos = ordensConcluidas.reduce((soma, item) => soma + (item.sgz_dias_ate_status_atual || 0), 0);
  return somaTempos / ordensConcluidas.length;
}

// Função para contar ordens fora do prazo
function contarForaDoPrazo(dados: any[]) {
  return dados.filter(item => (item.sgz_dias_ate_status_atual || 0) > 15).length;
}

// Função para calcular percentual
function calcularPercentual(valor: number, total: number) {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
}

// Função para gerar insight usando OpenAI
async function gerarInsightOpenAI(indicador: string, valor: any, dadosResumo: any) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um analista de dados especializado em gestão pública municipal. Forneça insights concisos (máximo 100 caracteres) para indicadores de ordens de serviço da zeladoria urbana.' 
          },
          { 
            role: 'user', 
            content: `
              Gere um insight conciso (limite de 100 caracteres) para o indicador "${indicador}" com valor ${valor}.
              
              Dados de contexto:
              - Total de ordens de serviço: ${dadosResumo.totalOS}
              - Distribuição por status: ${JSON.stringify(dadosResumo.statusDistribuicao)}
              - Distribuição por distrito: ${JSON.stringify(dadosResumo.distritosDistribuicao)}
              - Tempo médio de resolução: ${dadosResumo.tempoMedioResolucao.toFixed(1)} dias
              
              Seu insight deve ser informativo e orientado a ação quando relevante.
            `
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao gerar insight com OpenAI:', error);
    return `Análise indisponível para indicador ${indicador}.`;
  }
}
