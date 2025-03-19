
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
    const { demandInfo, responses } = await req.json();
    
    // Format the demand information and responses for the prompt
    let promptContent = `Você é um especialista em comunicação institucional. Preciso que você crie uma nota oficial com base nas seguintes informações:\n\n`;
    
    // Add demand information
    promptContent += `Título da Demanda: ${demandInfo.titulo}\n`;
    if (demandInfo.area_coordenacao) {
      promptContent += `Área: ${demandInfo.area_coordenacao.descricao}\n`;
    }
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "Perguntas e Respostas:\n";
      responses.forEach(qa => {
        promptContent += `Pergunta: ${qa.question}\n`;
        promptContent += `Resposta: ${qa.answer}\n\n`;
      });
    }
    
    promptContent += `Por favor, crie uma nota oficial clara e objetiva com base nas informações acima. A nota deve ter um tom formal e institucional, e deve abordar os principais pontos apresentados nas perguntas e respostas.`;

    console.log("Sending prompt to OpenAI:", promptContent);
    
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

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message || "Erro na API do OpenAI");
    }
    
    const suggestion = data.choices[0].message.content;
    console.log("Received suggestion from OpenAI");

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-note-suggestion function:', error);
    return new Response(JSON.stringify({ error: error.message || "Ocorreu um erro ao gerar a sugestão" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
