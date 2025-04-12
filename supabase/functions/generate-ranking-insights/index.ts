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
    const { sgz_data, painel_data, upload_id } = await req.json();
    
    if ((!sgz_data || sgz_data.length === 0) && (!painel_data || painel_data.length === 0)) {
      return new Response(JSON.stringify({
        error: 'Dados inválidos ou vazios',
        insights: generateDefaultInsights()
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a combined dataset for analysis
    const combinedData = {
      sgz: sgz_data || [],
      painel: painel_data || [],
    };

    // Extract insights using OpenAI
    const insights = await extractInsightsWithOpenAI(combinedData);

    // If we have an upload ID, save the insights
    if (upload_id) {
      try {
        await supabase
          .from('painel_zeladoria_insights')
          .insert({
            painel_id: upload_id,
            indicadores: insights
          });
      } catch (saveError) {
        console.error('Error saving insights:', saveError);
      }
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ranking-insights function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      insights: generateDefaultInsights()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Generate default insights when data is unavailable
 */
function generateDefaultInsights() {
  return {
    resumo: {
      total_os: 0,
      pendentes: 0,
      concluidas: 0,
      percentual_resolucao: 0,
      tempo_medio_dias: 0,
      consistencia_dados: 0
    },
    status: {
      message: "Não há dados suficientes para análise",
      recomendacoes: ["Faça upload dos dados SGZ e Painel da Zeladoria"]
    },
    distritos: {},
    servicos: {},
    responsaveis: {}
  };
}

/**
 * Extract insights from data using OpenAI
 */
async function extractInsightsWithOpenAI(data) {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API Key not found');
    return generateDefaultInsights();
  }
  
  try {
    // Prepare data summary for processing (to keep prompt size manageable)
    const sgzSummary = summarizeData(data.sgz, 'sgz');
    const painelSummary = summarizeData(data.painel, 'painel');
    
    // Create dataset statistics
    const stats = {
      sgz_count: data.sgz.length,
      painel_count: data.painel.length,
      sgz_status: countByField(data.sgz, 'sgz_status'),
      painel_status: countByField(data.painel, 'status'),
      sgz_distritos: countByField(data.sgz, 'sgz_distrito'),
      painel_distritos: countByField(data.painel, 'distrito'),
      sgz_servicos: countByField(data.sgz, 'sgz_tipo_servico'),
      painel_servicos: countByField(data.painel, 'tipo_servico'),
    };

    const prompt = `
Você é um analista especializado em dados de zeladoria urbana. Analise as estatísticas e amostras de ordens de serviço fornecidas e gere insights relevantes.

ESTATÍSTICAS DOS DADOS:
${JSON.stringify(stats, null, 2)}

AMOSTRA DE DADOS SGZ:
${JSON.stringify(sgzSummary, null, 2)}

AMOSTRA DE DADOS PAINEL:
${JSON.stringify(painelSummary, null, 2)}

SOLICITAÇÃO: 
Gere insights para um dashboard de zeladoria urbana no seguinte formato:

1. Um resumo com indicadores quantitativos (total de OS, % de resoluções, tempo médio em dias, consistência entre as bases).
2. Uma análise de status das OS, destacando pontos críticos e recomendações.
3. Os distritos com mais demandas e sua performance.
4. Os tipos de serviços mais solicitados e sua distribuição.
5. A análise de responsáveis pela execução dos serviços.

Responda em formato JSON estruturado assim:
{
  "resumo": {
    "total_os": número,
    "pendentes": número,
    "concluidas": número,
    "percentual_resolucao": porcentagem,
    "tempo_medio_dias": número,
    "consistencia_dados": porcentagem
  },
  "status": {
    "message": "análise dos status das OS",
    "pontos_criticos": ["ponto 1", "ponto 2"],
    "recomendacoes": ["recomendação 1", "recomendação 2"]
  },
  "distritos": {
    "mais_demandas": ["distrito 1", "distrito 2", "distrito 3"],
    "maior_tempo_resolucao": ["distrito 1", "distrito 2"],
    "menor_tempo_resolucao": ["distrito 1", "distrito 2"]
  },
  "servicos": {
    "mais_solicitados": ["serviço 1", "serviço 2", "serviço 3"],
    "maior_tempo_resolucao": ["serviço 1", "serviço 2"],
    "recomendacoes": ["recomendação 1", "recomendação 2"]
  },
  "responsaveis": {
    "distribuicao": {
      "subprefeitura": porcentagem,
      "enel": porcentagem,
      "sabesp": porcentagem, 
      "dzu": porcentagem,
      "outros": porcentagem
    },
    "performance": {
      "melhor": "nome",
      "pior": "nome"
    }
  }
}

Importante:
- Use apenas dados apresentados nas estatísticas e amostras
- Não inclua comentários e explicações externas
- Retorne apenas o JSON limpo
- Se não tiver dados suficientes para algum campo, use valores nulos ou arrays vazios
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um analista de dados especializado em zeladoria urbana, capaz de identificar padrões e fornecer insights relevantes.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    // Parse the JSON returned by OpenAI
    const contentText = result.choices[0].message.content.trim();
    
    // Try to extract JSON if there's any additional text
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : contentText;
    
    try {
      const insights = JSON.parse(jsonContent);
      return insights;
    } catch (jsonError) {
      console.error('Failed to parse OpenAI response as JSON:', jsonError);
      console.log('Response content:', contentText);
      return generateDefaultInsights();
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return generateDefaultInsights();
  }
}

/**
 * Create a summary of data for more efficient processing
 */
function summarizeData(data, prefix) {
  if (!data || data.length === 0) {
    return [];
  }
  
  // Take a sample of at most 20 records
  const sampleSize = Math.min(20, data.length);
  const step = Math.max(1, Math.floor(data.length / sampleSize));
  
  const sample = [];
  for (let i = 0; i < data.length; i += step) {
    if (sample.length < sampleSize) {
      sample.push(data[i]);
    }
  }
  
  return sample;
}

/**
 * Count occurrences of field values
 */
function countByField(data, field) {
  if (!data || data.length === 0) {
    return {};
  }
  
  const counts = {};
  
  data.forEach(item => {
    const value = item[field];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return counts;
}
