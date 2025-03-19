
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
    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key not configured. Please set the OPENAI_API_KEY secret in the Supabase dashboard." 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { demandInfo, responses } = await req.json();
    
    // Validate input data
    if (!demandInfo) {
      return new Response(
        JSON.stringify({ error: "Dados da demanda não fornecidos" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Format the demand information and responses for the prompt
    let promptContent = `Você é um especialista em comunicação institucional. Preciso que você crie uma nota oficial com base nas seguintes informações:\n\n`;
    
    // Add demand information
    promptContent += `Título da Demanda: ${demandInfo.titulo}\n`;
    if (demandInfo.areas_coordenacao?.descricao) {
      promptContent += `Área: ${demandInfo.areas_coordenacao.descricao}\n`;
    }
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "Perguntas e Respostas:\n";
      responses.forEach(qa => {
        promptContent += `Pergunta: ${qa.pergunta}\n`;
        promptContent += `Resposta: ${qa.resposta}\n\n`;
      });
    }
    
    promptContent += `Por favor, crie uma nota oficial clara e objetiva com base nas informações acima. A nota deve ter um tom formal e institucional, e deve abordar os principais pontos apresentados nas perguntas e respostas. Formate o resultado com um título sugestivo na primeira linha, seguido por um conteúdo bem estruturado.`;

    console.log("Enviando prompt para OpenAI:", promptContent);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é um especialista em comunicação institucional, especializado em redigir notas oficiais.' },
            { role: 'user', content: promptContent }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(errorData.error?.message || "Erro na API do OpenAI: " + response.status);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenAI API error:", data.error);
        throw new Error(data.error.message || "Erro na API do OpenAI");
      }
      
      const suggestion = data.choices[0].message.content;
      console.log("Recebida sugestão da OpenAI");

      return new Response(JSON.stringify({ suggestion }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAiError) {
      console.error('Erro ao chamar a API da OpenAI:', openAiError);
      return new Response(JSON.stringify({ error: openAiError.message || "Erro ao comunicar com OpenAI" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Erro na função generate-note-suggestion:', error);
    return new Response(JSON.stringify({ error: error.message || "Ocorreu um erro ao gerar a sugestão" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
