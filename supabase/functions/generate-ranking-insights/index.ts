
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    const { tipo, dados } = await req.json();
    
    if (tipo !== 'indicadores' || !dados) {
      throw new Error('Tipo inválido ou dados ausentes');
    }

    // Extrair dados para gerar o prompt
    const { total, fechadas, pendentes, canceladas, conc, prazoMedio, foraDoPrazo } = dados;

    // Construir o prompt para o OpenAI
    const prompt = `Com base nos seguintes dados:
Total de OS: ${total}
Fechadas: ${fechadas}
Pendentes: ${pendentes}
Canceladas: ${canceladas}
Concluídas (CONC): ${conc}
Prazo médio: ${prazoMedio.toFixed(1)} dias
Pendências fora do prazo: ${foraDoPrazo}

Crie um resumo para cada indicador abaixo, com um número e um insight para painel de gestão:
1. % de OS Fechadas
2. % de OS Pendentes
3. % de OS Canceladas
4. Prazo médio de conclusão
5. Pendências fora do prazo

Formato de resposta (em JSON):
{
  "fechadas": { "valor": "...", "comentario": "..." },
  "pendentes": { "valor": "...", "comentario": "..." },
  "canceladas": { "valor": "...", "comentario": "..." },
  "prazo_medio": { "valor": "...", "comentario": "..." },
  "fora_do_prazo": { "valor": "...", "comentario": "..." }
}`;

    // Chamar a API do OpenAI
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
            content: 'Você é um analista de dados especializado em gestão pública municipal. Forneça insights concisos para indicadores de ordens de serviço da zeladoria urbana.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message || "Erro na API do OpenAI");
    }
    
    // Extrair a resposta gerada pelo modelo
    const aiResponse = data.choices[0].message.content;
    
    // Tentar converter a resposta para JSON
    let insights;
    try {
      // Procura por um objeto JSON válido no texto retornado
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (e) {
      console.error("Erro ao fazer parse da resposta:", e);
      console.log("Resposta original:", aiResponse);
      
      // Criar um formato de fallback se o parsing falhar
      insights = {
        fechadas: { 
          valor: `${Math.round((fechadas / total) * 100)}%`, 
          comentario: "Taxa de conclusão de ordens de serviço." 
        },
        pendentes: { 
          valor: `${Math.round((pendentes / total) * 100)}%`, 
          comentario: "Ordens de serviço ainda não concluídas." 
        },
        canceladas: { 
          valor: `${Math.round((canceladas / total) * 100)}%`, 
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

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ranking-insights function:', error);
    return new Response(JSON.stringify({ error: error.message || "Ocorreu um erro ao gerar os insights" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
