
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured in Supabase');
    }

    // Parse the request body
    const { releaseContent } = await req.json();
    if (!releaseContent) {
      throw new Error('No release content provided');
    }

    // Create a prompt for OpenAI with the new instructions
    const prompt = `
      Com base no conteúdo do release, escreva uma notícia institucional clara, direta e adequada para publicação no site da Subprefeitura de Pinheiros.

      Gere apenas título e texto.

      No texto, tente gerar ao menos 3 parágrafos. Contribua com sugestões que não alterem a mensagem principal.

      Não inclua subtítulo, legenda de imagem ou emojis.

      Estruture o texto com um parágrafo de abertura objetivo (lead) seguido por informações complementares organizadas em ordem de importância.

      Use linguagem acessível e tom institucional.

      Quando aplicável, inclua um parágrafo de serviço com data, local, horário, link para mais informações e, se houver, valor do ingresso ou instruções de participação.

      Se o evento não for diretamente relacionado a Pinheiros, mantenha o foco na contribuição para a cidade ou a importância para os moradores da região.
      
      Formate a resposta no seguinte formato JSON com duas chaves: 'titulo' e 'conteudo'.
      
      Release original:
      ${releaseContent}
    `;

    // Call OpenAI API
    console.log("Calling OpenAI API for news generation with updated prompt");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um assessor de imprensa especializado em transformar releases em notícias jornalísticas.' },
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
    
    // Extract the generated content
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedResponse;
    try {
      // Look for JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        // If not in JSON format, create a basic structure
        const lines = aiResponse.split('\n').filter(line => line.trim() !== '');
        parsedResponse = {
          titulo: lines[0] || 'Título da notícia',
          conteudo: lines.slice(1).join('\n') || 'Conteúdo da notícia'
        };
      }
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      // Fallback structure
      parsedResponse = {
        titulo: 'Título da notícia gerada',
        conteudo: aiResponse
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: parsedResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-news function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Error generating news" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
