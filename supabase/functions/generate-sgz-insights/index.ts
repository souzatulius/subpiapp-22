
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
    
    if (!dados_sgz || dados_sgz.length === 0) {
      return new Response(JSON.stringify({
        error: 'Dados inválidos ou vazios',
        indicadores: generateDefaultIndicadores()
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Convert data to a simplified CSV structure for OpenAI processing
    const csvContent = convertToSimplifiedCSV(dados_sgz);
    
    // Extract key metrics using OpenAI
    const indicadores = await extractMetricsWithOpenAI(csvContent);

    // Save insights to database if upload_id is provided
    if (upload_id) {
      try {
        const { data, error } = await supabase
          .from('painel_zeladoria_insights')
          .insert({
            painel_id: upload_id,
            indicadores
          });
          
        if (error) {
          console.error('Error saving insights to database:', error);
        }
      } catch (saveError) {
        console.error('Exception saving insights:', saveError);
      }
    }

    return new Response(JSON.stringify({ indicadores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-sgz-insights function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      indicadores: generateDefaultIndicadores()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateDefaultIndicadores() {
  return {
    fechadas: {
      valor: "0%",
      comentario: "Nenhum dado disponível para processamento"
    },
    pendentes: {
      valor: "0%",
      comentario: "Nenhum dado disponível para processamento"
    },
    canceladas: {
      valor: "0%",
      comentario: "Nenhum dado disponível para processamento"
    },
    prazo_medio: {
      valor: "0 dias",
      comentario: "Nenhum dado disponível para processamento"
    },
    fora_do_prazo: {
      valor: "0 OS",
      comentario: "Nenhum dado disponível para processamento"
    },
    tipo_frequente: {
      valor: "N/A",
      comentario: "Nenhum dado disponível para processamento"
    },
    distrito_destaque: {
      valor: "N/A",
      comentario: "Nenhum dado disponível para processamento"
    }
  };
}

function convertToSimplifiedCSV(data) {
  // Identify common column names in the data
  const sampleRow = data[0] || {};
  const headers = Object.keys(sampleRow);
  
  // Create CSV headers
  let csvOutput = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const rowValues = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvOutput += rowValues.join(',') + '\n';
  });
  
  return csvOutput;
}

async function extractMetricsWithOpenAI(csvContent) {
  try {
    // Prepare the prompt for OpenAI
    const prompt = `Você receberá o conteúdo de uma planilha contendo ordens de serviço públicas, com colunas como: número da OS, tipo de serviço, status, data de abertura, data de encerramento, distrito, prazo de atendimento, e responsável (quando aplicável).  
Sua tarefa é processar a planilha como se fosse um analista de dados e retornar os indicadores solicitados no seguinte formato JSON.

Extraia os seguintes dados:

{
  "kpis": {
    "total_os": ...,
    "os_fechadas": ...,
    "os_pendentes": ...,
    "os_canceladas": ...,
    "os_fora_do_prazo": ...,
    "media_dias_atendimento": ...
  },
  "por_distrito": {
    "Pinheiros": ...,
    "Itaim Bibi": ...,
    ...
  },
  "por_status": {
    "Novo": ...,
    "Planejado": ...,
    "Em Andamento": ...,
    "Concluído": ...,
    "Cancelado": ...
  },
  "por_responsavel": {
    "subprefeitura": ...,
    "enel": ...,
    "sabesp": ...,
    "dzu": ...,
    "selimp": ...,
    "outros": ...
  },
  "por_tipo_servico_agrupado": {
    "Poda Remoção Árvores": ...,
    "Tapa Buraco": ...,
    "Limpeza de Córregos e Bocas de Lobo": ...,
    "Conservação de Logradouros": ...,
    "Limpeza Urbana": ...
  },
  "tempo_medio_por_status": {
    "Novo": ...,
    "Planejado": ...,
    "Concluído": ...,
    "Cancelado": ...
  },
  "mais_frequentes": [
    {"servico": "Poda Remoção Árvores", "quantidade": ...},
    {"servico": "Tapa Buraco", "quantidade": ...},
    {"servico": "Conservação de Logradouros", "quantidade": ...}
  ]
}

Importante:
- Considere que datas podem vir em formatos variados e padronize internamente.
- Calcule o tempo médio de atendimento considerando a diferença entre data de abertura e encerramento (se houver).
- Os nomes dos distritos, serviços e status devem ser tratados com padronização (case insensitive, remover acentos).
- Retorne **somente o JSON**, sem explicações.

Aqui está o conteúdo CSV da planilha:

${csvContent}`;

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
          { role: 'system', content: 'Você é um assistente especializado em análise de dados, capaz de processar planilhas e gerar insights numéricos.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    // Parse the JSON returned by OpenAI
    const responseText = data.choices[0].message.content.trim();
    
    // Try to extract JSON if there's any additional text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      const metricsJson = JSON.parse(jsonContent);
      
      // Convert to the format expected by the frontend
      return formatMetricsForFrontend(metricsJson);
    } catch (jsonError) {
      console.error('Failed to parse OpenAI response as JSON:', jsonError);
      console.error('Response content:', responseText);
      throw new Error('Failed to parse analytics data');
    }
  } catch (error) {
    console.error('Error in OpenAI processing:', error);
    return generateDefaultIndicadores();
  }
}

function formatMetricsForFrontend(metrics) {
  // Format the metrics from OpenAI into the structure expected by the frontend
  const kpis = metrics.kpis || {};
  const totalOS = kpis.total_os || 0;
  
  // Calculate percentages
  const osFechadasPercent = totalOS > 0 ? Math.round((kpis.os_fechadas / totalOS) * 100) : 0;
  const osPendentesPercent = totalOS > 0 ? Math.round((kpis.os_pendentes / totalOS) * 100) : 0;
  const osCanceladasPercent = totalOS > 0 ? Math.round((kpis.os_canceladas / totalOS) * 100) : 0;
  
  // Find most frequent service
  const maisFrequente = metrics.mais_frequentes && metrics.mais_frequentes.length > 0 
    ? metrics.mais_frequentes[0] 
    : { servico: "N/A", quantidade: 0 };
  
  // Find district with most orders
  const distritos = metrics.por_distrito || {};
  let distritoDestaque = { nome: "N/A", quantidade: 0 };
  
  Object.entries(distritos).forEach(([distrito, qtd]) => {
    if (qtd > distritoDestaque.quantidade) {
      distritoDestaque = { nome: distrito, quantidade: qtd };
    }
  });
  
  return {
    fechadas: {
      valor: `${osFechadasPercent}%`,
      comentario: "Ordens de serviço finalizadas oficialmente"
    },
    pendentes: {
      valor: `${osPendentesPercent}%`,
      comentario: "Ainda em aberto, aguardando solução"
    },
    canceladas: {
      valor: `${osCanceladasPercent}%`,
      comentario: "Solicitações encerradas sem execução"
    },
    prazo_medio: {
      valor: `${kpis.media_dias_atendimento?.toFixed(1) || 0} dias`,
      comentario: "Média de dias entre abertura e execução das ordens"
    },
    fora_do_prazo: {
      valor: `${kpis.os_fora_do_prazo || 0} OS`,
      comentario: "Ultrapassaram o prazo de atendimento"
    },
    tipo_frequente: {
      valor: maisFrequente.servico,
      comentario: `O tipo de serviço mais frequente representa ${
        totalOS > 0 ? ((maisFrequente.quantidade / totalOS) * 100).toFixed(1) : 0
      }% do total.`
    },
    distrito_destaque: {
      valor: distritoDestaque.nome,
      comentario: `O distrito com mais demandas representa ${
        totalOS > 0 ? ((distritoDestaque.quantidade / totalOS) * 100).toFixed(1) : 0
      }% do total.`
    },
    // Add all the raw data for charts
    raw_data: metrics
  };
}
