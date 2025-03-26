
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
    
    // Format the prompt with the specific structure requested
    let promptContent = `Como assessor de imprensa da Subprefeitura de Pinheiros, crie uma nota de imprensa que utilize as informações abaixo e organize as ideias iniciando com:

"A Subprefeitura de Pinheiros informa/esclarece/avalia/alerta/ou outros verbos que..."

Desenvolva um, dois ou três parágrafos com tom institucional, informativo e claro.

Finalize com:

Subprefeitura de Pinheiros  
Prefeitura de São Paulo  
Data: ${demandInfo.currentDate}

INFORMAÇÕES SOBRE A DEMANDA:
`;
    
    // Add demand information
    promptContent += `Título/Resumo do problema: ${demandInfo.problemSummary}\n`;
    promptContent += `Tema/Área: ${demandInfo.theme}\n`;
    promptContent += `Local: ${demandInfo.location}\n`;
    promptContent += `Status: ${demandInfo.status}\n`;
    promptContent += `Prazo: ${demandInfo.deadline}\n`;
    
    // Add more details from the request if available
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "\nPERGUNTAS E RESPOSTAS:\n";
      responses.forEach((qa, index) => {
        promptContent += `Pergunta ${index + 1}: ${qa.question}\n`;
        promptContent += `Resposta ${index + 1}: ${qa.answer}\n\n`;
      });
    }
    
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
          { 
            role: 'system', 
            content: 'Você é um assessor de imprensa profissional que redige notas oficiais em nome da Subprefeitura de Pinheiros. Utilize linguagem institucional, clara e objetiva.' 
          },
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
