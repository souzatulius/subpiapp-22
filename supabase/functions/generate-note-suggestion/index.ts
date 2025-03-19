
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

    const reqData = await req.json();
    const { demandInfo, responses } = reqData;
    
    console.log("Received request data:", JSON.stringify({ 
      demandInfoKeys: demandInfo ? Object.keys(demandInfo) : null,
      responsesLength: responses ? responses.length : 0 
    }));
    
    // Validate input data
    if (!demandInfo) {
      return new Response(
        JSON.stringify({ error: "Dados da demanda não fornecidos" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Format the demand information and responses for the prompt
    let promptContent = `Você é assessor de imprensa da Subprefeitura de Pinheiros. Sua tarefa é gerar uma nota de imprensa baseada nos dados da solicitação desta página. Observe as informações, perguntas cadastradas e respostas fornecidas por nossas áreas técnicas. Inicie sempre com A Subprefeitura de Pinheiros informa/esclarece/reforça/alerta ou outro verbo. Gere um texto formal, com tom informativo e objetivo.\n\n`;
    
    // Add demand information
    promptContent += `Título da Demanda: ${demandInfo.titulo || 'Não fornecido'}\n`;
    if (demandInfo.areas_coordenacao?.descricao) {
      promptContent += `Área: ${demandInfo.areas_coordenacao.descricao}\n`;
    }
    if (demandInfo.detalhes_solicitacao) {
      promptContent += `Detalhes da Solicitação: ${demandInfo.detalhes_solicitacao}\n\n`;
    }
    
    // Add Q&A if available
    if (responses && responses.length > 0) {
      promptContent += "Perguntas e Respostas:\n";
      responses.forEach((qa: { pergunta: string, resposta: string }) => {
        promptContent += `Pergunta: ${qa.pergunta || 'Não fornecida'}\n`;
        promptContent += `Resposta: ${qa.resposta || 'Não fornecida'}\n\n`;
      });
    }
    
    promptContent += `Lembre-se: inicie sempre com "A Subprefeitura de Pinheiros" seguido por um verbo como informa, esclarece, reforça, alerta, etc. O tom deve ser formal, informativo e objetivo. Formate o resultado com um título sugestivo na primeira linha, seguido pelo conteúdo bem estruturado.`;

    console.log("Sending prompt to OpenAI:", promptContent.substring(0, 200) + "...");
    
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
            { role: 'system', content: 'Você é um assessor de imprensa especializado em comunicações oficiais para a Subprefeitura de Pinheiros.' },
            { role: 'user', content: promptContent }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const responseStatus = response.status;
      console.log("OpenAI API response status:", responseStatus);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        return new Response(
          JSON.stringify({ error: `Erro na API do OpenAI: ${responseStatus} - ${errorText}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log("OpenAI API response received");
      
      if (!data.choices || !data.choices[0]) {
        console.error("Unexpected OpenAI API response format:", data);
        return new Response(
          JSON.stringify({ error: "Formato de resposta inesperado da OpenAI" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const suggestion = data.choices[0].message.content;
      console.log("Suggestion from OpenAI:", suggestion.substring(0, 100) + "...");

      return new Response(
        JSON.stringify({ suggestion }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openAiError) {
      console.error('Error calling OpenAI API:', openAiError);
      return new Response(
        JSON.stringify({ error: openAiError.message || "Erro ao comunicar com OpenAI" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-note-suggestion function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Ocorreu um erro ao gerar a sugestão" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
