
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { problem, service, neighborhood, address, details } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um assistente especializado em criar conteúdo para demandas de uma subprefeitura. Seu objetivo é criar conteúdo claro, objetivo e profissional.'
          },
          { 
            role: 'user', 
            content: `Com base nas informações abaixo, gere um título conciso, um resumo da situação, e 3 perguntas pertinentes para uma área técnica:
            
            Problema: ${problem || ''}
            ${service ? `Serviço: ${service}` : ''}
            ${neighborhood ? `Bairro: ${neighborhood}` : ''}
            ${address ? `Endereço: ${address}` : ''}
            
            Detalhes da solicitação: ${details}
            
            Por favor, formate a resposta da seguinte maneira:
            Título: [título curto e objetivo]
            
            Resumo: [resumo conciso da situação em até 4 linhas]
            
            Perguntas:
            1. [primeira pergunta]
            2. [segunda pergunta]
            3. [terceira pergunta]`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    const generatedContent = data.choices[0].message.content;
    
    // Parse the generated content
    const titleMatch = generatedContent.match(/Título:\s*(.+?)(?:\r?\n|\r)/);
    const resumoMatch = generatedContent.match(/Resumo:\s*([\s\S]+?)(?:\r?\n|\r)(?:Perguntas:|$)/);
    const perguntasMatch = generatedContent.match(/Perguntas:\s*([\s\S]+)$/);

    const title = titleMatch ? titleMatch[1].trim() : '';
    const resumo = resumoMatch ? resumoMatch[1].trim() : '';
    let perguntas = [];
    
    if (perguntasMatch) {
      const perguntasText = perguntasMatch[1].trim();
      // Extract numbered questions
      const perguntasExtracted = perguntasText.split(/\d+\./).filter(q => q.trim().length > 0);
      perguntas = perguntasExtracted.map(p => p.trim());
    }

    return new Response(
      JSON.stringify({ 
        title, 
        resumo, 
        perguntas 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate content' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
